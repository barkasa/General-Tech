// В рамках БД 'platform_fe' напишите следующие запросы:

// (1) Вывести ТОП-1 стран по общей сумме пожертвований (страна + общая сумма).
db.donations.aggregate([
  { $group: { _id: "$country", totalDonation: { $sum: "$amount" } } },
  { $sort: { totalDonation: -1 } },
  { $limit: 1 },
  { $project: { _id: 0, country: "$_id", totalDonation: 1 } },
]);

// (2) Вывести страны со средней реакцией пользователей (напр., пользователи из США имеют сред.реакцию - 4).
db.reactions.aggregate([
  { $group: { _id: "$country", avgReaction: { $avg: "$reactionValue" } } },
  { $project: { _id: 0, country: "$_id", avgReaction: 1 } },
]);

// (3) Вывести названия стримов без пожертвований или без реакций.
db.streams.find(
  {
    $or: [{ donationCount: { $eq: 0 } }, { reactionCount: { $eq: 0 } }],
  },
  { streamName: 1 }
);

// (4) Вывести максимальный размер пожертвования для каждого стримера.
db.donations.aggregate([
  { $group: { _id: "$streamerId", maxDonation: { $max: "$amount" } } },
  {
    $lookup: {
      from: "streamers",
      localField: "_id",
      foreignField: "_id",
      as: "streamer",
    },
  },
  {
    $project: {
      _id: 0,
      streamerName: { $arrayElemAt: ["$streamer.streamerName", 0] },
      maxDonation: 1,
    },
  },
]);

// (5) Вывести ТОП-3 пожертвований из Германии (имя донатора и размер пожертвования).
db.donations.aggregate([
  { $match: { country: "Germany" } },
  { $sort: { amount: -1 } },
  { $limit: 3 },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $project: {
      _id: 0,
      donorName: { $arrayElemAt: ["$user.name", 0] },
      donationAmount: "$amount",
    },
  },
]);
