const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet()); // Integrate Helmet for security
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
}));

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Define routes
app.get('/', (req, res) => {
    res.render('index'); // Serve the index page
});

app.get('/login', (req, res) => {
    res.render('login'); // Serve the login form
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Simple authentication logic for demonstration purposes
    if (email === 'user@example.com' && password === 'password') {
        req.session.user = {
            name: 'User',
            email: email,
            address: '123 Main St',
            pincode: '12345'
        };
        res.redirect('/profile');
    } else {
        res.redirect('/login'); // Redirect back to login if authentication fails
    }
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', {
        name: req.session.user.name,
        email: req.session.user.email,
        address: req.session.user.address,
        pincode: req.session.user.pincode,
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.redirect('/profile');
        res.redirect('/login');
    });
});

// Serve static files if you have any
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Start the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
