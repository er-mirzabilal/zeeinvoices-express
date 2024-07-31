exports.fetchAllInvoices = (condition, search, options) => {
  return [
    // Match the specific condition
    {
      $match: condition,
    },

    // Match based on search term if provided
    ...(search && search.trim() !== ""
      ? [
          {
            $match: {
              $or: [{ id: { $regex: search, $options: "i" } }],
            },
          },
        ]
      : []),
    {
      $facet: {
        totalRecords: [{ $count: "count" }],
        invoices: [
          {
            $project: {
              id: 1,
              image: 1,
              type: 1,
              from: 1,
              to: 1,
              invoiceDate: 1,
              dueDate: 1,
              items: 1,
              settings: 1,
              notes: 1,
              status: 1,
            },
          },
          { $skip: options.skip },
          { $limit: options.limit },
          { $sort: { createdAt: -1 } },
        ],
      },
    },
    {
      $project: {
        totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
        invoices: 1,
      },
    },
  ];
};

exports.fetchAllClients = (condition, search, options) => {
  return [
    // Match the specific condition
    {
      $match: condition,
    },

    // Match based on search term if provided
    ...(search && search.trim() !== ""
      ? [
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),
    {
      $facet: {
        totalRecords: [{ $count: "count" }],
        clients: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              company_name: 1,
              phone_number: 1,
              city: 1,
              state: 1,
              address: 1,
            },
          },
          { $skip: options.skip },
          { $limit: options.limit },
          { $sort: { createdAt: -1 } },
        ],
      },
    },
    {
      $project: {
        totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
        clients: 1,
      },
    },
  ];
};
