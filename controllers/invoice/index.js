const Service = require("../../services/invoice");
const { addOrUpdateOrDelete } = require("../../services/multer");
const UserService = require("../../services/user");
const SenderService = require("../../services/sender");
const ClientService = require("../../services/client");
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
  let { id } = req.params;
  try {
    if (!id) {
      throw new Error("ID is required");
    }
    // id = parseInt(id);
    const record = await Service.findBy({ id: id });
    handleResponse(res, 200, "Single Record", record);
  } catch (err) {
    handleError(res, err);
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  // if (data?.from) {
  //   data.from = JSON.parse(data?.from);
  // }
  // if (data?.to) {
  //   data.to = JSON.parse(data?.to);
  // }
  if (data?.settings) {
    data.settings = JSON.parse(data?.settings);
  }
  if (data?.items) {
    data.items = JSON.parse(data?.items);
  }
  try {
    const oldRecord = await Service.findBy({ _id:id });
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
    const record = await Service.update({ _id:id }, data);
    handleResponse(res, 200, "Record Updated", record);
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Another invoice already exist with same reference.";
    }
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
  let newTo = null; //sender
  let newFrom = null; //receiver

  if (!data?.from) {
    newFrom = JSON.parse(data?.newFrom);
  }
  if (!data?.to) {
    newTo = JSON.parse(data?.newTo);
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

    if(newFrom){
      let senderDetails = await SenderService.findBy({ email: newFrom.email , user_id: userFound._id });
      if(senderDetails){
        delete newFrom.email;
        delete newFrom.user_id;
        delete newFrom._id;
        senderDetails = senderDetails.toObject();
        senderDetails = { ...senderDetails, ...newFrom };
        await SenderService.update({ _id: senderDetails._id } , senderDetails);
        data.from = senderDetails._id;
      }else{
        newFrom = {...newFrom , user_id: userFound._id };
        let senderDetails = await SenderService.create(newFrom);
        data.from = senderDetails._id;
      }
    }
    
    if(newTo){
      let receiverDetails = await ClientService.findBy({ email: newTo.email , user_id: userFound._id });
      if(receiverDetails){
        delete newTo.email;
        delete newTo.user_id;
        delete newTo._id;
        receiverDetails = receiverDetails.toObject();
        receiverDetails = { ...receiverDetails, ...newTo };
        await ClientService.update({ _id: receiverDetails._id } , receiverDetails);
        data.to = receiverDetails._id;
      }else{
        newTo = {...newTo , user_id: userFound._id };
        let receiverDetails = await ClientService.create(newTo);
        data.to = receiverDetails._id;
      }
    }
    

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.INVOICES,
        req.file.path
      );
    }
    
    // const lastRecord = await Service.lastRecord();
    // if(lastRecord && lastRecord?.id >= data.id){
    //   data.id = lastRecord.id + 1;
    // }
    const record = await Service.create({ ...data, user_id: userFound?._id });
    handleResponse(res, 200, "Your invoice is successfully saved", record);
  } catch (err) {
    
    // if (err.code === 11000) {
    //   let retryCount = req.retryCount || 0;
    //   if (retryCount < 3) {  // retry limit
    //     req.retryCount = retryCount + 1;
    //     return exports.create(req, res);  // Retry by calling the same function
    //   } else {
    //     handleError(res, err);
    //   }
    // } else {
      if (err.code === 11000) {
        err.message = "Another invoice already exist with same reference.";
      }
      handleError(res, err);
    // }
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
