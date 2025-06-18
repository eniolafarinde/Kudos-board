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

// view a board
router.get("/api/board/view", validateId, async(req, res) => {
    const { body : { id } } = req
    const board = await prisma.board.findFirst({
        where : {
            id : id
        },
        include : {
            cards : true
        }
    })
    res.status(200).json(board.cards)
})

// view all board
router.get("/api/board/all", async(req, res) => {
    const boards = await prisma.board.findMany()
    res.status(200).json(boards)
})

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
    res.status(200).json(deletedCard)
})

module.exports = router