const Model = require("../../models/sender");
const { fetchAllSenders } = require("../../utils/pipelines");
class SenderService {
  static findAll(condition, search, options) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllSenders(condition, search, options);
      Model.aggregate(pipeline)
        .then((result) => {
          const { totalRecords, senders } = result[0];
          resolve({ totalRecords, senders });
          //   resolve(records);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Model.findOne(data)
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
      Model.findOneAndUpdate(condition, data, { new: true })
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
      Model.findOneAndDelete(condition)
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
      Model.countDocuments(condition)
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
      Model.create(data)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = SenderService;
