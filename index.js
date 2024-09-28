const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const sequelize = require('./config/dbConfig');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);
app.use(adminRoutes);

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database connected and synced');
    app.listen(3000, () => console.log('Server is running on port 3000'));
  })
  .catch((err) => console.log('Error connecting to the database', err));
