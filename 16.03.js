// В рамках БД "bank" напишите след/запросы:
// 1;Вывести общую и среднюю продолжительность звонков по каждой теме
db.products.aggregate([
  {
    $lookup: {
      from: "suppliers",
      localField: "supplier_id",
      foreignField: "supplier_id",
      as: "supplier",
    },
  },
  {
    $unwind: "$supplier",
  },
  {
    $group: {
      _id: "$supplier.supplier_name",
      number_of_products: { $sum: 1 },
      total_cost: { $sum: "$price" },
    },
  },
]);
// (2);Вывести общую и среднюю продолжительность звонков по каждой теме
db.calls.aggregate([
  {
    $group: {
      _id: "$topic",
      total_duration: { $sum: "$duration" },
      average_duration: { $avg: "$duration" },
    },
  },
]);
// (3);Вывести тему звонков, по которой общались меньше всего
db.calls.aggregate([
  {
    $group: {
      _id: "$topic",
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: 1 },
  },
  {
    $limit: 1,
  },
]);
// (4);Вывести одного пользователя, с которым общались на тему кредита дольше всего
db.calls.aggregate([
  {
    $match: {
      topic: "credit",
    },
  },
  {
    $group: {
      _id: "$user_id",
      total_duration: { $sum: "$duration" },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "user_id",
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },
  {
    $sort: {
      total_duration: -1,
    },
  },
  {
    $limit: 1,
  },
  {
    $project: {
      _id: 0,
      name: "$user.name",
      communication_duration_hours: { $divide: ["$total_duration", 3600] },
    },
  },
]);
