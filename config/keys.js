module.exports = {
    mongoURI: 'mongodb+srv://admin:2aJwl6*Yiezq@fs-blog-t5tir.mongodb.net/test?retryWrites=true&w=majority',
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success_message');
        res.locals.error_message = req.flash('error_message');
        res.locals.user = req.user || null;
        next();
    }
};