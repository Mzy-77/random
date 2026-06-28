import express , {Request , Response} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});