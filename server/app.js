const express = require("express");
const bodyParser = require("body-parser");
const itemRoutes = require("./routes/itemRoutes");
const { syncDB } = require("./models");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/items", itemRoutes);

syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
