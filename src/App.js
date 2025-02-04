import "./App.css";
import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://my-backend-service.onrender.com/download",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, format }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.statusText} - ${errorText}`
        );
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `download.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert(`There was an error downloading the file: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          YouTube Video & MP3 Downloader
        </h1>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ჩასვით YouTube ვიდეოს ბმული"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="mp4">MP4 (ვიდეო)</option>
              <option value="mp3">MP3 (აუდიო)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            გადმოწერა
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
