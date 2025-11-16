import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
const upload = multer();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    const prompt = `
    Convert the following PDF text into MCQ quiz with options & answers.
    Return JSON only.
    PDF TEXT:
    ${text}
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const result = await response.json();
    const output = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ quiz: JSON.parse(output) });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
