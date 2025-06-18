import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import './App.css'; 

const imageUrl = (width = 400, height = 200) => {
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
};

const fakeBoards = [
  {
    id: '1',
    title: 'Welcome',
    category: 'Inspiration',
    image: imageUrl,
  },
  {
    id: '2',
    title: 'celebrate',
    category: 'Celebration',
    image: imageUrl,
  },
  {
    id: '3',
    title: 'thanks',
    category: 'Thank you',
    image: imageUrl,
  },
  {
    id: '4',
    title: 'daily inspiration',
    category: 'Inspiration',
    image: imageUrl,
  },
  {
    id: '5',
    title: 'project demos!',
    category: 'Celebration',
    image: imageUrl,
  }
];



function App() {
  const [allKudosBoards, setAllKudosBoards] = useState(() => {
      const savedBoards = localStorage.getItem('kudosBoards');
      if (savedBoards) {
        return JSON.parse(savedBoards);
      } else {
        return fakeBoards.map(board => ({
          ...board,
          image: imageUrl(400, 200)
        }));
      }
  });
  useEffect(() => {
    localStorage.setItem('kudosBoards', JSON.stringify(allKudosBoards));
  }, [allKudosBoards]);


  const handleAddBoard = (newBoard) => {
    setAllKudosBoards(prevBoards => [...prevBoards, newBoard]);
  };

  const handleDeleteBoard = (id) => {
    setAllKudosBoards(prevBoards => prevBoards.filter(board => board.id !== id));
  };

  return (
    <div className="App">
        <Routes>
            <Route
                path="/"
                element={
                    <HomePage
                      kudosBoards={allKudosBoards}
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

