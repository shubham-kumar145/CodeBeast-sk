const redisClient = require('../config/redis');
const Submission = require('../model/submission');
const User = require('../model/user')
const validate = require('../utils/valitaor')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {

        // validate the data
        // console.log("111");

        validate(req.body)

        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)
        req.body.role = 'user'

        const user = await User.create(req.body)
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: 'user' }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        res.status(201).json({
            user:reply,
            message:'user created successfully'
        })
    } catch (err) {
        res.status(400).send('ERROR: ' + err)
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId) {
            throw new Error("Invalid Credentials")
        }
        if (!password) {
            throw new Error("Invalid Credentials")
        }
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(401).send('Invalid Credentials');
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new Error('Invalid Credentials')
        }
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        res.status(201).json({
            user:reply,
            message:"Logged In Successfully"
        })
    } catch (err) {
        res.status(401).send('ERROR: ' + err)
    }
}

const logout = async (req, res) => {
    try {
        // validate the token
        const { token } = req.cookies
        const payload = jwt.decode(token);
        await redisClient.set(`token:${token}`, "Blocked")
        await redisClient.expireAt(`token:${token}`, payload.exp)
        res.cookie("token", null, { expires: new Date(Date.now()) })
        res.status(200).send("Logged Out Succesfully")
        // token add kar dung redis ke blocklist
    } catch (err) {
        res.status(503).send("ERROR: " + err)
    }
}

const adminRegister = async (req, res) => {
    try {


        validate(req.body)

        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)
        // req.body.role = 'admin'

        const user = await User.create(req.body)
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        res.status(201).send("User Registered Successfully");
    } catch (err) {
        // console.log('22222');

        res.status(400).send('ERROR: ' + err)
    }
}

const deleteprofile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        // await Submission.deleteMany(userId)
        res.status(200).send("Deleted Successfully")
    } catch (err) {

        res.status(500).send("SERVER ERROR")
    }
}

module.exports = { login, register, logout, adminRegister, deleteprofile }
