const socket = io();

// الحصول على معرف المستخدم الثابت من localStorage أو إنشاؤه
let myId = localStorage.getItem('myId');
if (!myId) {
    myId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('myId', myId);
}

// تحميل الرسائل المخزنة عند الاتصال
socket.on('load_messages', (messages) => {
    messages.forEach(message => addMessage(message.id, message.content, message.senderId));
});

// استقبال رسالة جديدة
socket.on('message', (message) => {
    addMessage(message.id, message.content, message.senderId);
});

// استقبال إشعار بحذف الرسالة
socket.on('message_deleted', (id) => {
    const messageElement = document.getElementById(`message-${id}`);
    if (messageElement) {
        messageElement.remove();
    }
});

// إرسال رسالة جديدة
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('new_message', { content: message, senderId: myId });
        input.value = '';
    }
}
//000000000000000000000000000000000000000

// إضافة الرسالة إلى القائمة مع إمكانية حذفها عند النقر عليها إذا كانت من المستخدم نفسه 
function addMessage(id,
    content, senderId) {
    const messagesList = document.getElementById('messages');
    const messageItem =
        document.createElement('li'); messageItem.id = `message-${id}`; messageItem.className = 'message ' + (senderId ===
            myId ? 'my-message' : 'friend-message'); messageItem.textContent = content;
    if (senderId === myId) { messageItem.onclick = () => deleteMessage(id); }
    messagesList.appendChild(messageItem);
} // حذف الرسالة 
function deleteMessage(id) {
    socket.emit('delete_message',
        id); // إرسال الطلب إلى الخادم لحذف الرسالة 
}



// تحميل النصوص عند الاتصال
socket.on('load_texts', (texts) => {
    texts.forEach(text => addText(text.id, text.content, text.senderId));
});

// استقبال نص جديد
socket.on('text', (text) => {
    addText(text.id, text.content, text.senderId);
});

// استقبال تحديث النص
socket.on('text_updated', (text) => {
    const textItem = document.getElementById(`text-${text.id}`);
    if (textItem) {
        textItem.querySelector('.text-content').textContent = text.content;
    }
});

// استقبال إشعار بحذف النص
socket.on('text_deleted', (id) => {
    const textItem = document.getElementById(`text-${id}`);
    if (textItem) {
        textItem.remove();
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////lll//////



let editingTextId = null;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function publishText() {
    const input = document.getElementById('text-input');
    const text = input.value.trim();
    if (text) {
        if (editingTextId !== null) { // تعديل النص إذا كان في وضع التعديل
            socket.emit('edit_text', { id: editingTextId, content: text });
            editingTextId = null;
        } else { // نشر نص جديد إذا لم يكن في وضع التعديل
            socket.emit('new_text', { content: text, senderId: myId });
        }
        input.value = ''; // إفراغ الحقل بعد النشر
    }
    poopup.style.display = 'none';

}
function addText(id, content, senderId) {
    const existingTextItem = document.getElementById(`text-${id}`);
    if (existingTextItem) {
        existingTextItem.querySelector('span').textContent = content; // تحديث النص
    } else {
        const textsList = document.getElementById('texts');
        const textItem = document.createElement('lo');
        textItem.id = `text-${id}`;
        textItem.className = 'text-item';
        textItem.innerHTML = `
        
    <div class="hlk">
        <span class="text-content">${content}</span>
            

            ${senderId === myId ? '<div class="lop"><button onclick="editText(' + id + ')">&#9998;</button>' : ''}
            ${senderId === myId ? '<button onclick="deleteText(' + id + ')">&#10060;</button></div>' : ''}
        </div>

        `;





        textsList.appendChild(textItem);
    }
}
function editText(id) {

    const textItem = document.getElementById(`text-${id}`);
    if (textItem) {
        document.getElementById('text-input').value = textItem.querySelector('span').textContent;
        editingTextId = id;
    }
    poopup.style.display = 'flex';

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// حذف نص
function deleteText(id) {
    socket.emit('delete_text', id);
}


//clavi
const messageInput = document.getElementById('message-input');

messageInput.addEventListener('input', autoResize);

function autoResize() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';

  // عند حذف الرسالة بالكامل، يعود الحقل لارتفاعه الافتراضي
  if (this.value.trim() === '') {
    this.style.height = '42px'; // أو يمكنك تعديل الرقم لارتفاعك المفضل
  }
}