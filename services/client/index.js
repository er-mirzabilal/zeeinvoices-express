const Model = require("../../models/client");
const { fetchAllClients } = require("../../utils/pipelines");
class ClientService {
  static findAll(condition, search, options) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllClients(condition, search, options);
      Model.aggregate(pipeline)
        .then((result) => {
          const { totalRecords, clients } = result[0];
          resolve({ totalRecords, clients });
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

module.exports = ClientService;
