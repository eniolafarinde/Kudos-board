const express = require("express")
const { Router } = express
const { PrismaClient } = require("@prisma/client")

const router = Router()
const prisma = new PrismaClient()

router.get("/api/board/:boardId/cards", async (req, res) => {
    const { boardId: paramBoardId } = req.params;
    const boardId = parseInt(paramBoardId, 10);
    try {
        const cards = await prisma.card.findMany({
            where: { boardId: boardId }
        });
        res.json(cards);
    } catch (error) {
        console.error(`Error fetching cards for board ${boardId}:`, error);
        res.status(500).json({ error: "Failed to fetch cards", details: error.message });
    }
});


router.post("/api/board/:boardId/cards/create", async (req, res) => {
    const { boardId: paramBoardId } = req.params;
    const boardId = parseInt(paramBoardId, 10);
    const { title, description, gifUrl } = req.body; 
    try {
        const boardExists = await prisma.board.findUnique({
            where: { id: boardId }
        });
        const newCard = await prisma.card.create({
            data: {
                title: title,
                description: description,
                gifUrl: gifUrl,  
                boardId: boardId,  
            },
        });
        res.status(201).json(newCard);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ error: "Failed to create card", details: error.message });
    }
});

router.patch("/api/board/:boardId/cards/:cardId/upvote", async (req, res) => {
    const { cardId: paramCardId } = req.params;
    const cardId = parseInt(paramCardId, 10);
    try {
        const updatedCard = await prisma.card.update({
            where: { id: cardId },
            data: {
                upvote: { 
                    increment: 1,
                },
            },
        });
        res.json(updatedCard);
    } catch (error) {
        console.error(`Error upvoting card ${cardId}:`, error);
        res.status(500).json({ error: "Failed to upvote card", details: error.message });
    }
});

router.delete("/api/board/:boardId/cards/:cardId", async (req, res) => {
    const { cardId: paramCardId } = req.params;
    const cardId = parseInt(paramCardId, 10);
    try {
        const cardToDelete = await prisma.card.findUnique({
            where: { id: cardId },
        });

        await prisma.card.delete({
            where: { id: cardId },
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting card ${cardId}:`, error);
        res.status(500).json({ error: "Failed to delete card", details: error.message });
    }
});

module.exports = router;