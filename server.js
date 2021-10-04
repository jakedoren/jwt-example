const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.json())
app.use(cookieParser())

const posts = [
    {
        username: "Jacob",
        title: "Post 1"
    },
    {
        username: "Bob",
        title: "Post 2"
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    const { name } = res.locals.token
    const filteredPosts = posts.filter(post => post.username === name)
    res.send(filteredPosts)
})

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

function authenticateToken(req, res, next) {
    const token = req.headers.cookie.split('token=')[1]
    console.log(token)
    if(!token || token === undefined) return res.status(401).json({errorMessage: "Invalid token"})
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403)
        res.locals.token = decoded
        next()
    })
}


app.listen(3000, () => {
    console.log('Server is running on 3000')
})