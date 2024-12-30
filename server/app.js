const express = require("express");
const cors = require("cors");
const { syncDB } = require("./models");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();
const PORT = 3000;

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend adresi
    methods: ["GET", "POST", "PUT", "DELETE"], // İzin verilen HTTP yöntemleri
    credentials: true, // Çerezleri iletmek için gerekli
  })
);

// Middleware'ler
app.use(express.json()); // JSON verileri işlemek için
app.use(express.urlencoded({ extended: true })); // Form verileri için

// Rota Tanımları
app.use("/api/auth", authRoutes); // Authentication ile ilgili rotalar
app.use("/api/favorite", favoriteRoutes); // Favorilerle ilgili rotalar

// 404 Hatası için Yakalama
app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// Veritabanı Senkronizasyonu ve Sunucu Başlatma
syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
