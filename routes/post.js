const router = require('express').Router();
const { findById } = require('../models/Post');
const Post = require('../models/Post');


// CREATE A POST
router.post('/post', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    } catch (err) {
        res.status(500).json(err);
    }
})


// UPDATE A POST
router.put('/post/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json("Post updated Successfully!")
    } catch (err) {
        res.status(500).json(err);
    }
});


// DELETE A POST
router.delete('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (req.body.userId === post.userId) {
        try {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json("Post has been Deleted Successfully!")
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('You can only Delete your posts')
    }
});
// LIKE AND DISLIKE POST

router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
          await post.updateOne({ $push: { likes: req.body.userId } });
          res.status(200).json("The post has been liked");
        } else {
          await post.updateOne({ $pull: { likes: req.body.userId } });
          res.status(200).json("The post has been disliked");
        }
      } catch (err) {
        res.status(500).json(err);
      }
});


// GET A POST
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// GET TIMELINE POST
router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });








module.exports = router;