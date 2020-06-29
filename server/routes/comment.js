const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================



// 댓글저장
router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body)

    comment.save((err, comment) =>{
        if(err) return res.status(400).json({success: false, err})
        // req.body로는 id밖에 가져오지못하기때문에 comment에 담긴 _id를 통해 writer정보를 다 가져옴
        Comment.find({'_id': comment._id})
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.status(400).json({success: false, err})
                res.status(200).json({success: true, result})
            })
    })

})

router.post('/getComments', (req,res)=>{
    Comment.find({"postId": req.body.videoId})
        .populate('writer')
        .exec((err,  comments)=>{
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success:true, comments})
        })
})


module.exports = router;
