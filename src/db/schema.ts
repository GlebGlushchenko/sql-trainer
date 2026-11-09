export const SCHEMA_SQL = `
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  department_id INTEGER REFERENCES departments(id),
  manager_id INTEGER REFERENCES employees(id),
  position TEXT,
  salary INTEGER,
  hire_date TEXT,
  city TEXT
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  city TEXT,
  country TEXT,
  registered_at TEXT
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER,
  stock INTEGER
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  employee_id INTEGER REFERENCES employees(id),
  order_date TEXT,
  status TEXT
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  unit_price INTEGER
);

INSERT INTO departments VALUES
(1,'Разработка','Москва'),
(2,'Продажи','Санкт-Петербург'),
(3,'Маркетинг','Москва'),
(4,'Бухгалтерия','Казань'),
(5,'HR','Москва'),
(6,'Поддержка','Новосибирск');

INSERT INTO employees VALUES
(1,'Иван','Петров','ivan.petrov@corp.ru',1,NULL,'CTO',250000,'2015-03-10','Москва'),
(2,'Мария','Иванова','maria.ivanova@corp.ru',1,1,'Senior Developer',180000,'2017-06-01','Москва'),
(3,'Алексей','Смирнов','alexey.smirnov@corp.ru',1,2,'Developer',120000,'2020-02-15','Москва'),
(4,'Ольга','Кузнецова','olga.k@corp.ru',1,2,'Developer',125000,'2019-09-23','Казань'),
(5,'Дмитрий','Попов','dmitry.popov@corp.ru',1,2,'Junior Developer',70000,'2023-01-09','Москва'),
(6,'Елена','Васильева','elena.v@corp.ru',2,NULL,'Head of Sales',200000,'2016-04-12','Санкт-Петербург'),
(7,'Сергей','Соколов','sergey.sokolov@corp.ru',2,6,'Sales Manager',95000,'2018-11-05','Санкт-Петербург'),
(8,'Анна','Михайлова','anna.m@corp.ru',2,6,'Sales Manager',98000,'2021-03-17','Москва'),
(9,'Николай','Новиков','nikolay.n@corp.ru',2,6,'Sales Manager',90000,'2022-07-01','Санкт-Петербург'),
(10,'Татьяна','Федорова','tatiana.f@corp.ru',3,NULL,'Head of Marketing',170000,'2017-01-20','Москва'),
(11,'Андрей','Морозов','andrey.morozov@corp.ru',3,10,'Marketer',85000,'2020-10-10','Москва'),
(12,'Наталья','Волкова','natalia.v@corp.ru',3,10,'Designer',175000,'2019-05-14','Казань'),
(13,'Павел','Алексеев','pavel.a@corp.ru',4,NULL,'Chief Accountant',150000,'2014-08-01','Казань'),
(14,'Ирина','Лебедева','irina.l@corp.ru',4,13,'Accountant',80000,'2021-12-01','Казань'),
(15,'Михаил','Семенов','mikhail.s@corp.ru',5,NULL,'HR Director',140000,'2018-02-28','Москва'),
(16,'Светлана','Егорова','svetlana.e@corp.ru',5,15,'Recruiter',75000,'2022-04-04','Москва'),
(17,'Артем','Павлов','artem.p@corp.ru',1,2,'Developer',130000,'2018-07-19','Новосибирск'),
(18,'Юлия','Козлова','yulia.k@corp.ru',2,6,'Sales Manager',92000,'2023-05-22','Новосибирск'),
(19,'Виктор','Степанов',NULL,NULL,NULL,'Intern',40000,'2024-01-15','Москва'),
(20,'Ксения','Николаева','ksenia.n@corp.ru',3,10,'Marketer',85000,'2023-09-01','Санкт-Петербург');

INSERT INTO customers VALUES
(1,'ООО Ромашка','romashka@mail.ru','Москва','Россия','2022-01-15'),
(2,'ИП Сидоров','sidorov@ya.ru','Санкт-Петербург','Россия','2022-03-02'),
(3,'ТехноСтрой','info@technostroy.ru','Казань','Россия','2022-05-20'),
(4,'Альфа Трейд','alfa@trade.kz','Алматы','Казахстан','2022-06-11'),
(5,'Бета Групп',NULL,'Минск','Беларусь','2022-08-30'),
(6,'Гамма Софт','hello@gammasoft.ru','Москва','Россия','2023-01-10'),
(7,'Дельта Логистик','delta@logistic.ru','Новосибирск','Россия','2023-02-14'),
(8,'Эпсилон','eps@mail.ru','Москва','Россия','2023-04-01'),
(9,'Зета Маркет','zeta@market.by','Минск','Беларусь','2023-06-18'),
(10,'Омега Плюс','omega@plus.kz','Астана','Казахстан','2023-09-09'),
(11,'Северный Ветер',NULL,'Санкт-Петербург','Россия','2024-01-20'),
(12,'Южный Берег','south@bereg.ru','Краснодар','Россия','2024-03-03'),
(13,'Восток Импорт','vostok@import.ru','Владивосток','Россия','2024-05-05'),
(14,'Запад Экспорт','zapad@export.ru','Калининград','Россия','2024-06-15'),
(15,'Кедр','kedr@ya.ru','Новосибирск','Россия','2024-08-01');

INSERT INTO products VALUES
(1,'Ноутбук Pro 15','Ноутбуки',120000,15),
(2,'Ноутбук Air 13','Ноутбуки',85000,25),
(3,'Смартфон X','Смартфоны',70000,40),
(4,'Смартфон Lite','Смартфоны',25000,60),
(5,'Планшет Tab 10','Планшеты',35000,30),
(6,'Монитор 27"','Мониторы',30000,20),
(7,'Монитор 24"','Мониторы',18000,35),
(8,'Клавиатура механическая','Аксессуары',7000,100),
(9,'Мышь беспроводная','Аксессуары',2500,150),
(10,'Наушники BT','Аксессуары',9000,80),
(11,'Веб-камера HD','Аксессуары',4500,0),
(12,'Принтер лазерный','Периферия',22000,10),
(13,'Сканер','Периферия',15000,0),
(14,'Роутер Wi-Fi 6','Сеть',8000,45),
(15,'Коммутатор 24 порта','Сеть',26000,5),
(16,'Внешний SSD 1TB','Накопители',11000,50);

INSERT INTO orders VALUES
(1,1,7,'2023-01-10','delivered'),
(2,2,8,'2023-01-25','delivered'),
(3,3,7,'2023-02-14','delivered'),
(4,1,9,'2023-03-03','delivered'),
(5,4,8,'2023-03-20','cancelled'),
(6,5,18,'2023-04-11','delivered'),
(7,6,7,'2023-05-05','delivered'),
(8,2,9,'2023-05-28','delivered'),
(9,7,8,'2023-06-17','delivered'),
(10,8,7,'2023-07-07','delivered'),
(11,1,6,'2023-08-19','delivered'),
(12,9,18,'2023-09-02','cancelled'),
(13,3,8,'2023-10-10','delivered'),
(14,10,9,'2023-11-11','delivered'),
(15,6,7,'2023-12-24','delivered'),
(16,1,8,'2024-01-15','delivered'),
(17,2,7,'2024-02-03','delivered'),
(18,11,18,'2024-02-20','delivered'),
(19,4,9,'2024-03-08','delivered'),
(20,12,8,'2024-04-01','delivered'),
(21,5,7,'2024-04-22','shipped'),
(22,6,9,'2024-05-30','delivered'),
(23,8,18,'2024-06-14','delivered'),
(24,1,7,'2024-07-01','shipped'),
(25,7,8,'2024-08-08','processing'),
(26,15,9,'2024-09-09','processing'),
(27,3,7,'2024-10-10','shipped'),
(28,9,8,'2024-11-11','processing'),
(29,2,6,'2024-12-01','processing'),
(30,12,18,'2024-12-20','cancelled');

INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1,1,2),(1,9,2),
(2,3,5),
(3,6,4),(3,8,4),(3,9,4),
(4,2,1),(4,10,2),
(5,1,3),
(6,4,10),
(7,1,1),(7,6,2),(7,8,1),
(8,5,3),
(9,14,6),(9,15,1),
(10,3,2),(10,10,2),
(11,12,1),(11,7,3),
(12,4,5),
(13,2,2),(13,9,5),
(14,3,1),
(15,1,2),(15,5,1),
(16,7,4),(16,8,4),
(17,4,3),(17,10,3),
(18,2,1),
(19,6,2),(19,14,2),
(20,12,1),(20,11,2),
(21,5,2),
(22,1,1),(22,3,1),(22,9,1),
(23,15,2),
(24,8,10),(24,9,10),
(25,3,3),
(26,4,2),(26,10,1),
(27,7,2),
(28,2,1),
(29,1,1),
(30,5,1);

UPDATE order_items SET unit_price = (SELECT price FROM products p WHERE p.id = order_items.product_id);
`;

