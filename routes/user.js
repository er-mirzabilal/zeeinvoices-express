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
router.get("/my-profile", getMy);
router.put("/my-profile", upload.single("image"), updateMyProfile);
router.delete("/:id", deleteSingle);
router.post("/login", create);

module.exports = router;
