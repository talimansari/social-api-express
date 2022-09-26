const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


// UPADTE ROUTER
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json('Account has been Updated')
        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        res.status(403).json('You can only update your account')
    }

});

// DELETE ROUTER

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndRemove(req.params.id)
            res.status(200).json("User has been Deleted!")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});


// GET A USER
router.get('/:id', async (req, res) => {
    try {
        const finduser = await User.findById(req.params.id)
        res.status(200).json(finduser)
    } catch (err) {
        res.status(500).json(err)
    }
});


// ADD USER FOLLOWERS

router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const otherUser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!otherUser.follwers.includes(req.body.userId)) {
                await currentUser.updateOne({ $push: { follwings: req.params.id } })
                await otherUser.updateOne({ $push: { follwers: req.body.userId } })
            } else {
                res.status(403).json("you allready follow this user");
            }
            res.status(200).json("User has been followed!")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can follow Your self!")
    }
});

// USER UNFOLLOW
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const otherUser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (otherUser.follwers.includes(req.body.userId)) {
                await currentUser.updateOne({ $pull: { follwings: req.params.id } })
                await otherUser.updateOne({ $pull: { follwers: req.body.userId } })
            } else {
                res.status(403).json("you allready unfollow this user");
            }
            res.status(200).json("User has been unfollowed!")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can't follow Your self!")
    }
});







module.exports = router;
