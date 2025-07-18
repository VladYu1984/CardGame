const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const dbPath = path.resolve(__dirname, '../db.json');

function readDb() {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// GET /me
function getMe(req, res) {
  try {
    const db = readDb();
    const user = (db.users || []).find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /registration
function register(req, res) {
  try {
    const { username, password, role = 'USER' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const db = readDb();
    const users = db.users || [];
    if (users.some(u => u.username === username)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      password,
      role
    };
    users.push(newUser);
    writeDb({ ...db, users });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// POST /login
function login(req, res) {
  try {
    const { username, password } = req.body;
    const db = readDb();
    const user = (db.users || []).find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// DELETE /delete
function deleteUser(req, res) {
	try {
		const db = readDb();
		const users = db.users || [];

		const userIndex = users.findIndex(u => u.id === req.user.id);
		if (userIndex === -1) {
			return res.status(404).json({ message: 'User not found' });
		}

		users.splice(userIndex, 1);
    	writeDb({ ...db, users });

		return res.status(200).json({ message: 'User deleted successfully' });
	} catch(err) {
		console.error(err);
    	res.status(500).json({ message: err.message });
	}
}

module.exports = { getMe, register, login, deleteUser };
