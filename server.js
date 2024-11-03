const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const db = new sqlite3.Database('./chat_app.db'); // قاعدة بيانات دائمة

app.use(express.static(__dirname));

// إنشاء جداول الرسائل والنصوص إذا لم تكن موجودة
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, senderId TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, senderId TEXT)");
});

io.on('connection', (socket) => {
    console.log('User connected');

    // تحميل الرسائل عند الاتصال
    db.all("SELECT * FROM messages", (err, rows) => {
        if (!err) socket.emit('load_messages', rows);
    });

    // تحميل النصوص عند الاتصال
    db.all("SELECT * FROM texts", (err, rows) => {
        if (!err) socket.emit('load_texts', rows);
    });

    // استقبال رسالة جديدة
    socket.on('new_message', (message) => {
        db.run("INSERT INTO messages (content, senderId) VALUES (?, ?)", [message.content, message.senderId], function(err) {
            if (!err) io.emit('message', { id: this.lastID, ...message });
        });
    });

    // استقبال نص جديد
    socket.on('new_text', (text) => {
        db.run("INSERT INTO texts (content, senderId) VALUES (?, ?)", [text.content, text.senderId], function(err) {
            if (!err) io.emit('text', { id: this.lastID, ...text });
        });
    });

    // تعديل النص
    
    socket.on('edit_text', (text) => {
        db.run("UPDATE texts SET content = ? WHERE id = ?", [text.content, text.id], function(err) {
            if (!err) io.emit('text', { id: text.id, content: text.content, senderId: text.senderId });
        });
    });
    
    // حذف رسالة
    socket.on('delete_message', (id) => {
        db.run("DELETE FROM messages WHERE id = ?", [id], function(err) {
            if (!err) io.emit('message_deleted', id);
        });
    });

    // حذف النص
    socket.on('delete_text', (id) => {
        db.run("DELETE FROM texts WHERE id = ?", [id], function(err) {
            if (!err) io.emit('text_deleted', id);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
////////////////////////////////////////////////////////////////////////sss

server.listen(3000, () => {
    console.log('Server running on port 3000');
});