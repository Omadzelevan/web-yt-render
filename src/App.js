import "./App.css";
import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate URL
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setError("Please enter a valid YouTube URL");
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual backend URL from Render
      const BACKEND_URL = "https://your-backend-service.onrender.com";

      console.log("Sending request to backend...");
      const response = await fetch(`${BACKEND_URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          format: format,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${errorText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `download.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setUrl("");
    } catch (error) {
      console.error("Download error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">YouTube Downloader</h1>
        <form onSubmit={handleSubmit} className="download-form">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="url-input"
              disabled={loading}
              required
            />
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="format-select"
              disabled={loading}
            >
              <option value="mp4">MP4</option>
              <option value="mp3">MP3</option>
            </select>
          </div>
          <button
            type="submit"
            className={`download-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download"}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default App;
