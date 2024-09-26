const express = require("express");
const { getAll, updateMy, getMy, create } = require("../controllers/user");
const { upload } = require("../services/multer");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();

router.get("/", authMiddleware, getAll);
router.get("/my-profile", authMiddleware, getMy);
router.put("/my-profile", authMiddleware, upload.single("image"), updateMy);
router.post("/save", authMiddleware, create);

module.exports = router;
