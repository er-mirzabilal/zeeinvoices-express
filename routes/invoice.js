const express = require("express");
const {
  getAll,
  update,
  getSingle,
  deleteSingle,
  create,
  getlastRecord
} = require("../controllers/invoice");
const { upload } = require("../services/multer");
const router = express.Router();

router.get("/", getAll);
router.get("/last-record", getlastRecord);
router.get("/:id", getSingle);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", deleteSingle);
router.post("/save", upload.single("image"), create);

module.exports = router;
