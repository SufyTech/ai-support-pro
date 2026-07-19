import os
import glob
import uuid
from groq import Groq
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from fastembed import TextEmbedding
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────
KNOWLEDGE_BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "knowledge_base")
COLLECTION_NAME = "ai-support-pro"

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
QDRANT_URL = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")

# ── Embedding model (runs locally, small enough to deploy) ─────────────────────
embedder = TextEmbedding("sentence-transformers/all-MiniLM-L6-v2")

# ── Qdrant Cloud client ──────────────────────────────────────────────────────
qdrant = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)


def ensure_collection():
    existing = [c.name for c in qdrant.get_collections().collections]
    if COLLECTION_NAME not in existing:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


def ingest_documents():
    """Read all markdown files and store chunks in Qdrant Cloud."""
    ensure_collection()

    existing_count = qdrant.count(collection_name=COLLECTION_NAME).count
    if existing_count > 0:
        print(f"[RAG] Collection already has {existing_count} chunks. Skipping ingestion.")
        return existing_count

    md_files = glob.glob(os.path.join(KNOWLEDGE_BASE_DIR, "*.md"))
    if not md_files:
        print("[RAG] No markdown files found in knowledge_base/")
        return 0

    points = []
    for filepath in md_files:
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = chunk_text(content)
        vectors = list(embedder.embed(chunks))

    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
        points.append(PointStruct(
        id=str(uuid.uuid4()),
        vector=vector.tolist(),
        payload={"text": chunk, "source": filename, "chunk_index": i}
    ))

    qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
    print(f"[RAG] Ingested {len(points)} chunks from {len(md_files)} files.")
    return len(points)


def retrieve(query: str, n_results: int = 3) -> list[dict]:
    """Retrieve top-n relevant chunks for a query."""
    ensure_collection()

    if qdrant.count(collection_name=COLLECTION_NAME).count == 0:
        ingest_documents()

    query_vector = list(embedder.embed([query]))[0].tolist()
    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=n_results
    ).points

    chunks = []
    for r in results:
        chunks.append({
            "text": r.payload["text"],
            "source": r.payload["source"],
            "score": r.score
        })

    return chunks


def ask(question: str) -> dict:
    """Full RAG pipeline: retrieve + generate answer with citations."""
    chunks = retrieve(question, n_results=3)

    if not chunks:
        return {
            "answer": "I could not find relevant information in the knowledge base.",
            "sources": [],
            "chunks_used": 0
        }

    context_parts = []
    sources = []
    for i, chunk in enumerate(chunks):
        context_parts.append(f"[{i+1}] {chunk['text']}")
        source = chunk["source"].replace(".md", "").replace("-", " ").title()
        if source not in sources:
            sources.append(source)

    context = "\n\n".join(context_parts)

    client = Groq(api_key=GROQ_API_KEY)

    system_prompt = """You are a helpful code review knowledge assistant.
Answer the user's question about coding standards, security practices, or review policy using ONLY the provided context.
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
ensure_collection()
ingest_documents()