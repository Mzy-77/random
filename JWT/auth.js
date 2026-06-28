import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let refreshTokens = [];

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

app.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const accessToken = generateToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

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
    refreshTokens.push(refreshToken);
    res.json({ token, refreshToken });
});

app,delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '15s' });
}

app.listen(process.env.PORT || 4000);