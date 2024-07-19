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
exports.getSingle = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("ID is required");
    }
    const record = await Service.findBy({ id });
    handleResponse(res, 200, "Single Record", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const oldRecord = await Service.findBy({ id });
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.INVOICES,
        req.file.filename,
        oldRecord.image
      );
    }
    const record = await Service.update({ id }, data);
    handleResponse(res, 200, "Record Updated", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.deleteSingle = async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Service.delete({ id });
    if (
      record &&
      record.image &&
      record.image?.startsWith("images/invoices/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.INVOICES,
        record.image
      );
    }

    handleResponse(res, 200, "Record Deleted", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.create = async (req, res) => {
    const data = { ...req.body };
    try {
      const record = await Service.create(data);
      handleResponse(res, 200, "Record Created", record);
    } catch (err) {
      handleError(res, err);
    }
};
