const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

const port = 3000;
// MongoDB (replace with your own)
mongoose.connect("mongodb://asifali:asifali@ac-xiz7ckd-shard-00-00.jey3ng0.mongodb.net:27017,ac-xiz7ckd-shard-00-01.jey3ng0.mongodb.net:27017,ac-xiz7ckd-shard-00-02.jey3ng0.mongodb.net:27017/?ssl=true&replicaSet=atlas-c8r3qb-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Schema
const Message = mongoose.model('Message', {
    username: String,
    text: String
});

app.use(express.json());
app.use(express.static('project'));

// Save message
app.post('/save', async (req, res) => {
    const msg = new Message(req.body);
    await msg.save();
    res.send("Saved");
});

// Get messages
app.get('/messages', async (req, res) => {
    const data = await Message.find();
    res.json(data);
});

// Socket.io
io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });
});

http.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
