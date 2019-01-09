// isCarpark.js
module.exports = function (req, res, next) {

    if (req.session.role == 'carpark') {
        return next(); //proceed to the next policy,
    }

    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    return res.forbidden('You are not permitted to perform this action.');
}; 