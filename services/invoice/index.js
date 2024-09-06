const Invoice = require("../../models/invoice");
const { fetchAllInvoices } = require("../../utils/pipelines");
class InvoiceService {
  static findAll(condition, search, options) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllInvoices(condition, Number(search), options);
      console.log(pipeline)
      Invoice.aggregate(pipeline)
        .then((result) => {
          const { totalRecords, invoices } = result[0];
            resolve({ totalRecords, invoices });
          // resolve(records);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Invoice.findOne(data)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static lastRecord(data) {
    return new Promise((resolve, reject) => {
      Invoice.findOne(data)
        .sort({ createdAt: -1 })
        .exec()
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Invoice.findOneAndUpdate(condition, data, { new: true })
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Invoice.findOneAndDelete(condition)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Invoice.countDocuments(condition)
        .then((count) => {
          resolve(count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      Invoice.create(data)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = InvoiceService;
