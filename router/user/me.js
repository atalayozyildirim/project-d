import express from "express";

const router = express.Router();

router.get("/me", (req, res) => {
  console.log(req.session.user);
});

export default router;
