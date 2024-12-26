const user = require("../models/user");
const jwt = require('jsonwebtoken')
const generateToken = (payload) =>{
return jwt.sign(payload,"ai-based-food-recommendation-system",{
    expiresIn: "60m",

})
}

const signup = async (req, res, next) => {
  const body = req.body;

  const newUser = await user.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
  });

  const result = newUser.toJSON();
  result.token = generateToken({
    id : result.id,

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

module.exports = { signup };
