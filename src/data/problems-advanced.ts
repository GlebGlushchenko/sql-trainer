import type { ProblemInput } from './types';

export const ADVANCED_PROBLEMS: ProblemInput[] = [
  // ───────────── Подзапросы ─────────────
  {
    title: 'Выше средней зарплаты',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Выведите имя, фамилию и зарплату сотрудников, получающих больше средней зарплаты по компании.',
    hints: ['Средняя зарплата считается скалярным подзапросом: `(SELECT AVG(salary) FROM employees)`.'],
    solution: `SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);`,
  },
  {
    title: 'Самый дорогой товар',
    difficulty: 'easy',
    topic: 'Подзапросы',
    description: 'Выведите название и цену товара с максимальной ценой, используя подзапрос.',
    hints: ['`WHERE price = (SELECT MAX(price) FROM products)`'],
    solution: `SELECT name, price FROM products WHERE price = (SELECT MAX(price) FROM products);`,
  },
  {
    title: 'Сотрудники московских отделов',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Выведите имя и фамилию сотрудников, отделы которых расположены (`departments.location`) в Москве. Решите через `IN` с подзапросом.',
    hints: ["`department_id IN (SELECT id FROM departments WHERE location = 'Москва')`"],
    solution: `SELECT first_name, last_name FROM employees WHERE department_id IN (SELECT id FROM departments WHERE location = 'Москва');`,
  },
  {
    title: 'Клиенты с заказами (EXISTS)',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Выведите названия клиентов, у которых есть хотя бы один заказ. Используйте `EXISTS`.',
    hints: ['Коррелированный подзапрос ссылается на внешнюю таблицу: `WHERE o.customer_id = c.id`.'],
    solution: `SELECT c.name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`,
  },
  {
    title: 'Дороже среднего по категории',
    difficulty: 'hard',
    topic: 'Подзапросы',
    description: 'Выведите название, категорию и цену товаров, цена которых выше средней цены **в их категории**.',
    hints: ['Коррелированный подзапрос: средняя цена считается для категории текущей строки.', '`(SELECT AVG(p2.price) FROM products p2 WHERE p2.category = p.category)`'],
    solution: `SELECT p.name, p.category, p.price FROM products p WHERE p.price > (SELECT AVG(p2.price) FROM products p2 WHERE p2.category = p.category);`,
  },
  {
    title: 'Лучшие в отделе',
    difficulty: 'hard',
    topic: 'Подзапросы',
    description: 'Для каждого отдела выведите `department_id`, имя, фамилию и зарплату сотрудника с максимальной зарплатой в этом отделе. Сотрудники без отдела не учитываются.',
    hints: ['Сравните зарплату с MAX по тому же отделу через коррелированный подзапрос.'],
    solution: `SELECT e.department_id, e.first_name, e.last_name, e.salary
FROM employees e
WHERE e.department_id IS NOT NULL
  AND e.salary = (SELECT MAX(e2.salary) FROM employees e2 WHERE e2.department_id = e.department_id);`,
  },
  {
    title: 'Вторая по величине зарплата',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Выведите вторую по величине **уникальную** зарплату в компании (одно число).',
    hints: ['Максимум среди зарплат, меньших максимальной.'],
    solution: `SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);`,
  },
  {
    title: 'Самый активный клиент',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Выведите название клиента и количество его заказов для клиента с наибольшим количеством заказов.',
    hints: ['Сгруппируйте, отсортируйте по количеству по убыванию и возьмите первую строку.'],
    solution: `SELECT c.name, COUNT(*) AS cnt FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name ORDER BY cnt DESC LIMIT 1;`,
  },
  {
    title: 'Средний чек',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Посчитайте среднюю сумму заказа по всем заказам (округлить до 2 знаков). Сумма заказа = сумма `quantity * unit_price` его позиций.',
    hints: ['Сначала подзапросом в FROM посчитайте сумму каждого заказа, потом AVG по нему.'],
    solution: `SELECT ROUND(AVG(total), 2) FROM (SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id) t;`,
  },
  {
    title: 'Заказы с ноутбуками',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: "Выведите `id` заказов (без повторов), в которых есть хотя бы один товар категории «Ноутбуки».",
    hints: ['`order_id` из order_items, где `product_id IN (SELECT id FROM products WHERE ...)`.'],
    solution: `SELECT DISTINCT order_id FROM order_items WHERE product_id IN (SELECT id FROM products WHERE category = 'Ноутбуки');`,
  },
  {
    title: 'Без отмен',
    difficulty: 'medium',
    topic: 'Подзапросы',
    description: 'Выведите названия клиентов, которые делали заказы, но **ни разу** не отменяли заказ.',
    hints: ['Два условия: `id IN (...)` и `id NOT IN (... cancelled ...)`.'],
    solution: `SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders)
  AND id NOT IN (SELECT customer_id FROM orders WHERE status = 'cancelled');`,
  },
  {
    title: 'Все заказы доставлены',
    difficulty: 'hard',
    topic: 'Подзапросы',
    description: "Выведите названия клиентов, у которых есть заказы и **все** их заказы имеют статус `'delivered'`.",
    hints: ['Используйте `NOT EXISTS` для заказов в другом статусе.', 'Не забудьте исключить клиентов без заказов.'],
    solution: `SELECT c.name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status <> 'delivered');`,
  },

  // ───────────── Строки и даты ─────────────
  {
    title: 'Длина названий',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: 'Выведите название товара и количество символов в нём.',
    hints: ['`LENGTH(name)`'],
    solution: `SELECT name, LENGTH(name) FROM products;`,
  },
  {
    title: 'Email заглавными',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: 'Для клиентов с указанным email выведите название и email в верхнем регистре.',
    hints: ['`UPPER(email)`'],
    solution: `SELECT name, UPPER(email) FROM customers WHERE email IS NOT NULL;`,
  },
  {
    title: 'Домен почты',
    difficulty: 'medium',
    topic: 'Строки и даты',
    description: 'Для клиентов с email выведите название и домен почты — часть после `@` (например `mail.ru`).',
    hints: ["`INSTR(email, '@')` возвращает позицию символа.", '`SUBSTR(строка, начало)` — подстрока до конца.'],
    solution: `SELECT name, SUBSTR(email, INSTR(email, '@') + 1) FROM customers WHERE email IS NOT NULL;`,
  },
  {
    title: 'Инициалы',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: 'Выведите для каждого сотрудника строку вида `И. Петров` (первая буква имени, точка, пробел, фамилия).',
    hints: ['`SUBSTR(first_name, 1, 1)` — первый символ.'],
    solution: `SELECT SUBSTR(first_name, 1, 1) || '. ' || last_name FROM employees;`,
  },
  {
    title: 'Год найма',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: 'Выведите имя, фамилию и год найма сотрудника (числом).',
    hints: ["`CAST(strftime('%Y', hire_date) AS INTEGER)`"],
    solution: `SELECT first_name, last_name, CAST(strftime('%Y', hire_date) AS INTEGER) FROM employees;`,
  },
  {
    title: 'Нанятые в 2023',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: 'Выведите имя, фамилию и дату найма сотрудников, нанятых в 2023 году.',
    hints: ["`strftime('%Y', hire_date) = '2023'`"],
    solution: `SELECT first_name, last_name, hire_date FROM employees WHERE strftime('%Y', hire_date) = '2023';`,
  },
  {
    title: 'Стаж в днях',
    difficulty: 'medium',
    topic: 'Строки и даты',
    description: "Выведите имя, фамилию и стаж сотрудника в полных днях на дату `'2025-01-01'`.",
    hints: ['`julianday()` переводит дату в число дней.', 'Разницу приведите к целому: `CAST(... AS INTEGER)`.'],
    solution: `SELECT first_name, last_name, CAST(julianday('2025-01-01') - julianday(hire_date) AS INTEGER) FROM employees;`,
  },
  {
    title: 'Заказы в выходные',
    difficulty: 'medium',
    topic: 'Строки и даты',
    description: 'Выведите `id` и дату заказов, сделанных в субботу или воскресенье.',
    hints: ["`strftime('%w', дата)` — день недели: '0' = воскресенье, '6' = суббота."],
    solution: `SELECT id, order_date FROM orders WHERE strftime('%w', order_date) IN ('0', '6');`,
  },
  {
    title: 'Замена в строке',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: "Для товаров категории «Ноутбуки» выведите название, в котором слово `Ноутбук` заменено на `Laptop`.",
    hints: ["`REPLACE(name, 'Ноутбук', 'Laptop')`"],
    solution: `SELECT REPLACE(name, 'Ноутбук', 'Laptop') FROM products WHERE category = 'Ноутбуки';`,
  },
  {
    title: 'Значение по умолчанию',
    difficulty: 'easy',
    topic: 'Строки и даты',
    description: "Выведите название клиента и email, а если email не указан — строку `'нет email'`.",
    hints: ['`COALESCE(a, b)` возвращает первый не-NULL аргумент.'],
    solution: `SELECT name, COALESCE(email, 'нет email') FROM customers;`,
  },
  {
    title: 'Регистрации по месяцам',
    difficulty: 'medium',
    topic: 'Строки и даты',
    description: "Выведите месяц регистрации в формате `'YYYY-MM'` и количество клиентов, зарегистрированных в нём. Отсортируйте по месяцу.",
    hints: ["`strftime('%Y-%m', registered_at)`"],
    solution: `SELECT strftime('%Y-%m', registered_at) AS month, COUNT(*) FROM customers GROUP BY month ORDER BY month;`,
    ordered: true,
  },

  // ───────────── CASE ─────────────
  {
    title: 'Уровень зарплаты',
    difficulty: 'easy',
    topic: 'CASE',
    description: "Выведите имя, фамилию и уровень зарплаты: `'высокая'` (от 150 000), `'средняя'` (от 90 000) или `'низкая'`.",
    hints: ['`CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END`', 'Условия проверяются сверху вниз.'],
    solution: `SELECT first_name, last_name,
  CASE WHEN salary >= 150000 THEN 'высокая'
       WHEN salary >= 90000 THEN 'средняя'
       ELSE 'низкая' END
FROM employees;`,
  },
  {
    title: 'Статус наличия',
    difficulty: 'easy',
    topic: 'CASE',
    description: "Выведите название товара и статус: `'нет в наличии'` (stock = 0), `'мало'` (меньше 20) или `'в наличии'`.",
    hints: ['Используйте CASE WHEN.'],
    solution: `SELECT name,
  CASE WHEN stock = 0 THEN 'нет в наличии'
       WHEN stock < 20 THEN 'мало'
       ELSE 'в наличии' END
FROM products;`,
  },
  {
    title: 'Статусы по-русски',
    difficulty: 'easy',
    topic: 'CASE',
    description: "Выведите `id` заказа и статус на русском: delivered → `'доставлен'`, shipped → `'отправлен'`, processing → `'в обработке'`, cancelled → `'отменён'`.",
    hints: ['Простая форма: `CASE status WHEN ... THEN ... END`.'],
    solution: `SELECT id,
  CASE status
    WHEN 'delivered' THEN 'доставлен'
    WHEN 'shipped' THEN 'отправлен'
    WHEN 'processing' THEN 'в обработке'
    WHEN 'cancelled' THEN 'отменён'
  END
FROM orders;`,
  },
  {
    title: 'Условная агрегация',
    difficulty: 'medium',
    topic: 'CASE',
    description: 'Выведите в одной строке два числа: количество доставленных и количество отменённых заказов.',
    hints: ["`SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)`"],
    solution: `SELECT SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END),
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)
FROM orders;`,
  },
  {
    title: 'Сводка по годам',
    difficulty: 'medium',
    topic: 'CASE',
    description: 'Для каждого года выведите: год, общее число заказов и число отменённых заказов. Отсортируйте по году.',
    hints: ['GROUP BY по году + SUM(CASE ...).'],
    solution: `SELECT strftime('%Y', order_date) AS year, COUNT(*),
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)
FROM orders GROUP BY year ORDER BY year;`,
    ordered: true,
  },
  {
    title: 'Процент отмен',
    difficulty: 'medium',
    topic: 'CASE',
    description: 'Посчитайте долю отменённых заказов в процентах от всех заказов, округлив до 2 знаков.',
    hints: ['Умножайте на `100.0`, чтобы избежать целочисленного деления.'],
    solution: `SELECT ROUND(100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 2) FROM orders;`,
  },

  // ───────────── Оконные функции ─────────────
  {
    title: 'Нумерация по зарплате',
    difficulty: 'medium',
    topic: 'Оконные функции',
    description: 'Выведите номер строки (`rn`), имя, фамилию и зарплату. Нумерация — по убыванию зарплаты, при равенстве — по `id`. Отсортируйте по `rn`.',
    hints: ['`ROW_NUMBER() OVER (ORDER BY salary DESC, id)`'],
    solution: `SELECT ROW_NUMBER() OVER (ORDER BY salary DESC, id) AS rn, first_name, last_name, salary FROM employees ORDER BY rn;`,
    ordered: true,
  },
  {
    title: 'Плотный ранг зарплат',
    difficulty: 'medium',
    topic: 'Оконные функции',
    description: 'Выведите имя, фамилию, зарплату и плотный ранг зарплаты (одинаковые зарплаты — одинаковый ранг, без пропусков; самая высокая — ранг 1).',
    hints: ['`DENSE_RANK() OVER (ORDER BY salary DESC)`'],
    solution: `SELECT first_name, last_name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) FROM employees;`,
  },
  {
    title: 'Ранг внутри отдела',
    difficulty: 'medium',
    topic: 'Оконные функции',
    description: 'Для сотрудников с отделом выведите `department_id`, имя, фамилию, зарплату и `RANK` зарплаты внутри своего отдела (1 — самая высокая).',
    hints: ['`PARTITION BY department_id` разбивает строки на группы.'],
    solution: `SELECT department_id, first_name, last_name, salary,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)
FROM employees WHERE department_id IS NOT NULL;`,
  },
  {
    title: 'Топ-2 в каждом отделе',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Выведите `department_id`, имя, фамилию и зарплату двух самых высокооплачиваемых сотрудников каждого отдела (сотрудники без отдела не учитываются).',
    hints: ['Оконную функцию нельзя использовать в WHERE напрямую.', 'Посчитайте ROW_NUMBER в подзапросе/CTE, а затем отфильтруйте `rn <= 2`.'],
    solution: `SELECT department_id, first_name, last_name, salary FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM employees WHERE department_id IS NOT NULL
) t WHERE rn <= 2;`,
  },
  {
    title: 'Накопительная выручка',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Для неотменённых заказов выведите `id`, дату, сумму заказа и накопительную сумму выручки (`running_total`) в хронологическом порядке. Отсортируйте по дате.',
    hints: ['Сначала посчитайте сумму каждого заказа.', '`SUM(total) OVER (ORDER BY order_date)` — накопительный итог.'],
    solution: `WITH t AS (
  SELECT o.id, o.order_date, SUM(oi.quantity * oi.unit_price) AS total
  FROM orders o JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY o.id, o.order_date
)
SELECT id, order_date, total, SUM(total) OVER (ORDER BY order_date) AS running_total
FROM t ORDER BY order_date;`,
    ordered: true,
  },
  {
    title: 'Предыдущий заказ',
    difficulty: 'medium',
    topic: 'Оконные функции',
    description: 'Выведите `id`, дату заказа и дату предыдущего заказа (по всей таблице, в хронологическом порядке). Отсортируйте по дате.',
    hints: ['`LAG(order_date) OVER (ORDER BY order_date)`'],
    solution: `SELECT id, order_date, LAG(order_date) OVER (ORDER BY order_date) FROM orders ORDER BY order_date;`,
    ordered: true,
  },
  {
    title: 'Дней между заказами клиента',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Для каждого заказа выведите `customer_id`, `id`, дату и количество дней с предыдущего заказа **этого же клиента** (целое число; NULL для первого заказа).',
    hints: ['LAG с `PARTITION BY customer_id`.', 'Разницу дат считайте через julianday и приведите к INTEGER.'],
    solution: `SELECT customer_id, id, order_date,
  CAST(julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS INTEGER)
FROM orders;`,
  },
  {
    title: 'Доля в фонде отдела',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Для сотрудников с отделом выведите `department_id`, имя, фамилию и долю их зарплаты в суммарном фонде оплаты отдела в процентах (округлить до 2 знаков).',
    hints: ['`SUM(salary) OVER (PARTITION BY department_id)` — фонд отдела в каждой строке.'],
    solution: `SELECT department_id, first_name, last_name,
  ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY department_id), 2)
FROM employees WHERE department_id IS NOT NULL;`,
  },
  {
    title: 'Отклонение от среднего',
    difficulty: 'medium',
    topic: 'Оконные функции',
    description: 'Для сотрудников с отделом выведите имя, фамилию, зарплату и разницу между зарплатой и средней зарплатой по отделу (округлить до 2 знаков).',
    hints: ['`AVG(salary) OVER (PARTITION BY department_id)`'],
    solution: `SELECT first_name, last_name, salary,
  ROUND(salary - AVG(salary) OVER (PARTITION BY department_id), 2)
FROM employees WHERE department_id IS NOT NULL;`,
  },
  {
    title: 'Первый заказ клиента',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Для каждого клиента выведите `customer_id`, `id` и дату его самого первого заказа.',
    hints: ['ROW_NUMBER по клиенту в порядке даты и фильтр `rn = 1`.'],
    solution: `SELECT customer_id, id, order_date FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn FROM orders
) t WHERE rn = 1;`,
  },
  {
    title: 'Ценовые группы',
    difficulty: 'medium',
    topic: 'Оконные функции',
    description: 'Разбейте товары на 4 ценовые группы (1 — самые дорогие). Выведите название, цену и номер группы.',
    hints: ['`NTILE(4) OVER (ORDER BY price DESC)`'],
    solution: `SELECT name, price, NTILE(4) OVER (ORDER BY price DESC) FROM products;`,
  },
  {
    title: 'Скользящее среднее',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Для неотменённых заказов в хронологическом порядке выведите `id`, сумму заказа и скользящее среднее сумм по текущему и двум предыдущим заказам (округлить до 2 знаков). Отсортируйте по дате.',
    hints: ['Рамка окна: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`.'],
    solution: `WITH t AS (
  SELECT o.id, o.order_date, SUM(oi.quantity * oi.unit_price) AS total
  FROM orders o JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY o.id, o.order_date
)
SELECT id, total, ROUND(AVG(total) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2)
FROM t ORDER BY order_date;`,
    ordered: true,
  },
  {
    title: 'Медиана зарплаты',
    difficulty: 'hard',
    topic: 'Оконные функции',
    description: 'Посчитайте медиану зарплаты сотрудников (для чётного количества — среднее двух центральных значений). В SQLite нет функции MEDIAN.',
    hints: ['Пронумеруйте зарплаты через ROW_NUMBER и посчитайте общее количество `COUNT(*) OVER ()`.', 'Центральные позиции: `(cnt + 1) / 2` и `(cnt + 2) / 2` (целочисленное деление).'],
    solution: `SELECT AVG(salary) FROM (
  SELECT salary, ROW_NUMBER() OVER (ORDER BY salary) AS rn, COUNT(*) OVER () AS cnt FROM employees
) t WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2);`,
  },

  // ───────────── CTE ─────────────
  {
    title: 'Фонд оплаты выше среднего',
    difficulty: 'hard',
    topic: 'CTE',
    description: 'С помощью `WITH` посчитайте фонд оплаты труда (сумму зарплат) каждого отдела и выведите `department_id` и фонд для отделов, где он выше среднего фонда по отделам. Сотрудники без отдела не учитываются.',
    hints: ['`WITH dept AS (SELECT department_id, SUM(salary) AS total ...)`', 'Затем сравните total с `(SELECT AVG(total) FROM dept)`.'],
    solution: `WITH dept AS (
  SELECT department_id, SUM(salary) AS total FROM employees
  WHERE department_id IS NOT NULL GROUP BY department_id
)
SELECT department_id, total FROM dept WHERE total > (SELECT AVG(total) FROM dept);`,
  },
  {
    title: 'Числа от 1 до 10',
    difficulty: 'medium',
    topic: 'CTE',
    description: 'С помощью рекурсивного CTE выведите числа от 1 до 10 по возрастанию.',
    hints: ['`WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM n WHERE x < 10)`'],
    solution: `WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM n WHERE x < 10) SELECT x FROM n;`,
    ordered: true,
  },
  {
    title: 'Все подчинённые CTO',
    difficulty: 'hard',
    topic: 'CTE',
    description: 'Выведите имя, фамилию и уровень подчинения (`level`: 1 — прямые подчинённые) всех прямых и косвенных подчинённых сотрудника с `id = 1`.',
    hints: ['Якорь рекурсии — сотрудники с `manager_id = 1` и level 1.', 'Рекурсивная часть присоединяет сотрудников, чей manager_id есть в предыдущем уровне.'],
    solution: `WITH RECURSIVE sub AS (
  SELECT id, first_name, last_name, 1 AS level FROM employees WHERE manager_id = 1
  UNION ALL
  SELECT e.id, e.first_name, e.last_name, s.level + 1 FROM employees e JOIN sub s ON e.manager_id = s.id
)
SELECT first_name, last_name, level FROM sub;`,
  },
  {
    title: 'Календарь регистраций 2024',
    difficulty: 'hard',
    topic: 'CTE',
    description: 'Выведите номер месяца (1–12, числом) и количество клиентов, зарегистрированных в этом месяце 2024 года. Должны быть **все 12 месяцев**, включая месяцы с нулём. Отсортируйте по месяцу.',
    hints: ['Сгенерируйте месяцы 1..12 рекурсивным CTE.', 'LEFT JOIN клиентов по условию на месяц и год, затем COUNT(c.id).'],
    solution: `WITH RECURSIVE m(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM m WHERE n < 12)
SELECT n, COUNT(c.id)
FROM m LEFT JOIN customers c
  ON CAST(strftime('%m', c.registered_at) AS INTEGER) = n
 AND strftime('%Y', c.registered_at) = '2024'
GROUP BY n ORDER BY n;`,
    ordered: true,
  },
  {
    title: 'Хит продаж в категории',
    difficulty: 'hard',
    topic: 'CTE',
    description: 'Для каждой категории выведите категорию, название самого продаваемого товара (по количеству единиц) и это количество. Отменённые заказы не учитываются; категории без продаж не выводятся.',
    hints: ['CTE 1: количество продаж каждого товара.', 'CTE 2: ROW_NUMBER по категории в порядке убывания количества, затем `rn = 1`.'],
    solution: `WITH sales AS (
  SELECT p.category, p.name, SUM(oi.quantity) AS qty
  FROM order_items oi
  JOIN products p ON p.id = oi.product_id
  JOIN orders o ON o.id = oi.order_id
  WHERE o.status <> 'cancelled'
  GROUP BY p.id, p.category, p.name
), ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY qty DESC) AS rn FROM sales
)
SELECT category, name, qty FROM ranked WHERE rn = 1;`,
  },
  {
    title: 'Рост выручки по годам',
    difficulty: 'hard',
    topic: 'CTE',
    description: 'Для неотменённых заказов выведите год, выручку за год и выручку за предыдущий год (NULL для первого года). Отсортируйте по году.',
    hints: ['CTE с выручкой по годам + `LAG(revenue) OVER (ORDER BY year)`.'],
    solution: `WITH y AS (
  SELECT strftime('%Y', o.order_date) AS year, SUM(oi.quantity * oi.unit_price) AS revenue
  FROM orders o JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status <> 'cancelled'
  GROUP BY year
)
SELECT year, revenue, LAG(revenue) OVER (ORDER BY year) FROM y ORDER BY year;`,
    ordered: true,
  },
  {
    title: 'Лояльные клиенты',
    difficulty: 'medium',
    topic: 'CTE',
    description: 'Выведите названия клиентов, которые делали заказы (в любом статусе) и в 2023, и в 2024 году.',
    hints: ['Можно через два IN, через INTERSECT или через GROUP BY + HAVING COUNT(DISTINCT год) = 2.'],
    solution: `SELECT name FROM customers WHERE id IN (
  SELECT customer_id FROM orders WHERE strftime('%Y', order_date) = '2023'
  INTERSECT
  SELECT customer_id FROM orders WHERE strftime('%Y', order_date) = '2024'
);`,
  },

  // ───────────── Операции над множествами ─────────────
  {
    title: 'Все города',
    difficulty: 'easy',
    topic: 'Множества',
    description: 'Выведите без повторов все города, где есть сотрудники **или** клиенты.',
    hints: ['`UNION` объединяет результаты и убирает дубликаты.'],
    solution: `SELECT city FROM employees UNION SELECT city FROM customers;`,
  },
  {
    title: 'Общие города',
    difficulty: 'medium',
    topic: 'Множества',
    description: 'Выведите города, где есть **и** сотрудники, **и** клиенты.',
    hints: ['`INTERSECT` — пересечение результатов.'],
    solution: `SELECT city FROM employees INTERSECT SELECT city FROM customers;`,
  },
  {
    title: 'Города без офиса',
    difficulty: 'medium',
    topic: 'Множества',
    description: 'Выведите города клиентов, в которых нет ни одного сотрудника.',
    hints: ['`EXCEPT` — разность множеств.'],
    solution: `SELECT city FROM customers EXCEPT SELECT city FROM employees;`,
  },
  {
    title: 'Единая книга контактов',
    difficulty: 'medium',
    topic: 'Множества',
    description: "Выведите три столбца: имя контакта, email и тип (`'клиент'` или `'сотрудник'`). Для сотрудников имя — `first_name || ' ' || last_name`. Только контакты с email.",
    hints: ['`UNION ALL` не убирает дубликаты и работает быстрее.', 'Количество и порядок столбцов в обеих частях должны совпадать.'],
    solution: `SELECT name, email, 'клиент' FROM customers WHERE email IS NOT NULL
UNION ALL
SELECT first_name || ' ' || last_name, email, 'сотрудник' FROM employees WHERE email IS NOT NULL;`,
  },

  // ───────────── Изменение данных ─────────────
  {
    title: 'Новый отдел (INSERT)',
    difficulty: 'easy',
    topic: 'Изменение данных',
    description: "Добавьте отдел с `id = 7`, названием `'Аналитика'` и расположением `'Москва'`.\n\nПроверка выполнит `SELECT * FROM departments ORDER BY id`.",
    hints: ["`INSERT INTO departments (id, name, location) VALUES (...);`"],
    solution: `INSERT INTO departments (id, name, location) VALUES (7, 'Аналитика', 'Москва');`,
    check: `SELECT * FROM departments ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Индексация зарплат (UPDATE)',
    difficulty: 'easy',
    topic: 'Изменение данных',
    description: 'Повысьте зарплату всем сотрудникам отдела с `department_id = 1` на 10%.\n\nПроверка выполнит `SELECT id, salary FROM employees ORDER BY id`.',
    hints: ['`UPDATE employees SET salary = salary * 1.1 WHERE ...`'],
    solution: `UPDATE employees SET salary = salary * 1.1 WHERE department_id = 1;`,
    check: `SELECT id, salary FROM employees ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Удалить отсутствующие товары (DELETE)',
    difficulty: 'easy',
    topic: 'Изменение данных',
    description: 'Удалите из таблицы `products` все товары с нулевым остатком.\n\nПроверка выполнит `SELECT id FROM products ORDER BY id`.',
    hints: ['`DELETE FROM products WHERE ...` — без WHERE удалится всё!'],
    solution: `DELETE FROM products WHERE stock = 0;`,
    check: `SELECT id FROM products ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Отмена зависших заказов',
    difficulty: 'easy',
    topic: 'Изменение данных',
    description: "Переведите в статус `'cancelled'` все заказы в статусе `'processing'`, сделанные до `'2024-10-01'`.\n\nПроверка выполнит `SELECT id, status FROM orders ORDER BY id`.",
    hints: ['Два условия в WHERE через AND.'],
    solution: `UPDATE orders SET status = 'cancelled' WHERE status = 'processing' AND order_date < '2024-10-01';`,
    check: `SELECT id, status FROM orders ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Удалить неактивных клиентов',
    difficulty: 'medium',
    topic: 'Изменение данных',
    description: 'Удалите клиентов, у которых нет ни одного заказа.\n\nПроверка выполнит `SELECT id FROM customers ORDER BY id`.',
    hints: ['`DELETE ... WHERE id NOT IN (SELECT customer_id FROM orders)`'],
    solution: `DELETE FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);`,
    check: `SELECT id FROM customers ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Списание остатков',
    difficulty: 'hard',
    topic: 'Изменение данных',
    description: "Уменьшите остаток (`stock`) каждого товара на количество единиц в заказах со статусом `'processing'`. Товары без таких заказов не меняются.\n\nПроверка выполнит `SELECT id, stock FROM products ORDER BY id`.",
    hints: ['UPDATE с коррелированным подзапросом в SET.', 'Ограничьте обновляемые строки через `WHERE id IN (...)`, иначе получите NULL.'],
    solution: `UPDATE products SET stock = stock - (
  SELECT SUM(oi.quantity) FROM order_items oi JOIN orders o ON o.id = oi.order_id
  WHERE o.status = 'processing' AND oi.product_id = products.id
)
WHERE id IN (
  SELECT oi.product_id FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.status = 'processing'
);`,
    check: `SELECT id, stock FROM products ORDER BY id;`,
    ordered: true,
  },

  // ───────────── DDL ─────────────
  {
    title: 'Таблица поставщиков',
    difficulty: 'medium',
    topic: 'DDL',
    description: "Создайте таблицу `suppliers` со столбцами `id INTEGER PRIMARY KEY`, `name TEXT NOT NULL`, `country TEXT` и добавьте две записи: `(1, 'Поставщик А', 'Китай')` и `(2, 'Поставщик Б', 'Россия')`.\n\nПроверка выполнит `SELECT * FROM suppliers ORDER BY id`.",
    hints: ['`CREATE TABLE suppliers (...);` затем `INSERT INTO ...`', 'Несколько запросов разделяются `;`.'],
    solution: `CREATE TABLE suppliers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, country TEXT);
INSERT INTO suppliers VALUES (1, 'Поставщик А', 'Китай'), (2, 'Поставщик Б', 'Россия');`,
    check: `SELECT * FROM suppliers ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Новая колонка скидки',
    difficulty: 'medium',
    topic: 'DDL',
    description: "Добавьте в `products` колонку `discount INTEGER DEFAULT 0` и установите скидку 10 для всех товаров категории «Аксессуары».\n\nПроверка выполнит `SELECT id, discount FROM products ORDER BY id`.",
    hints: ['`ALTER TABLE products ADD COLUMN ...`', 'Затем UPDATE.'],
    solution: `ALTER TABLE products ADD COLUMN discount INTEGER DEFAULT 0;
UPDATE products SET discount = 10 WHERE category = 'Аксессуары';`,
    check: `SELECT id, discount FROM products ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Представление активных заказов',
    difficulty: 'medium',
    topic: 'DDL',
    description: "Создайте представление `active_orders`, содержащее все столбцы заказов в статусах `'shipped'` и `'processing'`.\n\nПроверка выполнит `SELECT * FROM active_orders ORDER BY id`.",
    hints: ['`CREATE VIEW имя AS SELECT ...`'],
    solution: `CREATE VIEW active_orders AS SELECT * FROM orders WHERE status IN ('shipped', 'processing');`,
    check: `SELECT * FROM active_orders ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'VIP-клиенты (INSERT ... SELECT)',
    difficulty: 'hard',
    topic: 'DDL',
    description: "Создайте таблицу `vip_customers (id INTEGER PRIMARY KEY, name TEXT)` и заполните её клиентами, у которых сумма **доставленных** заказов больше 300 000.\n\nПроверка выполнит `SELECT * FROM vip_customers ORDER BY id`.",
    hints: ['`INSERT INTO vip_customers (id, name) SELECT ...` — вставка результата запроса.', 'GROUP BY клиенту + HAVING по сумме.'],
    solution: `CREATE TABLE vip_customers (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO vip_customers (id, name)
SELECT c.id, c.name FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.name
HAVING SUM(oi.quantity * oi.unit_price) > 300000;`,
    check: `SELECT * FROM vip_customers ORDER BY id;`,
    ordered: true,
  },
  {
    title: 'Индекс для поиска',
    difficulty: 'easy',
    topic: 'DDL',
    description: "Создайте индекс `idx_orders_customer` на столбец `customer_id` таблицы `orders`.\n\nПроверка выполнит `SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_orders_customer'`.",
    hints: ['`CREATE INDEX имя ON таблица (столбец);`'],
    solution: `CREATE INDEX idx_orders_customer ON orders (customer_id);`,
    check: `SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_orders_customer';`,
  },
];
