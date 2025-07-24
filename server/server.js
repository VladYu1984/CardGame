require('dotenv').config();
// Tech requirements
const jsonServer = require('json-server');
const path = require('path');
// Controllers
const { getMe, register, login, deleteUser } = require('./controllers/UserController.js');
// Middlewares
const authMiddleware = require('./authMiddleware');
const PORT = process.env.PORT || 5000;
// Server
const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
// Server configs
server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

server.use(async (req, res, next) => {
    await new Promise((res) => {
        setTimeout(res, 800);
    });
    next();
});
// PUBLIC ENDPOINTS
// Эндпоинт для регистрации
server.post('/registration', register);
// Middleware for check Authorization token
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

server.use(router);

// запуск сервера
server.listen(PORT, () => {
    console.log(`server is running on ${PORT} port`);
});