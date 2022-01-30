require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const privatePage = require("./routes/private");
const errorHandler = require("./middleware/error");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

// Connecting Routes
app.use("/api/auth", auth);
app.use("/api/private", privatePage);

app.use("/api/products", productRoutes);

app.use(errorHandler);

const whitelist = ['"http://127.0.0.1:3000"', '"http://127.0.0.1:5000"', 'https://uno-ecommerce.herokuapp.com'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

// Serve client react instead of backend 
// Add the follwing code to your server file on the backend 
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
