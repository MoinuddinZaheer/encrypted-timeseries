const express = require("express")
const { Server } = require("socket.io")
const encryptDecrypt = require('./encryption')
const SocketModel = require("./socket.model")
const bodyParser = require("body-parser")
const db = require("mongoose")
const Jwt = require("jsonwebtoken")
const dbData = require("./db.json")

const app = express()
const port = 5000
const secretKey = "cces5dlpGs18g387PlymMoD1TkOSJN4W3WhDGvWvXJLdDcBonN41TdKUH6v3xkeCtxG2aaK2yhQ9sQVNtGb0w=="

app.use(express.json())
app.use(bodyParser.json());

const server = app.listen(port, () => {
  console.log(`server listed on ${port}`)

  db.connect("mongodb+srv://syednoumanmateen1997:2vIsC4KGDZi5eWvm@cluster0.autnmuh.mongodb.net/socket?retryWrites=true&w=majority").then(() => {
    console.log("DB connected")
  }).catch((e) => {
    console.log("Failed to connect DB")
  })
})

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000/"
  }
})

io.on('connection', (socket) => {
  socket.on("init", async () => {
    const dbDataFilter = dbData.names.map((name, index) => ({ name, origin: dbData.cities[index], destination: dbData.cities[index + 1] || dbData.cities[0] }));

    const data = (dbDataFilter || []).map((e) => {
      const jwt = Jwt.sign({ name: e.name }, secretKey)
      return { ...e, secret_key: jwt }
    })

    if (data) {
      (data || []).forEach(async (i) => {
        await SocketModel.create({ message: await encryptDecrypt.encryptResponseData(i) })
      })

      const mongooseDbData = await SocketModel.find({})

      const fromDbData = await Promise.all((mongooseDbData || []).map(async (i) => {

        if (i.message !== undefined) {
          return { message: await encryptDecrypt.decryptRequestData(i.message) }
        }
      }))
      socket.emit("sent", fromDbData || [{
        message: {
          name: "Moin",
          origin: "Maddur",
          destination: "Bengaluru "
        }
      }])
    }
  })

  socket.on('disconnect', function () {
    socket.disconnect();
  });
});