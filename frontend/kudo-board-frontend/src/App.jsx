import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import './App.css'; 

function App() {
  // fetch boards from myy api
  const [boards, setBoards] = useState([])
  const getAllBoards = async() => {
    try {
      const response = await fetch("http://localhost:3000/api/board/all")
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  useEffect(() => {
    const apiCall = async() => {
      const res = await getAllBoards()
      setBoards(res)
    }
    apiCall()
  }, [])

  // TODO
  const handleAddBoard = (newBoard) => {
    setBoards(prevBoards => [...prevBoards, newBoard]);
  };

  const handleDeleteBoard = (id) => {
    setBoards(prevBoards => prevBoards.filter(board => board.id !== id));
  };

  return (
    <div className="App">
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
        </Routes>
    </div>
  );
}

export default App;

