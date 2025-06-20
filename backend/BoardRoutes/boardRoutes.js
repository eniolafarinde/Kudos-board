const express = require("express")
const { Router } = express
const { PrismaClient } = require("@prisma/client")
const { validateCreateBoard, validateId } = require("../ApiValidation/apiValidation.js")

const router = Router()
const prisma = new PrismaClient()

// create a board
router.post("/api/board/create", validateCreateBoard, async(req, res) => {
    const getImage = (width = 400, height = 200) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
    }

    console.log(res)

    const { body : { title, category, author}} = req
    const board = await prisma.board.create({
        data : {
            title : title,
            category : category,
            image : getImage(),
            author : author ? author : ""
        }
    })
    res.json(board)
})

// view all board
router.get("/api/board/all", async(req, res) => {
    const boards = await prisma.board.findMany()
    res.json(boards)
})

// view a board
router.get("/api/board/:id", async (req, res) => {
    const { id: paramId } = req.params; 
    const boardId = parseInt(paramId, 10); 
    if (isNaN(boardId)) {
        return res.status(400).json({ message: "Invalid Board ID format. Expected an integer." });
    }

    try {
        const board = await prisma.board.findUnique({ 
            where: { id: boardId },
            include: { cards: true },
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        res.json(board);
    } catch (error) {
        console.error("Error fetching board by ID:", error);
        res.status(500).json({ message: "Failed to fetch board", error: error.message });
    }
});


// delete a board

router.delete("/api/board/delete", validateId, async(req, res) => {
    const { body : { id } } = req
    await prisma.card.deleteMany({
        where : {
            boardId : id
        }
    })
    const deletedCard = await prisma.board.delete({
        where : {
            id : id
        }
    })
    res.json(deletedCard)
})

module.exports = router