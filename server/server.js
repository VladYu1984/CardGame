require('dotenv').config();
const fs = require('fs');
const jsonServer = require('json-server');
const path = require('path');
const jwt = require('jsonwebtoken');

const authMiddleware = require('./authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const PORT = process.env.PORT || 8000;

const server = jsonServer.create();

const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
const dbPath = path.resolve(__dirname, 'db.json');

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Нужно для небольшой задержки, чтобы запрос проходил не мгновенно, имитация реального апи
server.use(async (req, res, next) => {
    await new Promise((res) => {
        setTimeout(res, 800);
    });
    next();
});

// Эндпоинт для получения данных юзера
server.get('/me', authMiddleware, (req, res) => {
	try {
	  const db = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
	  const { users = [] } = db;
	  const user = users.find((u) => u.id === req.user.id);
  
	  if (!user) {
		return res.status(404).json({ message: 'User not found' });
	  }
  
	  return res.json(user);
	} catch (e) {
	  return res.status(401).json({ message: 'Invalid token' });
	}
});

// Эндпоинт для регистрации
server.post('/registration', (req, res) => {
	try {
		const { username, password, role = 'USER' } = req.body;
		if (!username || !password) {
			return res.status(400).json({ message: 'Username and password are required' });
		}
		const db = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
		const { users = [] } = db;
		const userExists = users.some((user) => user.username === username);
		if (userExists) {
			return res.status(409).json({ message: 'User already exists' });
		}

		const newUser = {
			id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
			username,
			password,
			role
		};

		users.push(newUser);
		fs.writeFileSync(dbPath, JSON.stringify({ ...db, users }, null, 2));

		const token = jwt.sign(
			{ id: newUser.id, username: newUser.username, role: newUser.role },
			JWT_SECRET,
			{ expiresIn: '1h' }
		);

		return res.status(201).json({user: newUser, token });
	} catch(e) {
		console.log(e);
		return res.status(500).json({ message: e.message })
	}
})

// Эндпоинт для логина
server.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const db = JSON.parse(fs.readFileSync(dbPath, 'UTF-8'));
        const { users = [] } = db;

        const userFromBd = users.find(
            (user) => user.username === username && user.password === password,
        );

        if (userFromBd) {
			const token = jwt.sign(
				{ id: userFromBd.id, username: userFromBd.username, role: userFromBd.role },
				JWT_SECRET,
				{ expiresIn: '24h' }
			);

			return res.json({ user: userFromBd, token });
		}

        return res.status(403).json({ message: 'User not found' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e.message });
    }
});

// проверяем, авторизован ли пользователь
// eslint-disable-next-line
server.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: 'AUTH ERROR' });
    }

    next();
});

server.use(authMiddleware);
server.use(router);

// запуск сервера
server.listen(PORT, () => {
    console.log('server is running on 8000 port');
});