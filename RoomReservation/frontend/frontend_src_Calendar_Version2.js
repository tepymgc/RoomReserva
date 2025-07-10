import React, { useState, useEffect } from "react";

function Calendar({ apiBase, token, role }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [reservations, setReservations] = useState([]);

  // 部屋一覧取得
  useEffect(() => {
    fetch(`${apiBase}/rooms`)
      .then(res => res.json())
      .then(setRooms);
  }, [apiBase]);

  // 予約一覧取得
  useEffect(() => {
    if (!selectedRoom) return;
    fetch(`${apiBase}/reservations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReservations(data.filter(r => r.roomId === Number(selectedRoom))));
  }, [apiBase, token, selectedRoom]);

  // 部屋追加
  const handleAddRoom = async () => {
    const name = prompt("会議室名を入力");
    if (!name) return;
    await fetch(`${apiBase}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    // 再取得
    fetch(`${apiBase}/rooms`).then(res => res.json()).then(setRooms);
  };

  // 部屋削除
  const handleDeleteRoom = async (id) => {
    await fetch(`${apiBase}/rooms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetch(`${apiBase}/rooms`).then(res => res.json()).then(setRooms);
    if (selectedRoom === String(id)) setSelectedRoom("");
  };

  // 予約追加
  const handleAddReservation = async () => {
    const title = prompt("予約タイトルを入力");
    if (!title) return;
    const start = prompt("開始日時（例: 2025-07-12T10:00）");
    const end = prompt("終了日時（例: 2025-07-12T11:00）");
    if (!start || !end) return;
    await fetch(`${apiBase}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId: Number(selectedRoom),
        title,
        start,
        end
      })
    });
    // 再取得
    fetch(`${apiBase}/reservations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReservations(data.filter(r => r.roomId === Number(selectedRoom))));
  };

  // 予約削除
  const handleDeleteReservation = async (id) => {
    await fetch(`${apiBase}/reservations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetch(`${apiBase}/reservations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReservations(data.filter(r => r.roomId === Number(selectedRoom))));
  };

  return (
    <div>
      <h3>会議室一覧</h3>
      <div>
        {rooms.map(room => (
          <span key={room.id}>
            <button
              style={{ margin: 4, background: selectedRoom === String(room.id) ? "#bdf" : "" }}
              onClick={() => setSelectedRoom(String(room.id))}
            >
              {room.name}
            </button>
            {role === "admin" && (
              <button onClick={() => handleDeleteRoom(room.id)}>削除</button>
            )}
          </span>
        ))}
        {role === "admin" && (
          <button onClick={handleAddRoom}>会議室追加</button>
        )}
      </div>
      <hr />
      {selectedRoom && (
        <div>
          <h4>選択中の部屋: {rooms.find(r => String(r.id) === selectedRoom)?.name}</h4>
          {role === "admin" && (
            <button onClick={handleAddReservation}>予約追加</button>
          )}
          <ul>
            {reservations.map(r => (
              <li key={r.id}>
                {r.title} ({r.start}～{r.end})
                {role === "admin" && (
                  <button onClick={() => handleDeleteReservation(r.id)}>削除</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!selectedRoom && <p>部屋を選択してください</p>}
    </div>
  );
}

export default Calendar;