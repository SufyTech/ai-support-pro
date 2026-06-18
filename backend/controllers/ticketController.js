// controllers/ticketController.js
const { spawn } = require("child_process");
const path = require("path");
const {
  createTicket,
  getAllTickets,
  updateTicketStatus,
  getTicketStats,
} = require("../data/ticketsStore");

// helper: call Python classifier
function runPythonClassifier(subject, description) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "..",
      "..",
      "ai-agents",
      "classifier.py",
    );
    const py = spawn(process.env.PYTHON_CMD || "python3", [scriptPath], {
      cwd: path.join(__dirname, "..", ".."),
      env: { ...process.env },
    });

    const input = JSON.stringify({ subject, description });
    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("Python classifier exited with code", code, errorOutput);
        return resolve({ category: null, priority: null }); // fallback
      }
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (e) {
        console.error("Error parsing classifier output:", e, output);
        resolve({ category: null, priority: null });
      }
    });

    py.stdin.write(input);
    py.stdin.end();
  });
}

// helper: call Python responder
function runPythonResponder(subject, description, category) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "..",
      "..",
      "ai-agents",
      "responder.py",
    );

    console.log("Running responder at:", scriptPath);

    const py = spawn("py", [scriptPath], {
      cwd: path.join(__dirname, "..", ".."),
      env: { ...process.env },
    });

    const input = JSON.stringify({ subject, description, category });
    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (code) => {
      console.log("Responder Python exited with code", code);
      if (code !== 0) {
        console.error("Python responder error:", errorOutput);
        return resolve({ suggestedReply: null });
      }
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (e) {
        console.error("Error parsing responder output:", e, output);
        resolve({ suggestedReply: null });
      }
    });

    py.stdin.write(input);
    py.stdin.end();
  });
}

// NEW: helper – call AutoGen dispatcher (dispatcher_autogen.py)
function runPythonAutogenDispatcher(subject, description) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "..",
      "..",
      "ai-agents",
      "dispatcher_autogen.py",
    );

    const py = spawn("py", [scriptPath], {
      cwd: path.join(__dirname, "..", ".."),
      env: { ...process.env },
    });

    const input = JSON.stringify({ subject, description });
    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error(
          "Python AutoGen dispatcher exited with code",
          code,
          errorOutput,
        );
        return resolve({
          category: null,
          priority: null,
          suggestedReply: null,
        });
      }
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (e) {
        console.error("Error parsing AutoGen dispatcher output:", e, output);
        resolve({
          category: null,
          priority: null,
          suggestedReply: null,
        });
      }
    });

    py.stdin.write(input);
    py.stdin.end();
  });
}

async function createTicketHandler(req, res) {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res
        .status(400)
        .json({ error: "subject and description are required" });
    }

    // 1) Create ticket
    const ticket = createTicket(subject, description);

    // 2) Use AutoGen dispatcher (Groq + AutoGen agents)
    const autoGenResult = await runPythonAutogenDispatcher(
      subject,
      description,
    );

    // If AutoGen failed (nulls), fall back to your existing Groq agents
    let category = autoGenResult.category;
    let priority = autoGenResult.priority;
    let suggestedReply = autoGenResult.suggestedReply;

    if (!category || !priority || !suggestedReply) {
      const classification = await runPythonClassifier(subject, description);
      category = classification.category;
      priority = classification.priority;

      const replyResult = await runPythonResponder(
        subject,
        description,
        category,
      );
      suggestedReply = replyResult.suggestedReply;
    }

    ticket.category = category;
    ticket.priority = priority;
    ticket.suggestedReply = suggestedReply;
    ticket.updatedAt = new Date().toISOString();

    // 3) Simple auto-resolve rule:
    // If priority is not High, let the AI auto-resolve the ticket.
    if (ticket.priority && ticket.priority !== "High") {
      ticket.status = "resolved";
    } else {
      // High-priority or unknown stay 'new' for human follow-up
      ticket.status = ticket.status || "new";
    }
    ticket.updatedAt = new Date().toISOString();

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTicketsHandler(req, res) {
  try {
    const tickets = getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTicketStatsHandler(req, res) {
  try {
    const stats = getTicketStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching ticket stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateTicketStatusHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const allowedStatuses = ["new", "processing", "resolved", "escalated"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = updateTicketStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createTicketHandler,
  getTicketsHandler,
  getTicketStatsHandler,
  updateTicketStatusHandler,
};
