import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const posts= [
    {
        username: "user1",
        title: "Post 1"
    },
    {
        username: "user2",
        title: "Post 2"
    }
];

app.get("/api",  authenticateToken, (req, res) => {
    res.json(
       posts.filter(post => post.username === req.user.name)
    );
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({ token });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(process.env.PORT || 4000);