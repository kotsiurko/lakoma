const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const Comment = require('../models/CommentModel').Comment;
const PortfolioItem = require('../models/PortfolioItemModel').PortfolioItem;
const {isEmpty} = require('../config/customFunctions');

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },


    /* Admin Posts Endpoints */


    getPosts: (req, res) => {
        Post.find()
            .populate('category')
            .then(posts => {
            res.render('admin/posts/index', {posts: posts});
        });
    },

    getCreatePostPage: (req, res) => {
        Category.find().then(cats => {
            res.render('admin/posts/create', {categories: cats});
        });
    },

    submitCreatePostPage: (req, res) => {

        const commentsAllowed = !!req.body.allowComments;

        // Check for any input file
        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });

        newPost.save().then(post => {
            req.flash('success_message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },

    getEditPostPage: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                Category.find().then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                });
            });
    },


    submitEditPostPage: (req, res) => {
        const commentsAllowed = !!req.body.allowComments;
        const id = req.params.id;
        Post.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = commentsAllowed;
                post.description = req.body.description;
                post.category = req.body.category;


                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');
                });
            });
    },

    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost =>{
                req.flash('success_message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            });
    },






    /* Portfolio Items Endpoints */


    GetPortfolioItems: (req, res) => {
        PortfolioItem.find()
            .populate('category')
            .then(portfolioItems => {
                res.render('admin/portfolio/index', {portfolioItems: portfolioItems});
            });
    },


    getCreatePortfolioItemPage: (req, res) => {
        Category.find().then(cats => {
            res.render('admin/portfolio/create', {categories: cats});
        });
    },


    submitCreatePortfolioItemPage: (req, res) => {

        const commentsAllowed = !!req.body.allowComments;

        // Check for any input file
        let filename = '';

        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }

        const newPortfolioItem = new PortfolioItem({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });

        newPortfolioItem.save().then(portfolioItem => {
            req.flash('success_message', 'Portfolio item created successfully.');
            res.redirect('/admin/portfolio');
        });
    },



    getEditPortfolioItemPage: (req, res) => {
        const id = req.params.id;

        PortfolioItem.findById(id)
            .then(portfolioItem => {
                Category.find().then(cats => {
                    res.render('admin/portfolio/edit', {portfolioItem: portfolioItem, categories: cats});
                });
            });
    },


    submitEditPortfolioItemPage: (req, res) => {
        const commentsAllowed = !!req.body.allowComments;
        const id = req.params.id;
        PortfolioItem.findById(id)
            .then(portfolioItem => {
                portfolioItem.title = req.body.title;
                portfolioItem.status = req.body.status;
                portfolioItem.allowComments = commentsAllowed;
                portfolioItem.description = req.body.description;
                portfolioItem.category = req.body.category;


                portfolioItem.save().then(updatePortfolioItem => {
                    req.flash('success-message', `The Item ${updatePortfolioItem.title} has been updated.`);
                    res.redirect('/admin/portfolio');
                });
            });
    },


    deletePortfolioItem: (req, res) => {

        PortfolioItem.findByIdAndDelete(req.params.id)
            .then(deletedPortfolioItem =>{
                req.flash('success_message', `The portfolio Item ${deletedPortfolioItem.title} has been deleted.`);
                res.redirect('/admin/portfolio');
            });
    },
























    /* ALL CATEGORY METHODS*/
    getCategories: (req, res) => {

        Category.find().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },


    createCategories: (req, res) => {
        let categoryName = req.body.name;

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }
    },

    getEditCategoriesPage: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find();


        Category.findById(catId).then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });
    },


    submitEditCategoriesPage: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });

            });
        }
    },

    deleteCategory: (req, res) => {

        Category.findByIdAndDelete(req.params.id)
            .then(deletedCategory =>{
                req.flash('success_message', `The category ${deletedCategory.title} has been deleted.`);
                res.redirect('/admin/category');
            });
    },



    /* COMMENT ROUTE SECTION*/
    getComments: (req, res) => {
        Comment.find()
            .populate('user')
            .then(comments => {
                res.render('admin/comments/index', {comments: comments});
            })
    },

    approveComments: (req, res) => {
        var data = req.body.data;
        var commentId = req.body.id;

        console.log(data, commentId);

        Comment.findById(commentId).then(comment => {
            comment.commentIsApproved = data;
            comment.save().then(saved => {
                res.status(200).send('OK');
            }).catch(err => {
                res.status(201).send('FAIL');
            });
        });
    }
    

};

