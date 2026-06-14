import os
import glob
from groq import Groq
import chromadb
from chromadb.utils import embedding_functions

# ── Config ────────────────────────────────────────────────────────────────────
KNOWLEDGE_BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "knowledge_base")
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")
COLLECTION_NAME = "ai_support_pro_docs"
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# ── Embedding function (uses sentence-transformers, runs locally) ──────────────
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# ── ChromaDB client ───────────────────────────────────────────────────────────
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)


def get_or_create_collection():
    return chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn,
        metadata={"hnsw:space": "cosine"}
    )


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


def ingest_documents():
    """Read all markdown files and store chunks in ChromaDB."""
    collection = get_or_create_collection()

    # Check if already ingested
    existing = collection.count()
    if existing > 0:
        print(f"[RAG] Collection already has {existing} chunks. Skipping ingestion.")
        return existing

    md_files = glob.glob(os.path.join(KNOWLEDGE_BASE_DIR, "*.md"))
    if not md_files:
        print("[RAG] No markdown files found in knowledge_base/")
        return 0

    all_chunks = []
    all_ids = []
    all_metadatas = []

    for filepath in md_files:
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks):
            chunk_id = f"{filename}_{i}"
            all_chunks.append(chunk)
            all_ids.append(chunk_id)
            all_metadatas.append({"source": filename, "chunk_index": i})

    collection.add(
        documents=all_chunks,
        ids=all_ids,
        metadatas=all_metadatas
    )

    print(f"[RAG] Ingested {len(all_chunks)} chunks from {len(md_files)} files.")
    return len(all_chunks)


def retrieve(query: str, n_results: int = 3) -> list[dict]:
    """Retrieve top-n relevant chunks for a query."""
    collection = get_or_create_collection()

    if collection.count() == 0:
        ingest_documents()

    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )

    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        chunks.append({
            "text": doc,
            "source": results["metadatas"][0][i]["source"],
            "score": results["distances"][0][i] if results.get("distances") else None
        })

    return chunks


def ask(question: str) -> dict:
    """Full RAG pipeline: retrieve + generate answer with citations."""

    # Step 1: Retrieve relevant chunks
    chunks = retrieve(question, n_results=3)

    if not chunks:
        return {
            "answer": "I could not find relevant information in the knowledge base.",
            "sources": [],
            "chunks_used": 0
        }

    # Step 2: Build context
    context_parts = []
    sources = []
    for i, chunk in enumerate(chunks):
        context_parts.append(f"[{i+1}] {chunk['text']}")
        source = chunk["source"].replace(".md", "").replace("-", " ").title()
        if source not in sources:
            sources.append(source)

    context = "\n\n".join(context_parts)

    # Step 3: Generate answer with Groq
    client = Groq(api_key=GROQ_API_KEY)

    system_prompt = """You are a helpful customer support AI assistant.
Answer the user's question using ONLY the provided context.
Be concise, accurate, and helpful.
If the context doesn't contain enough information, say so clearly.
Reference the context numbers [1], [2], [3] when citing information."""

    user_prompt = f"""Context:
{context}

Question: {question}

Answer based on the context above:"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=500,
        temperature=0.3
    )

    answer = response.choices[0].message.content.strip()

    return {
        "answer": answer,
        "sources": sources,
        "chunks_used": len(chunks),
        "context": context_parts
    }


# ── Auto-ingest on import ─────────────────────────────────────────────────────
ingest_documents()