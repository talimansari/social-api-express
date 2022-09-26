const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');



// USER REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    (!username || !email || !password) && res.status(422).json("All field required");
    const salt = await bcrypt.genSalt(10)
    const hashePassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
        email,
        password: hashePassword
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ ...err, message: 'something wrong' })
    }
})

// USER LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json('user not found');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(401).json('Wrong Password')
        res.status(200).json({ user, status: "true" });
    } catch (err) {
        res.status(500).json(err)
    }
})










module.exports = router;