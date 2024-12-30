const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (payload) => {
  return jwt.sign(payload, "ai-based-food-recommendation-system", {
    expiresIn: "60m",
  });
};

const signup = async (req, res, next) => {
  const body = req.body;

  const newUser = await user.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: await bcrypt.hash(body.password, 10),
    height: body.height,
    weight: body.weight,
    age: body.age,
    gender: body.gender
  });

  const result = newUser.toJSON();
  result.token = generateToken({
    id: result.id,
  });

  if (!newUser) {
    return res.status(400).json({
      status: "fail",
      message: "User not created",
    });
  }

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: result,
  });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // E-posta ve şifre kontrolü
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and password are required!",
    });
  }

  // Kullanıcıyı veritabanında arama
  const loginResult = await user.findOne({ where: { email } });
  if (!loginResult) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }

  // Şifreyi karşılaştırma
  const passwordMatch = await bcrypt.compare(password, loginResult.password);
  if (!passwordMatch) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }

  // Token oluşturma
  const token = generateToken({
    id: loginResult.id,
  });

  // Başarılı giriş yanıtı
  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
};

module.exports = { signup, login };
