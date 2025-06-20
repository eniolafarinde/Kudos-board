import React, { useState } from "react";
import logo from "../assets/kudoboard_logo.webp";
import KudosBoardCard from './KudosBoardCard';
import CreateBoard from './createBoard';
import Modal from './Modal';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const HomePage = ({ kudosBoards, onDelete, onAddBoard, theme, toggleTheme }) => {
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ['All', 'Recent', 'Celebration', 'Thank You', 'Inspiration'];

    const filteredAndSearchedBoards = kudosBoards.filter(board => {
        const matchesCategory = filterCategory.toLowerCase() === 'all' || (board.category && board.category.toLowerCase()) === filterCategory.toLowerCase() ||
            (filterCategory.toLowerCase() === 'recent' &&
                (new Date() - new Date(board.createdAt)) / (1000 * 60 * 60 * 24) < 7);

        const matchesSearch = searchTerm === '' || board.title.toLowerCase().includes(searchTerm.toLowerCase()) || (board.description && board.description.toLowerCase().includes(searchTerm.toLowerCase())) || (board.author && board.author.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        if (filterCategory.toLowerCase() === 'recent') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    const handleCreateBoardSubmit = (newBoard) => {
        onAddBoard(newBoard);
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <header className="header">
                <h2 className="logo">KUDOS BOARD</h2>
                <button onClick={toggleTheme} className="theme-toggle-button">
                    {theme === 'light' ? (
                        <>
                            <FontAwesomeIcon icon={faMoon} /> Dark Mode
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faSun} /> Light Mode
                        </>
                    )}
                </button>
            </header>
            <main className="content">
                <div className="actions">
                    <div className="search-section">
                        <input
                            className="search-input"
                            placeholder="Search boards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">Search</button>
                        <button className="clear-search-button" onClick={() => setSearchTerm('')}>Clear</button>
                    </div>
                </div>

                <div className="category-buttons-container">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-button ${filterCategory.toLowerCase() === category.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setFilterCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="create-board-section">
                    <button onClick={() => setIsModalOpen(true)} className="create-board-button">
                        Create a New Board
                    </button>
                </div>

                <div className="board-list">
                    {filteredAndSearchedBoards.length > 0 ? (
                        filteredAndSearchedBoards.map(board => (
                            <KudosBoardCard key={board.id} board={board} onDelete={onDelete}/>
                        ))
                    ) : (
                        <p className="no-boards-message">No boards found matching your criteria.</p>
                    )}
                </div>
            </main>
            <footer className="footer"> &copy; 2025 Eniola Olawumi Farinde Kudo's Board</footer>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateBoard onAddBoard={handleCreateBoardSubmit} onCloseModal={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default HomePage;

