const Post = require('../models/PostModel').Post;
const PortfolioItem = require('../models/PortfolioItemModel').PortfolioItem;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;


module.exports = {

    /* Blog ROUTES */
    blogGet: async (req, res) => {

        const posts = await Post.find();
        const categories = await Category.find();
        res.render('default/blog', {posts: posts, categories: categories});
    },

    /* INDEX PAGE ROUTES */
    index: (req, res) => {
        res.render('default/index', {message: req.flash('error')});
    },

    /* ABOUT PAGE ROUTES */
    aboutGet: (req, res) => {
        res.render('default/about', {message: req.flash('error')});
    },

    /* PORTFOLIO PAGE ROUTES */
    portfolioGet: async (req, res) => {

        const portfolioItems = await PortfolioItem.find();
        const categories = await Category.find();
        res.render('default/portfolio', {portfolioItems: portfolioItems, categories: categories});
    },

    /* CONTACTS PAGE ROUTES */
    contactsGet: (req, res) => {
        res.render('default/contacts', {message: req.flash('error')});
    },


    /* LOGIN ROUTES */
    loginGet: (req, res) => {
        res.render('default/login', {message: req.flash('error')});
    },


    loginPost: (req, res) => {

    },

    /* REGISTER ROUTES*/

    registerGet: (req, res) => {
        res.render('default/register');
    },

    registerPost: (req, res) => {
        let errors = [];

        if (!req.body.firstName) {
            errors.push({message: 'First name is mandatory'});
        }
        if (!req.body.lastName) {
            errors.push({message: 'Last name is mandatory'});
        }
        if (!req.body.email) {
            errors.push({message: 'Email field is mandatory'});
        }
        if (!req.body.password || !req.body.passwordConfirm) {
            errors.push({message: 'Password field is mandatory'});
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({message: 'Passwords do not match'});
        }

        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else {
            User.findOne({email: req.body.email}).then(user => {
                if (user) {
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                } else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'You are now registered');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },

    getSinglePost: async (req, res) => {
        const id = req.params.id;
        const categories = await Category.find();

        Post.findById(id)
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(post => {
            if (!post){
                res.status(404).json({message: 'No Post Found'});
            }
            else {
                res.render('default/singlePost', {post: post, comments: post.comments, categories: categories});
            }
        })
    },

    getSinglePortfolioItem: async (req, res) => {
        const id = req.params.id;
        const categories = await Category.find();

        PortfolioItem.findById(id)
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(portfolioItem => {
                if (!portfolioItem){
                    res.status(404).json({message: 'No Portfolio Items Found'});
                }
                else {
                    res.render('default/singlePortfolioItem', {portfolioItem: portfolioItem, comments: portfolioItem.comments, categories: categories});
                }
            })
    },

    submitComment: (req, res) => {

        if (req.user) {
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        req.flash('success_message', 'Your comment was submitted for review.');
                        res.redirect(`/post/${post._id}`);
                    });
                });


            })
        }

        else {
            req.flash('error_message', 'Login first to comment');
            res.redirect('/login');
        }

    }

};

