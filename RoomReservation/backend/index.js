import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET = "secret_key"; // 本番ではenvで管理

// ユーザー情報（簡易・本番はDB推奨）
const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

app.use(cors());
app.use(express.json());

// ログインAPI
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "認証失敗" });

  // JWT発行
  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token, role: user.role });
});

// 認証ミドルウェア
function auth(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "認証エラー" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET);
      if (requiredRole && decoded.role !== requiredRole)
        return res.status(403).json({ message: "権限がありません" });
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: "トークン無効" });
    }
  };
}

// サンプルAPI：部屋一覧
app.get("/api/rooms", (req, res) => {
  // サンプルデータ
  res.json([
    { id: 1, name: "A会議室" },
    { id: 2, name: "B会議室" }
  ]);
});

// サンプルAPI：部屋追加（管理者のみ）
app.post("/api/rooms", auth("admin"), (req, res) => {
  // ここでDB登録処理を実装
  res.json({ success: true });
});

// サンプルAPI：部屋削除（管理者のみ）
app.delete("/api/rooms/:id", auth("admin"), (req, res) => {
  // ここでDB削除処理を実装
  res.json({ success: true });
});

// サンプルAPI：予約一覧（認証必須・どちらもOK）
app.get("/api/reservations", auth(), (req, res) => {
  // サンプルデータ
  res.json([
    { id: 1, roomId: 1, title: "会議", start: "2025-07-11T10:00", end: "2025-07-11T11:00" }
  ]);
});

// サンプルAPI：予約追加・削除（管理者のみ）
app.post("/api/reservations", auth("admin"), (req, res) => {
  res.json({ success: true });
});
app.delete("/api/reservations/:id", auth("admin"), (req, res) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});