
exports.about_get_all = function(req, res, next) {
    res.status(200).json({
        message: 'get aboutController'
    });
};

exports.about_post_all = function (req, res, next) {
    res.status(200).json({
        message: 'post aboutController'
    });
};
