const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// التحقق من وجود ملف قاعدة البيانات، وإذا لم يكن موجودًا يتم إنشاؤه تلقائيًا
const dbFile = './chat_app.db';
const dbExists = fs.existsSync(dbFile);

const db = new sqlite3.Database(dbFile);

if (!dbExists) {
    db.serialize(() => {
        console.log('Creating database and tables...');
        
        // إنشاء جداول الرسائل والنصوص عند أول تشغيل
        db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, senderId TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS texts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, senderId TEXT)");
        
        console.log('Database and tables created.');
    });
} else {
    console.log('Database already exists. Skipping creation.');
}

// إعداد مجلد الملفات الثابتة
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('User connected');

    // إرسال الرسائل عند الاتصال
    db.all("SELECT * FROM messages", (err, rows) => {
        if (!err) socket.emit('load_messages', rows);
    });

    // إرسال النصوص عند الاتصال
    db.all("SELECT * FROM texts", (err, rows) => {
        if (!err) socket.emit('load_texts', rows);
    });

    // استقبال رسالة جديدة وتخزينها في قاعدة البيانات
    socket.on('new_message', (message) => {
        db.run("INSERT INTO messages (content, senderId) VALUES (?, ?)", [message.content, message.senderId], function(err) {
            if (!err) io.emit('message', { id: this.lastID, ...message });
        });
    });

    // استقبال نص جديد وتخزينه في قاعدة البيانات
    socket.on('new_text', (text) => {
        db.run("INSERT INTO texts (content, senderId) VALUES (?, ?)", [text.content, text.senderId], function(err) {
            if (!err) io.emit('text', { id: this.lastID, ...text });
        });
    });

    // حذف رسالة
    socket.on('delete_message', (id) => {
        db.run("DELETE FROM messages WHERE id = ?", [id], function(err) {
            if (!err) io.emit('message_deleted', id);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
