// src/components/cards.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Modal from './Modal';
import CreateCard from './createCard';
import CommentModalContent from './CommentModal'; // Corrected import based on file name expectation
import './cards.css';

// --- NEW: Font Awesome Imports ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp,
    faTrashCan, // More modern trash can icon
    faThumbtack, // For pinning
    faSun, // For theme toggle
    faMoon // For theme toggle
} from '@fortawesome/free-solid-svg-icons';
// --- END NEW ---

// --- MODIFIED: Added theme and toggleTheme props back ---
const CardsPage = ({ onAddCard, onAddComment, onGetCommentsByCardId, onPinToggle, theme, toggleTheme }) => {
    const { id: boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const getBoardById = useCallback(async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/board/${id}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error(`Board with ID ${id} not found.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Error fetching board by ID:", err);
            throw err;
        }
    }, []);

    const getCardsByBoardId = useCallback(async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/board/${id}/cards`);
            if (!response.ok) {
                if (response.status === 404) return [];
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Error fetching cards:", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        const fetchBoardAndCards = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const boardData = await getBoardById(boardId);
                setBoard(boardData);
                const cardsData = await getCardsByBoardId(boardId);
                setCards(cardsData);
            } catch (err) {
                setError(err.message || "Failed to load board details or cards.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBoardAndCards();
    }, [boardId, getBoardById, getCardsByBoardId]);

    const handleCreateCardSubmit = async (newCardData) => {
        try {
            const addedCard = await onAddCard(boardId, newCardData);
            setCards(prevCards => [...prevCards, addedCard]);
            setIsCreateCardModalOpen(false);
        } catch (err) {
            console.error("Failed to add new card:", err);
            alert(err.message || "Failed to create card. Please try again.");
        }
    };

    const handleUpvote = async (cardId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/board/${boardId}/cards/${cardId}/upvote`, {
                method: 'PATCH'
            });
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`Failed to upvote: ${res.status} ${errorBody.message || res.statusText}`);
            }
            const updatedCard = await res.json();
            setCards(prev =>
                prev.map(card => card.id === cardId ? updatedCard : card)
            );
        } catch (err) {
            console.error("Upvote failed:", err);
            alert(err.message || "Failed to upvote card. Please try again.");
        }
    };

    const handleDelete = async (cardId) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/board/${boardId}/cards/${cardId}`, {
                method: 'DELETE'
            });
            if (!res.ok && res.status !== 204) { // 204 No Content is a valid successful delete status
                const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`Failed to delete: ${res.status} ${errorBody.message || res.statusText}`);
            }
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
        } catch (err) {
            console.error("Delete failed:", err);
            alert(err.message || "Failed to delete card. Please try again.");
        }
    };

    const handlePinToggle = async (cardId) => {
        try {
            const updatedCard = await onPinToggle(cardId);
            setCards(prevCards =>
                prevCards.map(card => (card.id === cardId ? updatedCard : card))
            );
        } catch (err) {
            console.error("Pin toggle failed:", err);
            alert(err.message || "Failed to change pin status. Please try again.");
        }
    };

    const handleOpenCommentModal = (card) => {
        setSelectedCard(card);
        setIsCommentModalOpen(true);
    };

    const handleCloseCommentModal = () => {
        setSelectedCard(null);
        setIsCommentModalOpen(false);
    };

    const sortedCards = useMemo(() => {
        if (!cards || cards.length === 0) return [];

        const pinned = cards.filter(card => card.isPinned);
        const unpinned = cards.filter(card => !card.isPinned);

        pinned.sort((a, b) => {
            if (!a.pinnedAt && !b.pinnedAt) return 0;
            if (!a.pinnedAt) return 1;
            if (!b.pinnedAt) return -1;
            return new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime();
        });

        unpinned.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return [...pinned, ...unpinned];
    }, [cards]);


    if (isLoading) return <div className="cards-page-loading">Loading board...</div>;
    if (error) return <div className="cards-page-error">Error: {error}</div>;
    if (!board && !isLoading && !error) return <div className="cards-page-empty">Board data could not be loaded.</div>;

    return (
        <div className="cards-page-container">
            <header className="cards-page-header"> {/* Re-added header for consistent layout */}
                <Link to="/" className="back-to-boards-button">← Back to All Boards</Link>
                <h1 className="board-title">{board.title}</h1>
                {/* --- Theme Toggle Button with Icon --- */}
                {/* <button onClick={toggleTheme} className="theme-toggle-button">
                    {theme === 'light' ? (
                        <>
                            <FontAwesomeIcon icon={faMoon} /> Dark Mode
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faSun} /> Light Mode
                        </>
                    )}
                </button> */}
                {/* --- END Theme Toggle --- */}
            </header>
            <div className="board-meta">
                Category: {board.category}
            </div>

            <div className="create-card-section">
                <button onClick={() => setIsCreateCardModalOpen(true)} className="create-card-button">
                    Create a New Card
                </button>
            </div>

            <div className="card-list">
                {sortedCards.length > 0 ? (
                    sortedCards.map(card => (
                        <div key={card.id} className={`card-item ${card.isPinned ? 'pinned-card' : ''}`}>
                            {/* --- MODIFIED: Pin Icon --- */}
                            {card.isPinned && <FontAwesomeIcon icon={faThumbtack} className="pin-icon" title="Pinned" />}
                            <div className="card-content-clickable" onClick={() => handleOpenCommentModal(card)}>
                                <h3 className="card-item-message">{card.title}</h3>
                                <p className="card-item-message">{card.description}</p>
                                {card.gifUrl && <img src={card.gifUrl} alt="Card GIF" className="card-item-gif" />}
                                {card.author && <p className="card-item-author">From: {card.author}</p>}
                            </div>

                            <div className="card-actions"> {/* Changed from card-action to card-actions for consistency */}
                                {/* --- MODIFIED: Upvote Icon --- */}
                                <button onClick={() => handleUpvote(card.id)}>
                                    <FontAwesomeIcon icon={faThumbsUp} /> {card.upvote}
                                </button>
                                {/* --- MODIFIED: Delete Icon --- */}
                                <button onClick={() => handleDelete(card.id)}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                                {/* --- MODIFIED: Pin/Unpin Icon --- */}
                                <button onClick={() => handlePinToggle(card.id)}>
                                    <FontAwesomeIcon icon={faThumbtack} /> {card.isPinned ? 'Unpin' : 'Pin'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-cards-message">No cards found for this board. Be the first to create one!</p>
                )}
            </div>

            <Modal isOpen={isCreateCardModalOpen} onClose={() => setIsCreateCardModalOpen(false)}>
                <CreateCard
                    onAddCard={handleCreateCardSubmit}
                    onCloseModal={() => setIsCreateCardModalOpen(false)}
                />
            </Modal>

            <Modal isOpen={isCommentModalOpen} onClose={handleCloseCommentModal}>
                {selectedCard && (
                    <CommentModalContent
                        card={selectedCard}
                        onClose={handleCloseCommentModal}
                        onCommentAdded={onAddComment}
                        getCommentsApi={onGetCommentsByCardId}
                    />
                )}
            </Modal>
        </div>
    );
};

export default CardsPage;