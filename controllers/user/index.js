const Service = require("../../services/user");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { multerActions, multerSource } = require("../../utils/constant");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  try {
    const records = await Service.findAll();
    handleResponse(res, 200, "All Records", records);
  } catch (err) {
    handleError(res, err);
  }
};
exports.getMy = async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      throw new Error("Invalid user.");
    }
    const record = await Service.findBy({ email: user?.email });
    handleResponse(res, 200, "Record", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.updateMy = async (req, res) => {
  const user = req.user;
  const data = { ...req.body };
  try {
    if (!user) {
      throw new Error("Invlaid user.");
    }
    const oldRecord = await Service.findBy({ email: user?.email });
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.USERS,
        req.file.filename,
        oldRecord.image
      );
    }
    const record = await Service.update({ email: user?.email }, data);
    handleResponse(res, 200, "Record Updated", record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.create = async (req, res) => {
  const data = { ...req.body };
  try {
    console.log(data.email,'data');
    const recordFound = await Service.findBy({ email: data?.email });
    console.log(recordFound,'record');
    if (!recordFound) {
      const record = await Service.create(data);
      handleResponse(res, 200, "Record Created", record);
    } else {
      handleResponse(res, 200, "Record Found", recordFound);
    }
  } catch (err) {
    handleError(res, err);
  }
};
