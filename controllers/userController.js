const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const saltRounds = 10;


module.exports = {
  createUser: async (req, res) => {
    try {
      const { name, email, password, } = req.body;
      if (!name || !email || !password) return res.status(400).send({ status: false, message: "Please add all fields" });

      // var token = jwt.sign({ email: email }, SECRET_KEY);
      // console.log(SECRET_KEY)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const data = await new userModel({
        name: name,
        // jwtToken: [token],
        email: email,
        password: hashedPassword,
      }).save();

      if (data) {
        return res.status(200).send({ status: true, message: "User created successfully", data: data })
      }
      return res.status(400).send({ status: false, message: "Something went wrong" })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  getUser: async (req, res) => {
    try {
      const data = await userModel.find({});
      console.log(data)
      if (data.length) {
        return res.status(200).send({ status: true, message: "User list", data: data })
      }
      return res.status(200).send({ status: false, message: "No data found" })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      if (!id || !name || !email) return res.status(400).send({ status: false, message: "Please add all fields" });

      const checkUserExist = await userModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
      if (checkUserExist) {
        const updateUser = await userModel.updateOne({ _id: checkUserExist._id }, { $set: { name: name, email: email, } })
        if (updateUser) return res.status(200).send({ status: true, message: "User updates successfully", data: updateUser });
        res.status(400).send({ status: false, message: "Something went wrong" });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const deleteUser = await userModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
      if (deleteUser) return res.status(200).send({ status: true, message: "User deleted successfully", data: deleteUser });
      res.status(400).send({ status: false, message: "Something went wrong" });

    } catch (error) {
      console.log(error)
      return res.status(500).send({ status: false, message: "Something went wrong" })
    }
  },
}