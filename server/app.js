const express = require("express");
const bodyParser = require("body-parser");
const itemRoutes = require("./routes/itemRoutes");
const { syncDB } = require("./models");

const app = express();
const PORT = 3000;

app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found',
  });
});


syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
