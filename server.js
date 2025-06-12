const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Включаем CORS, чтобы разрешить запросы с других доменов
app.use(cors());

// Парсим JSON и form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Обработчик GET-запроса на корень, чтобы не было ошибки "Cannot GET /"
app.get('/', (req, res) => {
  res.send(`
    <h1>Сервер работает!</h1>
    <p>Для отправки данных используйте POST запрос на /submit</p>
  `);
});

// Обработка POST-запроса /submit
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Ошибка: имя пользователя и пароль обязательны.');
  }

  res.send(`
    <html>
      <head>
        <title>Информация о пользователе</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f9fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            color: #555;
            margin: 10px 0;
            word-break: break-word;
          }
          .label {
            font-weight: bold;
            color: #222;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Полученные данные</h1>
          <p><span class="label">Имя пользователя:</span> ${sanitize(username)}</p>
          <p><span class="label">Пароль:</span> ${sanitize(password)}</p>
        </div>
      </body>
    </html>
  `);
});

// Простая защита от XSS
function sanitize(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
