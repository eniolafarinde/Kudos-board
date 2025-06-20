const express = require("express");
const { Router } = express;
const { PrismaClient } = require("@prisma/client");

const router = Router();
const prisma = new PrismaClient();

router.use("/api/cards/:cardId", (req, res, next) => {
    const { cardId: paramCardId } = req.params;
    const cardId = parseInt(paramCardId, 10);
    if (isNaN(cardId)) {
        return res.status(400).json({ message: "Invalid Card ID format. Expected an integer." });
    }
    req.cardId = cardId; 
    next();
});

router.post("/api/cards/:cardId/comments", async (req, res) => {
    const cardId = req.cardId;
    const { message, author } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ message: "Comment message body is required." });
    }

    try {
        const cardExists = await prisma.card.findUnique({
            where: { id: cardId },
        });

        const newComment = await prisma.comment.create({
            data: {
                message,
                author: author || null,
                cardId,
            },
        });
        res.status(201).json(newComment); 
    } catch (error) {
        console.error(`Error adding comment to card ${cardId}:`, error);
        res.status(500).json({ error: "Failed to add comment", details: error.message });
    }
});

router.get("/api/cards/:cardId/comments", async (req, res) => {
    const cardId = req.cardId; 

    try {
        const cardExists = await prisma.card.findUnique({
            where: { id: cardId },
        });
        const comments = await prisma.comment.findMany({
            where: { cardId },
            orderBy: {
                createdAt: 'asc',
            },
        });
        res.json(comments);
    } catch (error) {
        console.error(`Error fetching comments for card ${cardId}:`, error);
        res.status(500).json({ error: "Failed to fetch comments", details: error.message });
    }
});

module.exports = router;