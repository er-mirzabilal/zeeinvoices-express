exports.fetchAllInvoices = (condition, search, options) => {
  return [
    // Match the specific condition
    {
      $match: condition,
    },

    // Join with the `Client` or `Sender` collection for the `from` field
    {
      $lookup: {
        from: 'senders', // Replace with your actual collection name for clients/senders
        localField: 'from',
        foreignField: '_id',
        as: 'fromDetails',
      },
    },
    {
      $unwind: {
        path: '$fromDetails',
        preserveNullAndEmptyArrays: true, // In case there's no matching document
      },
    },

    // Join with the `Client` or `Sender` collection for the `to` field
    {
      $lookup: {
        from: 'clients', // Replace with the collection name for clients
        localField: 'to',
        foreignField: '_id',
        as: 'toDetails',
      },
    },
    {
      $unwind: {
        path: '$toDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    ...(search && search.trim() !== ""
      ? [
          {
            $match: {
              $or: [
                { id: { $regex: search, $options: "i" } }, // Search by invoice ID
                { 'toDetails.name': { $regex: search, $options: 'i' } }, // Search by client name
              ],
            },
          },
        ]
      : 
    [] ),
    { $sort: { id: -1 } },
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
              fromDetails: { $ifNull: ['$fromDetails', null] },
              toDetails: { $ifNull: ['$toDetails', null] }, 
            },
          },
          { $skip: options.skip },
          { $limit: options.limit },
        ],
      },
    },
    {
      $project: {
        totalRecords: { $ifNull: [{ $arrayElemAt: ["$totalRecords.count", 0] }, 0]  },
        invoices: 1,
      },
    },
  ];
};

exports.fetchSingleInvoice = (condition) => {
  return [
    // Match the specific invoice by ID
    {
      $match: condition,
    },

    // Join with the `Client` or `Sender` collection for the `from` field
    {
      $lookup: {
        from: 'senders', // Replace with your actual collection name for clients/senders
        localField: 'from',
        foreignField: '_id',
        as: 'fromDetails',
      },
    },
    {
      $unwind: {
        path: '$fromDetails',
        preserveNullAndEmptyArrays: true, // In case there's no matching document
      },
    },

    // Join with the `Client` or `Sender` collection for the `to` field
    {
      $lookup: {
        from: 'clients', // Replace with the collection name for clients
        localField: 'to',
        foreignField: '_id',
        as: 'toDetails',
      },
    },
    {
      $unwind: {
        path: '$toDetails',
        preserveNullAndEmptyArrays: true,
      },
    },

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
        fromDetails: { $ifNull: ['$fromDetails', null] },
        toDetails: { $ifNull: ['$toDetails', null] }, 
      },
    },

    // Limit to 1 document
    { $limit: 1 },
  ];
};


exports.fetchAllClients = (condition, search, options) => {
  const paginationPipeline = options.skip !== undefined && options.limit !== undefined
    ? [
        { $skip: options.skip },
        { $limit: options.limit },
      ]
    : [];
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
    { $sort: { _id: -1 } },
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
          ...paginationPipeline,
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

exports.fetchAllSenders = (condition, search, options) => {
  const paginationPipeline = options.skip !== undefined && options.limit !== undefined
    ? [
        { $skip: options.skip },
        { $limit: options.limit },
      ]
    : [];
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
    { $sort: { _id: -1 } },
    {
      $facet: {
        totalRecords: [{ $count: "count" }],
        senders: [
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
          ...paginationPipeline,
        ],
      },
    },
    {
      $project: {
        totalRecords: { $arrayElemAt: ["$totalRecords.count", 0] },
        senders: 1,
      },
    },
  ];
};