export interface ColumnDoc {
  name: string;
  type: string;
  note?: string;
}

export interface TableDoc {
  name: string;
  description: string;
  columns: ColumnDoc[];
}

export const TABLES: TableDoc[] = [
  {
    name: 'departments',
    description: 'Отделы компании',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'name', type: 'TEXT', note: 'название отдела' },
      { name: 'location', type: 'TEXT', note: 'город офиса' },
    ],
  },
  {
    name: 'employees',
    description: 'Сотрудники',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'email', type: 'TEXT', note: 'может быть NULL' },
      { name: 'department_id', type: 'INTEGER', note: 'FK → departments.id, может быть NULL' },
      { name: 'manager_id', type: 'INTEGER', note: 'FK → employees.id (руководитель)' },
      { name: 'position', type: 'TEXT', note: 'должность' },
      { name: 'salary', type: 'INTEGER', note: 'зарплата в месяц' },
      { name: 'hire_date', type: 'TEXT', note: 'дата найма YYYY-MM-DD' },
      { name: 'city', type: 'TEXT' },
    ],
  },
  {
    name: 'customers',
    description: 'Клиенты (компании)',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'name', type: 'TEXT' },
      { name: 'email', type: 'TEXT', note: 'может быть NULL' },
      { name: 'city', type: 'TEXT' },
      { name: 'country', type: 'TEXT' },
      { name: 'registered_at', type: 'TEXT', note: 'дата регистрации' },
    ],
  },
  {
    name: 'products',
    description: 'Товары',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'name', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'price', type: 'INTEGER', note: 'цена за штуку' },
      { name: 'stock', type: 'INTEGER', note: 'остаток на складе' },
    ],
  },
  {
    name: 'orders',
    description: 'Заказы',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'customer_id', type: 'INTEGER', note: 'FK → customers.id' },
      { name: 'employee_id', type: 'INTEGER', note: 'FK → employees.id (менеджер)' },
      { name: 'order_date', type: 'TEXT', note: 'дата заказа' },
      { name: 'status', type: 'TEXT', note: "delivered | shipped | processing | cancelled" },
    ],
  },
  {
    name: 'order_items',
    description: 'Позиции заказов',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'order_id', type: 'INTEGER', note: 'FK → orders.id' },
      { name: 'product_id', type: 'INTEGER', note: 'FK → products.id' },
      { name: 'quantity', type: 'INTEGER', note: 'количество' },
      { name: 'unit_price', type: 'INTEGER', note: 'цена за штуку на момент заказа' },
    ],
  },
];

export const COMPLETION_SCHEMA: Record<string, string[]> = Object.fromEntries(
  TABLES.map((t) => [t.name, t.columns.map((c) => c.name)]),
);
