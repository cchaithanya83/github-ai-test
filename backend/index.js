const express = require("express");
const OpenAI = require("openai"); // Ensure this matches your OpenAI library
require("dotenv").config();

const app = express();
const port = 3000;

const token = process.env["GITHUB_TOKEN"]; // Replace with your API Key
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to send prompt and get response from OpenAI GPT
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error interacting with GPT model:", error);
    res.status(500).json({ error: "Failed to generate a response." });
  }
});

// Default endpoint
app.get("/", (req, res) => {
  res.send("Welcome to GPT-4 API!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
