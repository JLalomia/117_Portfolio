const express = require('express');
const path = require('path');
const routes = require('./routes'); // Import the route registry
const { url } = require('./helpers/urlHelper'); // Import the URL helper

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Set the directory where the template files are located
app.set('views', path.join(__dirname, '../views'));

// Middleware to serve static files from the 'public' directory
//app.use(express.static(path.join(__dirname, '../docs')));
app.use('/css', express.static('docs/css'));
app.use('/images', express.static('docs/images'));
app.use('/js', express.static('docs/js'));
app.use((req, res, next) => {
    // Extract the last part of the URL path as the current page name
    const path = req.path.split('/').filter(Boolean).pop();
    res.locals.currentPage = path || 'home'; // Default to 'home' if the path is empty
    next();
});

// Make the URL helper and routes available in all EJS templates
app.locals.url = url;
app.locals.routes = routes;

app.get(routes.home, (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});