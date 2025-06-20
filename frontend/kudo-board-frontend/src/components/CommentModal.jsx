import React, { useState, useEffect, useCallback } from 'react';
import './CommentModal.css'; 

const CommentModalContent = ({ card, onClose, onCommentAdded, getCommentsApi }) => {
    const [comments, setComments] = useState([]);
    const [newCommentMessage, setNewCommentMessage] = useState('');
    const [newCommentAuthor, setNewCommentAuthor] = useState('');
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentError, setCommentError] = useState(null);

    const fetchComments = useCallback(async () => {
        setLoadingComments(true);
        setCommentError(null);
        try {
            const fetchedComments = await getCommentsApi(card.id);
            setComments(fetchedComments);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setCommentError(err.message || "Failed to load comments.");
        } finally {
            setLoadingComments(false);
        }
    }, [card.id, getCommentsApi]);

    useEffect(() => {
        if (card && card.id) {
            fetchComments();
        }
    }, [card, fetchComments]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentMessage.trim()) {
            alert("Comment message cannot be empty.");
            return;
        }

        try {
            const addedComment = await onCommentAdded(card.id, {
                message: newCommentMessage,
                author: newCommentAuthor || "Anonymous",
            });
            setComments(prevComments => [...prevComments, addedComment]);
            setNewCommentMessage('');
            setNewCommentAuthor('');
        } catch (err) {
            console.error("Failed to add comment:", err);
            alert(err.message || "Failed to add comment. Please try again.");
        }
    };

    if (!card) {
        return <div className="comment-modal-content">No card selected.</div>;
    }

    return (
        <div className="comment-modal-content">
            <h2 className="card-detail-title">{card.title}</h2>
            <p className="card-detail-description">{card.description}</p>
            {card.gifUrl && <img src={card.gifUrl} alt="Card GIF" className="card-detail-gif" />}
            {card.author && <p className="card-detail-author">By: {card.author}</p>}

            <h3>Comments</h3>
            {loadingComments ? (
                <p>Loading comments...</p>
            ) : commentError ? (
                <p className="error-message">Error: {commentError}</p>
            ) : comments.length === 0 ? (
                <p>No comments yet. Be the first to add one!</p>
            ) : (
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <p className="comment-message">{comment.message}</p>
                            <p className="comment-author">- {comment.author || 'Anonymous'}</p>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleCommentSubmit} className="add-comment-form">
                <h4>Add a Comment</h4>
                <textarea
                    placeholder="Your comment message"
                    value={newCommentMessage}
                    onChange={(e) => setNewCommentMessage(e.target.value)}
                    required
                ></textarea>
                <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                />
                <button type="submit" className="submit-comment-button">Add Comment</button>
            </form>
        </div>
    );
};

export default CommentModalContent;