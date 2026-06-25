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

app.get("/api",(req, res) => {
    res.json(
       posts.filter(post => post.username === req.user.name)
    );
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const token = generateToken(user);

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    res.json({ token, refreshToken });
});

function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '15s' });
}

app.listen(process.env.PORT || 4000);