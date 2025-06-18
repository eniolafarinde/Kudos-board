import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import logo from "../assets/kudoboard_logo.webp";
import KudosBoardCard from './KudosBoardCard';
import './HomePage.css';

const HomePage = () => {
    const [kudosBoards, setKudosBoards] = useState([]);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
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

    const categories = ['All', 'Recent', 'Celebration', 'Thank You', 'Inspiration'];

    useEffect(() => {
        const firstTimeUser = localStorage.getItem('firstTimeUser');
        if (!firstTimeUser && fakeBoards.length > 0) {
            const welcomeBoard = { ...fakeBoards[0], image: imageUrl(400, 200) };
            setKudosBoards([welcomeBoard]);
            localStorage.setItem('firstTimeUser', 'true');
        } else if (fakeBoards.length > 0) {
            const updatedFakeBoards = fakeBoards.map(board => ({...board, image: imageUrl(400, 200) }));
            setKudosBoards(updatedFakeBoards);
        } else {
            setKudosBoards([]);
        }
    }, []);

    const deleteBoard = (id) => {
        setKudosBoards(kudosBoards.filter(board => board.id !== id));
    };

    const filteredAndSearchedBoards = kudosBoards.filter(board => {
        const matchesCategory = filterCategory.toLowerCase() === 'all' || (board.category && board.category.toLowerCase()) === filterCategory.toLowerCase()
    
        const matchesSearch = searchTerm === '' || board.title.toLowerCase().includes(searchTerm.toLowerCase()) || (board.description && board.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (board.author && board.author.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container">
            <header className="header">
                <img className="logo" src={logo} alt="logo" />
            </header>
            <main>
                <div className="actions">
                    <div className="search-section">
                        <input className="search-input" placeholder="Search boards" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="search-button">Search</button>
                        <button className="clear-search-button" onClick={() => setSearchTerm('')}>Clear</button>
                    </div>
                </div>
                <div className="category-buttons-container">
                    {categories.map((category) => (
                        <button key={category} className={`category-button ${filterCategory.toLowerCase() === category.toLowerCase() ? 'active' : ''}`} onClick={() => setFilterCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>
                <div className="create-board-section">
                    <Link to="/create-board" className="create-board-button"> Create a New Board </Link>
                </div>
                <div className="board-list">
                    {filteredAndSearchedBoards.length > 0 ? (
                        filteredAndSearchedBoards.map(board => (
                            <KudosBoardCard key={board.id} board={board} onDelete={deleteBoard} />
                        ))
                    ) : (
                        <p className="no-boards-message">No boards found matching your criteria. Try adjusting your filters or creating a new one!</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;