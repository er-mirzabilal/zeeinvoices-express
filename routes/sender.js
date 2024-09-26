const express = require("express");
const {
  getAll,
  update,
  getSingle,
  deleteSingle,
  create,
  getAllData
} = require("../controllers/sender");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();

router.get("/", authMiddleware, getAll);
router.get("/getAll", authMiddleware, getAllData);
router.get("/:id", authMiddleware, getSingle);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, deleteSingle);
router.post("/save", authMiddleware, create);

module.exports = router;
