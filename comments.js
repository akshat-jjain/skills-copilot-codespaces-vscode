// Create web server
const express = require('express');
const app = express();
app.use(express.static('public'));

// Create a server
const http = require('http');
const server = http.createServer(app);

// Web socket server
const io = require('socket.io')(server);

// Connect to the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comments');

// Create a schema
const commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

// Create a model
const Comment = mongoose.model('Comment', commentSchema);

// Get the comments from the database
let comments = [];
Comment.find({}, (err, data) => {
    comments = data;
});

// When a new client connects
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the comments to the client
    socket.emit('load comments', comments);

    // When a new comment is added
    socket.on('new comment', (data) => {
        console.log('New comment: ' + data.name + ' - ' + data.comment);

        // Save the comment to the database
        const newComment = new Comment(data);
        newComment.save();

        // Add the comment to the list
        comments.push(data);

        // Send the comment to all clients
        io.emit('new comment', data);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});