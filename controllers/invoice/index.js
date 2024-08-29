const Service = require("../../services/invoice");
const { addOrUpdateOrDelete } = require("../../services/multer");
const UserService = require("../../services/user");
const { multerActions, multerSource } = require("../../utils/constant");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const user = req.user;
  const { page = 1, limit = 10, search = "" } = req.query; // Added search query
  const skip = (page - 1) * limit;
  try {
    const userFound = await UserService.findBy({ email: user?.email });
    if (!userFound) {
      throw new Error("Invalid user.");
    }
    const result = await Service.findAll({ user_id: userFound?._id }, search, {
      skip,
      limit: Number(limit),
    });
    handleResponse(res, 200, "All Records", result);
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
  if (data?.from) {
    data.from = JSON.parse(data?.from);
  }
  if (data?.to) {
    data.to = JSON.parse(data?.to);
  }
  if (data?.settings) {
    data.settings = JSON.parse(data?.settings);
  }
  if (data?.items) {
    data.items = JSON.parse(data?.items);
  }
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
    if (data?.image === "no-image") {
      if (oldRecord?.image) {
        console.log("only remove image");
        await addOrUpdateOrDelete(
          multerActions.DELETE,
          multerSource.INVOICES,
          oldRecord.image
        );
      }
      data.image = "";
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

    handleResponse(res, 200, "Invoice deleted successfully", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.create = async (req, res) => {
  const user = req.user;
  const data = { ...req.body };
  if (data?.from) {
    data.from = JSON.parse(data?.from);
  }
  if (data?.to) {
    data.to = JSON.parse(data?.to);
  }
  if (data?.settings) {
    data.settings = JSON.parse(data?.settings);
  }
  if (data?.items) {
    data.items = JSON.parse(data?.items);
  }
  try {
    const userFound = await UserService.findBy({ email: user?.email });
    if (!userFound) {
      throw new Error("Invalid user.");
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.INVOICES,
        req.file.path
      );
    }
    console.log(user,'user',userFound);
    const record = await Service.create({ ...data, user_id: userFound?._id });
    handleResponse(res, 200, "Your invoice is successfully saved", record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getlastRecord = async (req, res) => {
  try {
    let newId = 1;
    const record = await Service.lastRecord();
    if (record) {
      newId = record.id + 1;
    }
    handleResponse(res, 200, "Latest Id", newId);
  } catch (err) {
    handleError(res, err);
  }
};
