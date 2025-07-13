const express = require('express');
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

app.use(express.json());

// JWT authentication middleware
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secretKey', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'User not authenticated' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
}

app.use('/customer/auth', authenticateJWT);

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
