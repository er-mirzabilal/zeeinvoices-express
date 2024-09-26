exports.saveInvoice = {
  id: "0001",
  type: "Invoice",
  from: {
    name: "wewe",
    email: "ad@sds.com",
    company: "sdasdas",
    phoneNumber: "2312123121",
  },
  to: {
    name: "wewe",
    email: "ad@sds.com",
    company: "sdasdas",
    phoneNumber: "2312123121",
  },
  invoiceData: "23/4/2024",
  dueDate: "25/4/2024",
  items: [
    { name: "adasasd", qty: 1, rate: 334, tax: 23, subTotal: 344 },
    { name: "adasasd232w", qty: 2, rate: 14, tax: 23, subTotal: 28 },
  ],
  settings: {
    color: "red",
    currency: "USD",
    dueDate: true,
  },
  status: "Pending",
};

exports.saveUser = {};
