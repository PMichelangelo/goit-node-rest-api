const extractOwner = (req, res, next) => {
    const { _id: owner } = req.user
    req.locals = { owner }
    next()
}

export default extractOwner