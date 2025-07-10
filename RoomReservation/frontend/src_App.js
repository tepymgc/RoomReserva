import React, { useState, useEffect } from "react";
import Login from "./Login";
import Calendar from "./Calendar";

const API_BASE = "http://localhost:3001/api"; // RenderではURLを変更

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogin = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
  };

  const handleLogout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <button onClick={handleLogout}>ログアウト</button>
      <h2>会議室予約カレンダー</h2>
      <Calendar apiBase={API_BASE} token={token} role={role} />
    </div>
  );
}

export default App;