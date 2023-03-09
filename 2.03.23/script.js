// (1) найти ко-во завершенных транзакций не в евро на сумму более 100

db.transactions.count({
  currency: { $ne: "EUR" },
  status: "completed",
  amount: { $gt: 100 },
});

// (2) для всех пользователей не из Китая и не из Испании увеличить баланс на 20%

db.users.updateMany(
  {
    country: { $nin: ["China", "Spain"] },
  },
  {
    $mul: { balance: 1.2 },
  }
);

// (3) разблокировать пользователей, у которых баланс больше нуля или премиальный статус

db.users.updateMany(
  {
    $or: [{ balance: { $gt: 0 } }, { premium: true }],
  },
  {
    $set: { blocked: false },
  }
);

// (4) найти пользователей из Китая, которые заблокированы и имеют нулевой баланс

db.users.find({
  country: "China",
  blocked: true,
  balance: 0,
});

// (5) пользователям не из Китая и не из США, имеющим баланс более 5000, установить статус премиум

db.users.updateMany(
  {
    country: { $nin: ["China", "USA"] },
    balance: { $gt: 5000 },
  },
  {
    $set: { premium: true },
  }
);

// (6) Проанализируйте след/запросы

db.users.find({
  $nor: [{ country: "China" }, { balance: { $lt: 100 } }],
});

db.users.find({
  country: { $ne: "China" },
  balance: { $gte: 100 },
});

// Первый запрос ищет количество завершенных транзакций, не в евро и на сумму более 100. Он использует метод count для возврата количества найденных документов.

// Второй запрос использует метод updateMany, чтобы увеличить баланс всех пользователей, не из Китая и не из Испании, на 20%. Он использует оператор $mul, который умножает значение поля balance на 1.2.

// Третий запрос также использует метод updateMany, чтобы изменить поле blocked всех пользователей с балансом больше 0 или премиальным статусом на false.

// Четвертый запрос использует метод find, чтобы найти всех заблокированных пользователей из Китая с нулевым балансом.

// Пятый запрос использует метод updateMany, чтобы установить статус премиум для всех пользователей, не из Китая и не из США, с балансом более 5000.

// Общая тема запросов - изменение или поиск документов в коллекции пользователей и транзакций на основе различных условий, используя различные методы MongoDB.
