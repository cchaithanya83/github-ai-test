const express = require("express");
const OpenAI = require("openai"); // Ensure this matches your OpenAI library
require("dotenv").config();
var multer = require("multer");
const app = express();
const port = 3000;
const fs = require("fs");
const token = process.env["GITHUB_TOKEN"]; // Replace with your API Key
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const upload = multer({ dest: "uploads/" });
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

function getImageDataUrl(imageFile, imageFormat) {
  try {
    const imageBuffer = fs.readFileSync(imageFile);
    const imageBase64 = imageBuffer.toString("base64");
    return `data:image/${imageFormat};base64,${imageBase64}`;
  } catch (error) {
    console.error(`Could not read '${imageFile}'.`);
    throw new Error("Set the correct path to the image file.");
  }
}

// API Endpoint to Describe an Image with a Question
app.post("/describe-image", upload.single("image"), async (req, res) => {
  const { question } = req.body;

  if (!req.file || !question) {
    return res
      .status(400)
      .json({ error: "Image file and question are required." });
  }

  const originalPath = req.file.path;
  const imageFormat = req.file.mimetype.split("/")[1]; // Dynamically detect format
  const newPath = `${originalPath}.${imageFormat}`; // Rename file with format

  try {
    // Rename the file with the correct extension
    fs.renameSync(originalPath, newPath);

    // Convert to Data URL
    const imageDataUrl = getImageDataUrl(newPath, imageFormat);

    // Send the request to OpenAI
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that describes images in detail.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: question },
            {
              type: "image_url",
              image_url: { url: imageDataUrl, details: "low" },
            },
          ],
        },
      ],
      model: modelName,
    });

    const description = response.choices[0].message.content;

    // Clean up the renamed file
    fs.unlinkSync(newPath);

    res.json({ description });
  } catch (error) {
    console.error("Error processing image description:", error);

    // Clean up in case of errors
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    }

    res
      .status(500)
      .json({ error: "An error occurred while processing the image." });
  }
});

// Default endpoint
app.get("/", (req, res) => {
  res.send("Welcome to GPT-4 API!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
