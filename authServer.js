const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.json())
app.use(cookieParser())

app.post('/login', (req, res) => {
    
    const username = req.body.username

    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.cookie('token', accessToken, { httpOnly: true }).json({success: "Cookie Sent"})
})

app.get('/logout', (req, res) =>{
    res.cookie("token", "", {
        httpOnly: true, 
        secure: true,
        sameSite: "none",    
        expires: new Date(1)
    }).json({success: "Successfully logged out"})
})

app.listen(4000, () => {
    console.log('Server is running on 4000')
})