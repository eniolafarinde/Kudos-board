const validateCreateBoard = (req, res, next) => {
    const { body : { title, category, author}} = req
    if (!title || !category) return res.status(400).json({message : "Title and category is required"})
    next()
}

const validateId = (req, res, next) => {
    const { body : { id } } = req
    const parsedInt = parseInt(id)

    if (isNaN(parsedInt)) return res.status(400)
    next()
}

module.exports = {
    validateCreateBoard,
    validateId
}