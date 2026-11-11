import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Msg {
  role: "user" | "agent";
  text: string;
}

interface Session {
  id: string;
  name: string; // 首句前 7 字；未发送过消息时为占位名“新会话”
  messages: Msg[];
}

// 按首句（第一条 user 消息）取前 7 个字符作为会话名；不足 7 个则取全部。
function nameFromFirst(messages: Msg[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "新会话";
  const t = firstUser.text;
  return t.length > 7 ? t.slice(0, 7) : t;
}

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const active = sessions.find((s) => s.id === activeId) ?? null;

  async function send() {
    const text = input.trim();
    if (!text) return;
    // 拿到一个确定的 string id；闭包内无法依靠控制流收窄，故此处直接定型
    const currentId: string = activeId ?? crypto.randomUUID();
    if (activeId === null) {
      setSessions((prev) => [
        ...prev,
        { id: currentId, name: "新会话", messages: [] },
      ]);
      setActiveId(currentId);
    }
    setInput("");
    // 参数名 `message` 必须与 Rust 命令 `fn chat(message: String)` 完全一致
    const reply = await invoke<string>("chat", { message: text });
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentId
          ? {
              ...s,
              messages: [
                ...s.messages,
                { role: "user", text },
                { role: "agent", text: reply },
              ],
            }
          : s,
      ),
    );
  }

  // 新会话：把当前会话命名归档（若已有消息），丢弃空白会话，再建一个空会话
  function newChat() {
    const newId: string = crypto.randomUUID();
    setSessions((prev) => {
      const kept = prev
        .filter((s) => {
          // 当前为空会话时不保留，避免列表出现空白项
          if (s.id === activeId && s.messages.length === 0) return false;
          return true;
        })
        .map((s) => {
          // 仅对尚未命名的当前会话按首句命名
          if (s.id === activeId && s.messages.length > 0 && s.name === "新会话") {
            return { ...s, name: nameFromFirst(s.messages) };
          }
          return s;
        });
      return [...kept, { id: newId, name: "新会话", messages: [] }];
    });
    setActiveId(newId);
    setInput("");
  }

  function switchTo(id: string) {
    setActiveId(id);
    setInput("");
  }

  return (
    <main
      className="container"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "12px",
        alignItems: "stretch",
        height: "100vh",
        textAlign: "left",
        padding: "12px",
      }}
    >
      <aside
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          overflowY: "auto",
        }}
      >
        <button type="button" onClick={newChat}>
          + 新会话
        </button>
        {sessions.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => switchTo(s.id)}
            style={{
              textAlign: "left",
              padding: "6px 8px",
              background: s.id === activeId ? "#dbeafe" : "transparent",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {s.name}
          </button>
        ))}
      </aside>

      <section
        style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        <div className="messages" style={{ flex: 1, overflowY: "auto" }}>
          {(active ? active.messages : []).map((m, i) => (
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
      </section>
    </main>
  );
}

export default App;
