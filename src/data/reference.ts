export interface RefItem {
  title: string;
  body: string;
  code?: string;
}

export interface RefSection {
  id: string;
  title: string;
  icon: string;
  intro?: string;
  items: RefItem[];
}

export const REFERENCE: RefSection[] = [
  {
    id: 'basics',
    title: 'Основы SELECT',
    icon: '📋',
    intro: 'SELECT — основной оператор чтения данных. Он не меняет таблицы, а только возвращает результат.',
    items: [
      { title: 'Выбрать все столбцы', body: '`*` — все столбцы таблицы. В реальных проектах лучше перечислять нужные столбцы явно.', code: 'SELECT * FROM employees;' },
      { title: 'Выбрать конкретные столбцы', body: 'Столбцы перечисляются через запятую в нужном порядке.', code: 'SELECT first_name, last_name, salary\nFROM employees;' },
      { title: 'Псевдонимы (AS)', body: 'Переименовывают столбец в результате или задают короткое имя таблице.', code: 'SELECT e.first_name AS name, e.salary * 12 AS year_salary\nFROM employees AS e;' },
      { title: 'DISTINCT', body: 'Убирает повторяющиеся строки из результата.', code: 'SELECT DISTINCT city FROM employees;' },
      { title: 'Выражения', body: 'В SELECT можно считать: арифметика `+ - * /`, склейка строк `||`, функции.', code: "SELECT name, price * stock AS total,\n       name || ' (' || category || ')' AS label\nFROM products;" },
      { title: 'Порядок выполнения запроса', body: 'Логически запрос выполняется так: `FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT`. Поэтому псевдоним из SELECT нельзя использовать в WHERE, но можно в ORDER BY.' },
    ],
  },
  {
    id: 'where',
    title: 'Фильтрация WHERE',
    icon: '🔍',
    intro: 'WHERE оставляет только строки, для которых условие истинно.',
    items: [
      { title: 'Операторы сравнения', body: '`=`, `<>` (или `!=`), `<`, `>`, `<=`, `>=`.', code: 'SELECT * FROM products WHERE price >= 30000;' },
      { title: 'AND, OR, NOT', body: 'AND выполняется раньше OR — ставьте скобки, чтобы не ошибиться.', code: "SELECT * FROM employees\nWHERE (city = 'Москва' OR city = 'Казань')\n  AND salary > 100000;" },
      { title: 'IN', body: 'Проверка вхождения в список значений или в результат подзапроса.', code: "SELECT * FROM customers WHERE country IN ('Россия', 'Беларусь');" },
      { title: 'BETWEEN', body: 'Диапазон **включительно** с обеих сторон.', code: 'SELECT * FROM employees WHERE salary BETWEEN 80000 AND 120000;' },
      { title: 'LIKE', body: '`%` — любое количество любых символов, `_` — ровно один символ.', code: "SELECT * FROM customers WHERE email LIKE '%@mail.ru';\nSELECT * FROM products WHERE name LIKE 'Монитор 2_%';" },
      { title: 'IS NULL', body: 'NULL — «неизвестно». Сравнение `= NULL` всегда даёт NULL (не TRUE), поэтому используйте `IS NULL` / `IS NOT NULL`.', code: 'SELECT * FROM employees WHERE email IS NULL;' },
    ],
  },
  {
    id: 'order',
    title: 'Сортировка и LIMIT',
    icon: '↕️',
    items: [
      { title: 'ORDER BY', body: '`ASC` — по возрастанию (по умолчанию), `DESC` — по убыванию. Можно указать несколько столбцов.', code: 'SELECT name, category, price\nFROM products\nORDER BY category, price DESC;' },
      { title: 'LIMIT и OFFSET', body: 'LIMIT ограничивает количество строк, OFFSET пропускает первые N. Используется для пагинации.', code: '-- третья страница по 10 строк\nSELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 20;' },
      { title: 'Без ORDER BY порядок не гарантирован', body: 'База вправе вернуть строки в любом порядке. Если порядок важен — всегда пишите ORDER BY.' },
    ],
  },
  {
    id: 'aggregate',
    title: 'Агрегатные функции',
    icon: '∑',
    intro: 'Агрегатные функции сворачивают много строк в одно значение.',
    items: [
      { title: 'COUNT', body: '`COUNT(*)` — все строки, `COUNT(col)` — строки, где col не NULL, `COUNT(DISTINCT col)` — уникальные значения.', code: 'SELECT COUNT(*), COUNT(email), COUNT(DISTINCT city)\nFROM customers;' },
      { title: 'SUM и AVG', body: 'Сумма и среднее. NULL-значения игнорируются.', code: 'SELECT SUM(stock), ROUND(AVG(price), 2) FROM products;' },
      { title: 'MIN и MAX', body: 'Работают с числами, строками и датами.', code: 'SELECT MIN(hire_date), MAX(salary) FROM employees;' },
    ],
  },
  {
    id: 'group',
    title: 'GROUP BY и HAVING',
    icon: '🗂️',
    items: [
      { title: 'GROUP BY', body: 'Разбивает строки на группы с одинаковыми значениями; агрегаты считаются для каждой группы. В SELECT должны быть только столбцы группировки и агрегаты.', code: 'SELECT department_id, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY department_id;' },
      { title: 'HAVING', body: 'Фильтр по группам (после агрегации). WHERE фильтрует строки до группировки.', code: 'SELECT category, AVG(price)\nFROM products\nGROUP BY category\nHAVING AVG(price) > 20000;' },
      { title: 'WHERE + GROUP BY + HAVING', body: 'Сначала WHERE отбрасывает строки, затем строки группируются, затем HAVING отбрасывает группы.', code: "SELECT employee_id, COUNT(*) AS cnt\nFROM orders\nWHERE status <> 'cancelled'\nGROUP BY employee_id\nHAVING COUNT(*) >= 5;" },
    ],
  },
  {
    id: 'join',
    title: 'JOIN — соединения',
    icon: '🔗',
    intro: 'JOIN объединяет строки нескольких таблиц по условию.',
    items: [
      { title: 'INNER JOIN', body: 'Только строки, у которых есть пара в обеих таблицах. `JOIN` = `INNER JOIN`.', code: 'SELECT e.first_name, d.name\nFROM employees e\nJOIN departments d ON d.id = e.department_id;' },
      { title: 'LEFT JOIN', body: 'Все строки левой таблицы; если пары нет — столбцы правой таблицы будут NULL.', code: 'SELECT d.name, e.first_name\nFROM departments d\nLEFT JOIN employees e ON e.department_id = d.id;' },
      { title: 'Анти-соединение', body: 'Найти строки без пары: LEFT JOIN + проверка ключа правой таблицы на NULL.', code: 'SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;' },
      { title: 'RIGHT / FULL JOIN', body: 'RIGHT JOIN — все строки правой таблицы, FULL JOIN — все строки обеих. Поддерживаются в SQLite с версии 3.39.' },
      { title: 'CROSS JOIN', body: 'Декартово произведение: каждая строка с каждой.', code: 'SELECT d.name, p.name FROM departments d CROSS JOIN products p;' },
      { title: 'Self JOIN', body: 'Соединение таблицы с самой собой — для иерархий и сравнения строк одной таблицы.', code: 'SELECT e.first_name, m.first_name AS manager\nFROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id;' },
    ],
  },
  {
    id: 'subquery',
    title: 'Подзапросы',
    icon: '🪆',
    items: [
      { title: 'Скалярный подзапрос', body: 'Возвращает одно значение, используется как обычная величина.', code: 'SELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);' },
      { title: 'Подзапрос в IN', body: 'Возвращает список значений.', code: "SELECT * FROM employees\nWHERE department_id IN (SELECT id FROM departments WHERE location = 'Москва');" },
      { title: 'Подзапрос в FROM', body: 'Результат подзапроса используется как временная таблица (нужен псевдоним).', code: 'SELECT AVG(total) FROM (\n  SELECT order_id, SUM(quantity * unit_price) AS total\n  FROM order_items GROUP BY order_id\n) t;' },
      { title: 'Коррелированный подзапрос', body: 'Ссылается на строку внешнего запроса и выполняется для каждой строки.', code: 'SELECT p.name FROM products p\nWHERE p.price > (\n  SELECT AVG(price) FROM products WHERE category = p.category\n);' },
      { title: 'EXISTS / NOT EXISTS', body: 'TRUE, если подзапрос вернул хотя бы одну строку. Безопаснее NOT IN, когда в подзапросе возможны NULL.', code: 'SELECT name FROM customers c\nWHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);' },
    ],
  },
  {
    id: 'functions',
    title: 'Строки, даты, NULL',
    icon: '🔤',
    items: [
      { title: 'Строковые функции', body: '`LENGTH(s)`, `UPPER(s)`, `LOWER(s)`, `SUBSTR(s, start, len)`, `INSTR(s, sub)`, `REPLACE(s, a, b)`, `TRIM(s)`, склейка `||`.', code: "SELECT UPPER(email), SUBSTR(email, INSTR(email, '@') + 1) AS domain\nFROM customers;" },
      { title: 'Даты в SQLite', body: "Даты хранятся строками `YYYY-MM-DD`. Функции: `date()`, `strftime(формат, дата)`, `julianday()`. Форматы: `%Y` год, `%m` месяц, `%d` день, `%w` день недели (0 = вс).", code: "SELECT strftime('%Y', order_date) AS year,\n       date(order_date, '+7 days') AS plus_week,\n       julianday('now') - julianday(order_date) AS days_ago\nFROM orders;" },
      { title: 'COALESCE и IFNULL', body: 'Возвращают первое не-NULL значение.', code: "SELECT name, COALESCE(email, 'не указан') FROM customers;" },
      { title: 'NULLIF', body: '`NULLIF(a, b)` возвращает NULL, если a = b. Удобно для защиты от деления на ноль.', code: 'SELECT price / NULLIF(stock, 0) FROM products;' },
      { title: 'CAST', body: 'Приведение типов: `CAST(x AS INTEGER)`, `CAST(x AS REAL)`, `CAST(x AS TEXT)`.', code: "SELECT CAST(strftime('%Y', hire_date) AS INTEGER) FROM employees;" },
      { title: 'Целочисленное деление', body: 'В SQLite `7 / 2 = 3`. Чтобы получить дробь, умножьте на `1.0`: `7 * 1.0 / 2 = 3.5`.' },
    ],
  },
  {
    id: 'case',
    title: 'CASE',
    icon: '🔀',
    items: [
      { title: 'Поисковый CASE', body: 'Условия проверяются по порядку, возвращается первое подходящее значение.', code: "SELECT name,\n  CASE WHEN price > 50000 THEN 'дорого'\n       WHEN price > 10000 THEN 'средне'\n       ELSE 'дёшево' END AS segment\nFROM products;" },
      { title: 'Простой CASE', body: 'Сравнение одного выражения с вариантами.', code: "SELECT id, CASE status WHEN 'delivered' THEN 'Доставлен' ELSE 'Другое' END\nFROM orders;" },
      { title: 'Условная агрегация', body: 'CASE внутри агрегата — способ построить сводную таблицу.', code: "SELECT\n  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled\nFROM orders;" },
    ],
  },
  {
    id: 'window',
    title: 'Оконные функции',
    icon: '🪟',
    intro: 'Оконные функции считают значение по «окну» связанных строк, но, в отличие от GROUP BY, не сворачивают строки.',
    items: [
      { title: 'Синтаксис OVER', body: '`функция() OVER (PARTITION BY ... ORDER BY ... ROWS ...)`. PARTITION BY — группы, ORDER BY — порядок внутри окна.', code: 'SELECT first_name, department_id, salary,\n  AVG(salary) OVER (PARTITION BY department_id) AS dept_avg\nFROM employees;' },
      { title: 'ROW_NUMBER, RANK, DENSE_RANK', body: 'ROW_NUMBER — 1,2,3,4; RANK — 1,2,2,4 (с пропусками); DENSE_RANK — 1,2,2,3.', code: 'SELECT salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,\n  RANK()       OVER (ORDER BY salary DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk\nFROM employees;' },
      { title: 'LAG и LEAD', body: 'Значение из предыдущей / следующей строки окна.', code: 'SELECT id, order_date,\n  LAG(order_date)  OVER (ORDER BY order_date) AS prev,\n  LEAD(order_date) OVER (ORDER BY order_date) AS next\nFROM orders;' },
      { title: 'Накопительный итог', body: 'SUM с ORDER BY внутри OVER даёт нарастающую сумму.', code: 'SELECT id, SUM(quantity) OVER (ORDER BY id) AS running\nFROM order_items;' },
      { title: 'Рамка окна', body: '`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` — текущая и две предыдущие строки (скользящее окно).', code: 'SELECT id, AVG(quantity) OVER (\n  ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n) FROM order_items;' },
      { title: 'NTILE, FIRST_VALUE', body: 'NTILE(n) делит строки на n групп; FIRST_VALUE / LAST_VALUE — первое/последнее значение окна.', code: 'SELECT name, price, NTILE(4) OVER (ORDER BY price DESC) AS quartile\nFROM products;' },
      { title: 'Фильтр по оконной функции', body: 'Оконные функции нельзя писать в WHERE — оберните запрос в подзапрос или CTE.', code: 'SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn\n  FROM employees\n) WHERE rn = 1;' },
    ],
  },
  {
    id: 'cte',
    title: 'CTE (WITH)',
    icon: '🧩',
    items: [
      { title: 'Обычный CTE', body: 'Именованный подзапрос, который делает сложные запросы читаемыми. Можно объявить несколько через запятую.', code: 'WITH totals AS (\n  SELECT order_id, SUM(quantity * unit_price) AS total\n  FROM order_items GROUP BY order_id\n)\nSELECT * FROM totals WHERE total > 100000;' },
      { title: 'Рекурсивный CTE', body: 'Состоит из якоря и рекурсивной части, объединённых UNION ALL. Нужен для иерархий и генерации последовательностей.', code: 'WITH RECURSIVE tree AS (\n  SELECT id, first_name, 0 AS lvl FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.first_name, t.lvl + 1\n  FROM employees e JOIN tree t ON e.manager_id = t.id\n)\nSELECT * FROM tree;' },
    ],
  },
  {
    id: 'sets',
    title: 'UNION, INTERSECT, EXCEPT',
    icon: '⭕',
    items: [
      { title: 'UNION / UNION ALL', body: 'Объединение результатов. UNION убирает дубликаты, UNION ALL — нет (и работает быстрее). Количество и типы столбцов должны совпадать.', code: 'SELECT city FROM employees\nUNION\nSELECT city FROM customers;' },
      { title: 'INTERSECT', body: 'Строки, которые есть в обоих результатах.', code: 'SELECT city FROM employees INTERSECT SELECT city FROM customers;' },
      { title: 'EXCEPT', body: 'Строки первого результата, которых нет во втором (в некоторых СУБД — MINUS).', code: 'SELECT city FROM customers EXCEPT SELECT city FROM employees;' },
    ],
  },
  {
    id: 'dml',
    title: 'INSERT, UPDATE, DELETE',
    icon: '✏️',
    intro: 'DML — команды изменения данных. В тренажёре каждый запуск выполняется на свежей копии базы, так что ничего не сломается.',
    items: [
      { title: 'INSERT', body: 'Добавление строк. Можно вставить несколько строк одним запросом.', code: "INSERT INTO departments (id, name, location)\nVALUES (7, 'Аналитика', 'Москва'), (8, 'Юристы', 'Казань');" },
      { title: 'INSERT ... SELECT', body: 'Вставка результата запроса.', code: "INSERT INTO departments (name, location)\nSELECT DISTINCT city || ' офис', city FROM customers;" },
      { title: 'UPDATE', body: 'Изменение строк. **Без WHERE изменятся все строки!**', code: 'UPDATE products SET price = price * 1.05 WHERE category = \'Сеть\';' },
      { title: 'DELETE', body: 'Удаление строк. **Без WHERE удалится всё!**', code: "DELETE FROM orders WHERE status = 'cancelled';" },
    ],
  },
  {
    id: 'ddl',
    title: 'DDL: таблицы и индексы',
    icon: '🏗️',
    items: [
      { title: 'CREATE TABLE', body: 'Создание таблицы с типами и ограничениями: PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, CHECK, REFERENCES.', code: 'CREATE TABLE suppliers (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  rating INTEGER DEFAULT 0 CHECK (rating BETWEEN 0 AND 5)\n);' },
      { title: 'ALTER TABLE', body: 'Изменение структуры: добавить столбец, переименовать.', code: 'ALTER TABLE products ADD COLUMN discount INTEGER DEFAULT 0;\nALTER TABLE products RENAME COLUMN stock TO quantity;' },
      { title: 'DROP TABLE', body: 'Удаление таблицы целиком вместе с данными.', code: 'DROP TABLE IF EXISTS suppliers;' },
      { title: 'CREATE INDEX', body: 'Индекс ускоряет поиск и JOIN по столбцу, но замедляет запись.', code: 'CREATE INDEX idx_orders_customer ON orders (customer_id);' },
      { title: 'CREATE VIEW', body: 'Представление — сохранённый запрос, к которому можно обращаться как к таблице.', code: "CREATE VIEW active_orders AS\nSELECT * FROM orders WHERE status IN ('shipped', 'processing');" },
    ],
  },
];

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'SQL', definition: 'Structured Query Language — декларативный язык запросов к реляционным базам данных: вы описываете, *что* нужно получить, а СУБД решает, *как*.' },
  { term: 'СУБД', definition: 'Система управления базами данных: PostgreSQL, MySQL, SQLite, Oracle, MS SQL Server и др.' },
  { term: 'Реляционная модель', definition: 'Данные хранятся в таблицах (отношениях), связанных между собой через ключи.' },
  { term: 'Таблица', definition: 'Набор строк с одинаковой структурой столбцов.' },
  { term: 'Строка (запись, кортеж)', definition: 'Один объект в таблице, например один сотрудник.' },
  { term: 'Столбец (поле, атрибут)', definition: 'Характеристика объекта с определённым типом данных, например salary.' },
  { term: 'Первичный ключ (PRIMARY KEY)', definition: 'Столбец или набор столбцов, однозначно идентифицирующий строку. Уникален и не может быть NULL.' },
  { term: 'Внешний ключ (FOREIGN KEY)', definition: 'Столбец, ссылающийся на первичный ключ другой таблицы. Например, employees.department_id → departments.id.' },
  { term: 'Составной ключ', definition: 'Ключ из нескольких столбцов, уникальный только в комбинации.' },
  { term: 'NULL', definition: 'Специальное значение «неизвестно / отсутствует». Любое сравнение с NULL даёт NULL, поэтому используют IS NULL.' },
  { term: 'Трёхзначная логика', definition: 'В SQL условие может быть TRUE, FALSE или UNKNOWN (из-за NULL). WHERE оставляет только TRUE.' },
  { term: 'DDL', definition: 'Data Definition Language — команды определения структуры: CREATE, ALTER, DROP.' },
  { term: 'DML', definition: 'Data Manipulation Language — команды работы с данными: SELECT, INSERT, UPDATE, DELETE.' },
  { term: 'DCL / TCL', definition: 'DCL — права доступа (GRANT, REVOKE). TCL — управление транзакциями (BEGIN, COMMIT, ROLLBACK).' },
  { term: 'Запрос (query)', definition: 'Инструкция к СУБД, например SELECT, возвращающая результирующий набор строк.' },
  { term: 'Предикат', definition: 'Логическое условие, например `salary > 100000`, используемое в WHERE, HAVING, ON.' },
  { term: 'Агрегатная функция', definition: 'Функция, вычисляющая одно значение по набору строк: COUNT, SUM, AVG, MIN, MAX.' },
  { term: 'Группировка', definition: 'Разбиение строк на группы с одинаковыми значениями (GROUP BY) для подсчёта агрегатов.' },
  { term: 'JOIN', definition: 'Соединение строк из нескольких таблиц по условию.' },
  { term: 'Декартово произведение', definition: 'Все возможные комбинации строк двух таблиц (CROSS JOIN). N × M строк.' },
  { term: 'Подзапрос', definition: 'Запрос внутри другого запроса. Бывает скалярным, табличным и коррелированным.' },
  { term: 'Коррелированный подзапрос', definition: 'Подзапрос, ссылающийся на столбцы внешнего запроса; логически выполняется для каждой внешней строки.' },
  { term: 'CTE', definition: 'Common Table Expression — именованный временный результат, объявляемый через WITH.' },
  { term: 'Оконная функция', definition: 'Функция, вычисляемая по набору связанных строк (окну) без сворачивания строк: ROW_NUMBER, RANK, LAG, SUM() OVER.' },
  { term: 'Представление (VIEW)', definition: 'Сохранённый запрос, к которому обращаются как к таблице. Сам данные не хранит.' },
  { term: 'Индекс', definition: 'Структура данных (обычно B-дерево), ускоряющая поиск по столбцам. Ускоряет чтение, замедляет запись.' },
  { term: 'Транзакция', definition: 'Группа операций, выполняемая как единое целое: либо все изменения применяются (COMMIT), либо ни одного (ROLLBACK).' },
  { term: 'ACID', definition: 'Свойства транзакций: Atomicity (атомарность), Consistency (согласованность), Isolation (изоляция), Durability (долговечность).' },
  { term: 'Нормализация', definition: 'Проектирование таблиц так, чтобы исключить дублирование данных и аномалии при изменении (1НФ, 2НФ, 3НФ).' },
  { term: 'Денормализация', definition: 'Осознанное дублирование данных ради скорости чтения.' },
  { term: 'Ограничение (constraint)', definition: 'Правило целостности данных: NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY, DEFAULT.' },
  { term: 'Кардинальность связи', definition: 'Тип связи между таблицами: один-к-одному, один-ко-многим, многие-ко-многим (через промежуточную таблицу, как order_items).' },
  { term: 'План выполнения', definition: 'Способ, которым СУБД выполнит запрос. Смотрится через EXPLAIN (в SQLite — EXPLAIN QUERY PLAN).' },
  { term: 'Псевдоним (alias)', definition: 'Временное имя столбца или таблицы, задаваемое через AS.' },
  { term: 'Схема', definition: 'Описание структуры БД: таблицы, столбцы, типы, связи. Также — пространство имён в PostgreSQL.' },
  { term: 'SQL-инъекция', definition: 'Уязвимость, когда пользовательский ввод подставляется в текст запроса. Защита — параметризованные запросы.' },
];

export const TIPS: string[] = [
  'Начинайте запрос с FROM: сначала решите, откуда берутся данные, потом — что выводить.',
  'Не уверены в результате JOIN? Сначала выведите `SELECT *` с LIMIT 10 и посмотрите на данные.',
  'COUNT(*) после LEFT JOIN посчитает и строки без пары. Для подсчёта пар используйте COUNT(столбец_правой_таблицы).',
  'NOT IN с подзапросом, в котором есть NULL, вернёт пустой результат. Используйте NOT EXISTS.',
  'Условие по агрегату — в HAVING, по обычному столбцу — в WHERE (так быстрее).',
  'Деление целых чисел в SQLite отбрасывает дробную часть: используйте 100.0 вместо 100.',
  'Ctrl+Enter в редакторе запускает запрос.',
];
