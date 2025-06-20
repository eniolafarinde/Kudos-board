import React, { useState } from 'react';
import './createCard.css'; 
// const api_key = import.meta.env.VITE_API_KEY;

const CreateCard = ({ onAddCard, onCloseModal }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gifUrl, setGifUrl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [gifResults, setGifResults] = useState([]);
    const [error, setError] = useState('');
    const [isSearchingGiphy, setIsSearchingGiphy] = useState(false);

    const handleSearchGiphy = async () => {
        setError('');
        if (!searchTerm.trim()) {
            setGifResults([]);
            return;
        }

        setIsSearchingGiphy(true);
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=THbFLWAypFZiA68NHsIpmc07sbRbaMB6&q=${searchTerm}&limit=10&offset=0&rating=g&lang=en`
            );
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Giphy API error response:", errorBody);
                throw new Error(`Giphy API error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGifResults(data.data);
        } catch (err) {
            console.error("Error searching Giphy:", err);
            setError("Failed to search Giphy. Please try again.");
            setGifResults([]);
        } finally {
            setIsSearchingGiphy(false);
        }
    };

    const handleSelectGif = (selectedGifUrl) => { 
        setGifUrl(selectedGifUrl);
        setGifResults([]); 
        setSearchTerm(''); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !description.trim()) {
            setError('Please fill in card title and description.');
            return;
        }

        const newCard = {
            title,
            description,
            gifUrl: gifUrl, 
        };

        onAddCard(newCard); 
        setTitle('');
        setDescription('');
        setGifUrl('');
        setSearchTerm('');
        setGifResults([]);
        onCloseModal();
    };

    return (
        <div className="create-card-container">
            <h2 className="create-card-title">Create New Card</h2>
            {error && <p className="form-error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="create-card-form">
                <div className="form-group">
                    <label htmlFor="card-title">Card Title </label>
                    <input
                        type="text"
                        id="card-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Card Title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="card-description">Description </label>
                    <textarea
                        id="card-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a description"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div className="form-group giphy-search-group">
                    <label htmlFor="gif-search">Add a GIF</label>
                    <div className="search-input-group">
                        <input
                            type="text"
                            id="gif-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for GIFs"
                            
                        />
                        <button type="button" onClick={handleSearchGiphy} disabled={isSearchingGiphy}>
                            {isSearchingGiphy ? 'Searching...' : 'Search GIF'}
                        </button>
                    </div>

                    {gifResults.length > 0 && (
                        <div className="gif-results">
                            {gifResults.map(gif => (
                                <img
                                    key={gif.id}
                                    src={gif.images.fixed_height_small.url}
                                    alt={gif.title}
                                    onClick={() => handleSelectGif(gif.images.original.url)}
                                    className={gifUrl === gif.images.original.url ? 'selected' : ''}
                                />
                            ))}
                        </div>
                    )}

                    {gifUrl && (
                        <div className="selected-image-preview">
                            <p>Selected GIF:</p>
                            <img src={gifUrl} alt="Selected card GIF" /> 
                            <button type="button" onClick={() => setGifUrl('')} className="clear-image-button">Clear GIF</button>
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-button">Create Card</button>
            </form>
        </div>
    );
};

export default CreateCard;