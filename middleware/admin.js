
module.exports = function (req, res, next){
    if (!req.user.isAdmin) return res.status(403).send('Permission denied');
    console.log('Executing admin request');
    next();
};