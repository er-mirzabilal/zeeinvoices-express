const Service = require("../../services/client");
const UserService = require("../../services/user");
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
    const record = await Service.findBy({ _id: id });
    handleResponse(res, 200, "Single Record", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const record = await Service.update({ _id: id }, data);
    handleResponse(res, 200, "Record Updated", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.deleteSingle = async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Service.delete({ _id: id });
    handleResponse(res, 200, "Record Deleted", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.create = async (req, res) => {
  const user = req.user;
  const data = { ...req.body };
  try {
    const userFound = await UserService.findBy({ email: user?.email });
    if (!userFound) {
      throw new Error("Invalid user.");
    }
    const record = await Service.create({ ...data, user_id: userFound?._id });
    handleResponse(res, 200, "Record Created", record);
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Another client already exists with the same email.";
    }
    handleError(res, err);
  }
};
