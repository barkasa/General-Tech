// (1) вывести размеры EURO-транзакций из ЕВРОПЫ в долларах
db.transactions.aggregate([
  {
    $match: {
      currency: "EUR",
      from_country: "Europe",
    },
  },
  {
    $lookup: {
      from: "rates",
      let: { currency: "$currency" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$base", "USD"] },
                { $eq: ["$currency", "$$currency"] },
              ],
            },
          },
        },
      ],
      as: "rate",
    },
  },
  {
    $addFields: {
      rate: { $arrayElemAt: ["$rate.rate", 0] },
      usd_amount: {
        $multiply: ["$amount", { $arrayElemAt: ["$rate.rate", 0] }],
      },
    },
  },
  {
    $project: {
      _id: 0,
      from_country: 1,
      amount: 1,
      usd_amount: 1,
    },
  },
]);
// (2) вывести количество USD-транзакций из 'China'
db.transactions.count({
  currency: "USD",
  from_country: "China",
});
// (3) вывести три самых больших транзакции в 'usd'
db.transactions.find({ currency: "USD" }).sort({ amount: -1 }).limit(3);
// (4) вывести всех незаблокированных пользователей, у которых есть завершенные (is_completed) транзакции от 10 usd
db.users.find({
  blocked: false,
  transactions: {
    $elemMatch: {
      is_completed: true,
      amount: { $gte: 10 },
    },
  },
});
// (5) найти пользователей без транзакций
db.users.find({
  transactions: { $exists: false },
});
