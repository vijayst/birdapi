module.exports = function(req, res, next) {
    const { role } = req.user;
    if (role === 'admin') {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};