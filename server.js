const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const app = express();

// Enable CORS for your frontend
app.use(
  cors({
    origin: "*", // In production, specify your frontend URL
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Test endpoint to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/download", async (req, res) => {
  try {
    const { url, format } = req.body;
    console.log("Received request:", { url, format });

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).send("Invalid YouTube URL");
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    // Set response headers
    res.header(
      "Content-Disposition",
      `attachment; filename="${videoTitle}.${format}"`
    );

    if (format === "mp3") {
      // Handle MP3 download
      ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
      }).pipe(res);
    } else {
      // Handle MP4 download
      ytdl(url, {
        filter: format === "mp4" ? "videoandaudio" : "audioonly",
        quality: "highest",
      }).pipe(res);
    }
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send(`Server error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
