import React from 'react';
import { Link } from 'react-router-dom';
import './KudoBoardCard.css';

const KudosBoardCard = ({ board, onDelete }) => {
    return (
        <div className="kudos-board-card">
            <img src={board.image} alt={board.title} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{board.title}</h3>
                <div className="card-meta">
                    {board.category}
                </div>
            </div>
            <div className="card-action"> 
                <Link to={`/boards/${board.id}`} className="view-board-button"> View Board </Link>
                <button className="delete-button"
                    onClick={() => {
                        if (window.confirm) {
                            onDelete(board.id);
                        }
                    }}
                > Delete</button>
            </div>
        </div>
    );
};

export default KudosBoardCard;