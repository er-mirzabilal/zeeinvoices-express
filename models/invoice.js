const mongoose = require("mongoose");
const { invoiceStatus } = require("../utils/constant");
const invoiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: "Invoice id is required",
    },
    logo: {
      type: String,
    },
    type: {
      type: String,
      required: "Invoice type is required",
    },
    from: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    to: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    invoiceData: {
      type: String,
      requried: "Invoice date is required",
    },
    dueDate: {
      type: String,
    },
    items: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    settings: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      default: invoiceStatus.PENDING,
    },
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: "User reference is required",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoices", invoiceSchema);
