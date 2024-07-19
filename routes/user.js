const express = require("express");
const {
  getAll,
  update,
  getSingle,
  deleteSingle,
  create,
} = require("../controllers/user");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", getAll);
router.get("/:id", getSingle);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", deleteSingle);
router.post("/save", create);

module.exports = router;
