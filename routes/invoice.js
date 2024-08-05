const express = require("express");
const {
  getAll,
  update,
  getSingle,
  deleteSingle,
  create,
  getlastRecord,
} = require("../controllers/invoice");
const { upload } = require("../services/multer");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();

router.get("/", authMiddleware, getAll);
router.get("/last-record", getlastRecord);
router.get("/:id", getSingle);
router.put("/:id", authMiddleware, upload.single("image"), update);
router.delete("/:id", authMiddleware, deleteSingle);
router.post("/save", authMiddleware, upload.single("image"), create);

module.exports = router;
