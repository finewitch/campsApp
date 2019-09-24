var express =       require("express"),
router=             express.Router(),
Campground=               require("../models/campground");
Comment=               require("../models/comment"),
middleware =        require('../middleware');



router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn,  function(req, res){
    var campId = req.params.id;
    Campground.findById(campId).populate('comments').exec(function(err, camp){
        if(err){
            console.log('error with get', err)
        }else{
            // req.flash({'info': 'ddddd'})
            res.render('comments/new', {camp})
        }
    })
})

router.post('/campgrounds/:id/comments', function(req, res){
    var campId = req.params.id;
    Campground.findById(campId).populate('comments').exec(function(err, camp){
        if(err){
            console.log('error in comment, find by id', err)
        }else{
            // console.log(camp, 'camp founded!!!')
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log('err from comment', err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // console.log('user goes here', req.user.username)
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();

                    console.log(comment, 'comment here')
                    res.redirect('/campgrounds/' + campId)
                }
            })
        }
    })
})

//EDIT COMMENT
router.get('/campgrounds/:id/comments/:comment_id/edit', function(req, res){
    
    var campId = req.params.id;
    var commentId = req.params.comment_id;

    console.log('currentUser', req.user.username)
    
    Comment.findById(commentId, function(err, comment){
        // console.log(comment)
        // if(comment.author.username != req.user.username){
        //     // req.flash("error", "You c");
        //     res.redirect('/campgrounds/' + campId)
        // }else{

            if(err){
                console.log('error while editting comment', err);
            }else{
                res.render('comments/edit', {comment, campId});
            }

        // }

    })

})

//UPDATE COMMENT
router.put('/campgrounds/:id/comments/:comment_id', function(req, res){

    var commentId = req.params.comment_id;
    var data = req.body.comment;
    var campId = req.params.id;

    Comment.findByIdAndUpdate(commentId, data, function(err, updateComment){
        if(err){
            console.log('error with get')
        }else{
            console.log('cmt udated!>>:', updateComment);
            res.redirect('/campgrounds/' + campId)
        }
    })
 
})

//DELETE--------
router.delete('/campgrounds/:id/comments/:comment_id', middleware.isLoggedIn, function(req,res){
    var commentId = req.params.comment_id;
    Comment.findByIdAndDelete(commentId, function(err, deletedComment){
        if(err){
            console.log('error with get', err)
        }else{
            console.log('comment deleted')
              req.flash("success", "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


module.exports = router;