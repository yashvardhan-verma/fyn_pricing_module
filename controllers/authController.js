const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const saltRounds = 10;
const SECRET_KEY = process.env.JWT_SECRET || 'yashvardhan';


module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).send({ status: false, message: "Please add all fields" });

      const userExist = await userModel.findOne({ email: email });
      if (!userExist) return res.status(400).send({ status: false, message: "User Not found." });

      const passwordIsValid = bcrypt.compareSync(
        password,
        userExist.password
      );
      if (!passwordIsValid) return res.status(401).send({ status: false, message: "Invalid Password!" });

      const token = jwt.sign({ id: userExist.id }, SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });

      const addTokenToUser = await userModel.updateOne({ _id: userExist._id }, { $push: { jwtToken: token } })
      // req.session.token = token;
      return res.status(200).send({
        status: true, message: "User logged in successfully!", data: {
          id: userExist.id,
          token: token,
          name: userExist.name,
          email: userExist.email,
        }
      });
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  logout: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).send({ status: false, message: "Please add all fields" });

      const userExist = await userModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
      if (!userExist) return res.status(404).send({ status: false, message: "User Not found." });

      const addTokenToUser = await userModel.updateOne({ _id: userExist._id }, { $set: { jwtToken: [] } })
      // req.session.token = token;
      return res.status(200).send({ status: true, message: "User logged out successfully!" });
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },
}