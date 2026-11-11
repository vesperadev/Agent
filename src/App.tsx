import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Msg {
  role: "user" | "agent";
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    // 参数名 `message` 必须与 Rust 命令 `fn chat(message: String)` 完全一致。
    const reply = await invoke<string>("chat", { message: text });
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "agent", text: reply },
    ]);
  }

  return (
    <main className="container">
      <h1>Mini_Agent</h1>

      <div className="messages">
        {messages.map((m, i) => (
          <p key={i} className={m.role}>
            <strong>{m.role === "user" ? "你" : "Agent"}：</strong>
            {m.text}
          </p>
        ))}
      </div>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="输入消息，回车发送..."
        />
        <button type="submit">发送</button>
      </form>
    </main>
  );
}

export default App;
