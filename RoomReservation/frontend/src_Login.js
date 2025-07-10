import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setErr("ログイン失敗");
        return;
      }
      const data = await res.json();
      onLogin(data.token, data.role);
    } catch {
      setErr("通信エラー");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      <div>
        <input
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="パスワード"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">ログイン</button>
      {err && <div style={{ color: "red" }}>{err}</div>}
    </form>
  );
}

export default Login;