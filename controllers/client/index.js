const Service = require("../../services/client");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query; // Added search query
  const skip = (page - 1) * limit;
  try {
    const result = await Service.findAll({}, search, {
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
  const data = { ...req.body };
  try {
    const record = await Service.create(data);
    handleResponse(res, 200, "Record Created", record);
  } catch (err) {
    handleError(res, err);
  }
};
