const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

module.exports = function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(403).json({ message: 'AUTH ERROR: no token' });
	}

	const token = authHeader.split(' ')[1]; // "Bearer <token>"

	if (!token) {
		return res.status(403).json({ message: 'AUTH ERROR: malformed token' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded; // 👈 здесь устанавливается user.id
		next();
	} catch (e) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};
