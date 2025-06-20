import React, { useState } from 'react';
import './CreateBoard.css';
import { getBaseUrl } from '../utils';

const CreateBoard = ({ onAddBoard }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('celebration'); 
    const [author, setAuthor] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        const newBoard = {
            title : title,
            category : category,
            author: author
        };
        try {
            const response = await fetch(`${getBaseUrl()}/api/board/create`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(newBoard)
            })
        } catch (error) {
            throw new Error(error)
        }
        onAddBoard(newBoard);

        setTitle('');
        setDescription('');
        setCategory('celebration');
        setAuthor('');

    };

    return (
        <div className="create-board-container">
            <h1 className="create-board-title">Create a New Board</h1>
            <form onSubmit={handleSubmit} className="create-board-form">
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category: </label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="celebration">Celebration</option>
                        <option value="thank you">Thank You</option>
                        <option value="inspiration">Inspiration</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author: (Optional)</label>
                    <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>

                <button type="submit" className="submit-button">Create Board</button>
            </form>
        </div>
    );
};

export default CreateBoard;