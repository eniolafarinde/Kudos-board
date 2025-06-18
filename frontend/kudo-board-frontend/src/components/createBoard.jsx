import React, { useState } from 'react';
import './CreateBoard.css';

const imageUrl = (width = 400, height = 200) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
};

const CreateBoard = ({ onAddBoard }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('celebration'); 
    const [image, setImage] = useState(imageUrl(400, 200)); 
    const [author, setAuthor] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newBoard = {
            id: Date.now().toString(),
            title,
            description,
            category,
            image: imageUrl(400, 200),
            author: author || '', 
            createdAt: new Date().toISOString(),
        };
        onAddBoard(newBoard);

        setTitle('');
        setDescription('');
        setCategory('celebration');
        setImage(imageUrl(400, 200));
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