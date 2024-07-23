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
              settings: "$creatorDetails",
              notes: "$customerDetails",
              status: "$companyDetails",
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
