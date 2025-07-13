import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const categoryColors = {
  "😟 Worry": "#ffe5e5",
  "🧭 Goal": "#e5f7ff",
  "✍️ Plan": "#eaffea",
  "💖 Feeling": "#fbe8ff",
  "🪶 Unclassified": "#f2f2f2",
};

const detectCategory = (text) => {
  const t = text.toLowerCase();

  if (t.includes("worry") || t.includes("scared") || t.includes("anxious") || t.includes("fear") || t.includes("panic"))
    return "😟 Worry";

  if (t.includes("goal") || t.includes("dream") || t.includes("target") || t.includes("vision"))
    return "🧭 Goal";

  if (t.includes("plan") || t.includes("tomorrow") || t.includes("next") || t.includes("arrange"))
    return "✍️ Plan";

  if (t.includes("happy") || t.includes("love") || t.includes("excited") || t.includes("grateful") || t.includes("peace"))
    return "💖 Feeling";

  return "🪶 Unclassified";
};

function App() {
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("mindmirror_thoughts");
    if (saved) {
      try {
        setThoughts(JSON.parse(saved));
      } catch {
        localStorage.removeItem("mindmirror_thoughts");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mindmirror_thoughts", JSON.stringify(thoughts));
  }, [thoughts]);

  useEffect(() => {
    if (musicPlaying) {
      audioRef.current?.play().catch(() => { });
    } else {
      audioRef.current?.pause();
    }
  }, [musicPlaying]);

  const handleAdd = () => {
    const sentences = thought
      .split(/[.?!\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const analyzeSentences = async () => {
      const newEntries = [];

      for (let sentence of sentences) {
        const category = await detectCategory(sentence);
        newEntries.push({ text: sentence, category });
      }

      setThoughts((prev) => [...prev, ...newEntries]);
      setThought("");
    };

    analyzeSentences();
  };

  const handleClear = () => {
    setThoughts([]);
    localStorage.removeItem("mindmirror_thoughts");
  };

  return (
    <div className="container">
      <h1>🧠 MindMirror</h1>
      <p>Reflect on your thoughts — then your sentence will classify them for emotional clarity.</p>

      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="Write anything on your mind..."
        rows="5"
      />

      <div className="button-row">
        <button className="add-btn" onClick={handleAdd}>Add Thought</button>

        <button
          className={`music-btn ${musicPlaying ? "pause" : ""}`}
          onClick={() => setMusicPlaying(!musicPlaying)}
        >
          {musicPlaying ? "⏸️ Pause Music" : "🎵 Play Music"}
        </button>

        {thoughts.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>Clear All</button>
        )}
      </div>

      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>
      <h3 className="thoughts-heading">💬 Thought Crystals</h3>
      {thoughts.length === 0 ? (
        <p>No thoughts yet. Type something above!</p>
      ) : (
        <div className="thoughts-container">
          {thoughts.map((item, index) => (
            <div
              key={index}
              className="thought-box"
              style={{ background: categoryColors[item.category] }}
            >
              <strong>{item.category}</strong>: {item.text}
            </div>
          ))}
        </div>
      )}

      <footer>© 2025 MindMirror · AI Thought Journal</footer>
    </div>
  );
}

export default App;