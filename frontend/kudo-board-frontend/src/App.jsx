import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CardsPage from './components/cards'; // include this if you are navigating to /boards/:id
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);

  const getAllBoards = async () => {
    const res = await fetch("http://localhost:3000/api/board/all");
    return await res.json();
  };

  const deleteBoard = async (boardId) => {
    await fetch("http://localhost:3000/api/board/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: boardId })
    });
    const updatedBoards = await getAllBoards();
    setBoards(updatedBoards);
  };

  useEffect(() => {
    getAllBoards().then((data) => setBoards(data));
  }, []);

  const handleAddBoard = (newBoard) => {
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleDeleteBoard = (id) => {
    deleteBoard(id);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                kudosBoards={boards}
                onDelete={handleDeleteBoard}
                onAddBoard={handleAddBoard}
              />
            }
          />
          <Route path="/boards/:id" element={<CardsPage />} />
        </Routes>

      </Router>

    </div>
  );
}

export default App;
