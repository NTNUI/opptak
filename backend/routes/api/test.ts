import express from "express";
const testRouter = express.Router();

testRouter.get("/", (req, res) => {
    res.status(200).json({ msg: "Hello! This is a test" });
});

export default testRouter