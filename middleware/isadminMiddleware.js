const isadminMiddleware = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "You are not admin",
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = isadminMiddleware;