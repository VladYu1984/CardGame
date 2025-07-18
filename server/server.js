require('dotenv').config();
const jsonServer = require('json-server');
const path = require('path');

const { getMe, register, login, deleteUser } = require('./controllers/UserController.js');

const authMiddleware = require('./authMiddleware');

const PORT = process.env.PORT || 5000;

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Нужно для небольшой задержки, чтобы запрос проходил не мгновенно, имитация реального апи
server.use(async (req, res, next) => {
    await new Promise((res) => {
        setTimeout(res, 800);
    });
    next();
});

// Эндпоинт для регистрации
server.post('/registration', register);

server.use((req, res, next) => {
	if (!req.headers.authorization) {
	  return res.status(403).json({ message: 'AUTH ERROR' });
	}
	next();
});

server.use(authMiddleware);

// Эндпоинт для логина
server.post('/login', login);

// Эндпоинт для получения данных юзера
server.get('/me', getMe);

// Эндпоинт для удаления юзера
server.delete('/delete', deleteUser);


// server.post('/registration', register);

// // проверяем, авторизован ли пользователь
// // eslint-disable-next-line
// server.use((req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(403).json({ message: 'AUTH ERROR' });
//     }

//     next();
// });

// // Эндпоинт для получения данных юзера
// server.get('/me', authMiddleware, getMe);

// // Эндпоинт для логина
// server.post('/login', authMiddleware, login);

// server.use(authMiddleware);
// server.use(router);

// server.delete('/delete', deleteUser)
server.use(router);

// запуск сервера
server.listen(PORT, () => {
    console.log('server is running on 8000 port');
});