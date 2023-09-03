const mongoose = require("mongoose")

const socketSchema = new mongoose.Schema({
  message: {
    required: true,
    type: String
  }
})

const socket = mongoose.model("SocketModel", socketSchema)

module.exports = socket