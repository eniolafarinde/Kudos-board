import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CardsPage from './components/cards'; 
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);

  const getRandomImageUrl = useCallback((width = 400, height = 200) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
  }, []);

  const getAllBoards = useCallback(async () => {
    const res = await fetch("http://localhost:3000/api/board/all");
    const data = await res.json();
    return data;
  }, []);

  const deleteBoardApi = useCallback(async (boardId) => {
    const res = await fetch("http://localhost:3000/api/board/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: boardId })
    });
  }, []);

  const addBoardApi = useCallback(async (newBoardData) => {
      const response = await fetch("http://localhost:3000/api/board/create", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              title: newBoardData.title,
              description: newBoardData.description || "",
              category: newBoardData.category,
              author: newBoardData.author || "Anonymous",
              image: newBoardData.image || getRandomImageUrl(),
          })
      });
      const addedBoard = await response.json();
      return addedBoard;
  }, [getRandomImageUrl]);

  const addCardToBoardApi = useCallback(async (boardId, newCardData) => {
      const response = await fetch(`http://localhost:3000/api/board/${boardId}/cards/create`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newCardData)
      });
      const addedCard = await response.json();
      return addedCard;
  }, []);

  const getCommentsByCardIdApi = useCallback(async (cardId) => {
      try {
          const response = await fetch(`http://localhost:3000/api/cards/${cardId}/comments`);
          if (!response.ok) {
              if (response.status === 404) return []; 
              const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
              throw new Error(`Failed to fetch comments: ${response.status} ${errorBody.message || response.statusText}`);
          }
          const comments = await response.json();
          return comments;
      } catch (err) {
          console.error(`Error fetching comments for card ${cardId}:`, err);
          throw err;
      }
  }, []);

  const addCommentToCardApi = useCallback(async (cardId, newCommentData) => {
      try {
          const response = await fetch(`http://localhost:3000/api/cards/${cardId}/comments`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(newCommentData)
          });
          if (!response.ok) {
              const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
              throw new Error(`Failed to add comment: ${response.status} ${errorBody.message || response.statusText}`);
          }
          const addedComment = await response.json();
          return addedComment;
      } catch (err) {
          console.error(`Error adding comment to card ${cardId}:`, err);
          throw err;
      }
  }, []);

  const toggleCardPinApi = useCallback(async (cardId) => {
      try {
          const response = await fetch(`http://localhost:3000/api/cards/${cardId}/pin`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
          });
          if (!response.ok) {
              const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
              throw new Error(`Failed to toggle pin status: ${response.status} ${errorBody.message || response.statusText}`);
          }
          const updatedCard = await response.json();
          return updatedCard;
      } catch (err) {
          console.error(`Error toggling pin status for card ${cardId}:`, err);
          throw err;
      }
  }, []);


  useEffect(() => {
    const fetchBoards = async () => {
      const fetchedData = await getAllBoards(); 
      const boardsWithImages = fetchedData.map(board => ({
        ...board,
        image: board.image || getRandomImageUrl(400, 200)
      }));
      setBoards(boardsWithImages);
    };
    fetchBoards();
  }, [getAllBoards, getRandomImageUrl]);

  const handleAddBoard = useCallback(async (newBoardData) => {
    const addedBoard = await addBoardApi(newBoardData);
    setBoards(prevBoards => [...prevBoards, {
      ...addedBoard,
      image: addedBoard.image || getRandomImageUrl(400, 200)
    }]);
  }, [addBoardApi, getRandomImageUrl]);

  const handleDeleteBoard = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this board? This will also delete all associated cards.")) {
      await deleteBoardApi(id); 
      setBoards(prevBoards => prevBoards.filter(board => board.id !== id));
    }
  }, [deleteBoardApi]);

  const handleAddCard = useCallback(async (boardId, newCardData) => {
      const addedCard = await addCardToBoardApi(boardId, newCardData); 
      return addedCard;
  }, [addCardToBoardApi]);


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage kudosBoards={boards} onDelete={handleDeleteBoard} onAddBoard={handleAddBoard}/>
            }/>
          <Route
            path="/boards/:id"
            element={<CardsPage onAddCard={handleAddCard} onAddComment={addCommentToCardApi} onGetCommentsByCardId={getCommentsByCardIdApi} onPinToggle={toggleCardPinApi}/>}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;