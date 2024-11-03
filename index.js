const openPopup = document.getElementById('openPopup');
const closePopup = document.getElementById('closePopup');
const poopup = document.getElementById('poopup');
const confirmBtn = document.getElementById('confirmBtn');

// فتح النافذة عند الضغط على الزر
openPopup.onclick = function() {
    poopup.style.display = 'flex';
}

// إغلاق النافذة عند الضغط على زر ×
closePopup.onclick = function() {
    poopup.style.display = 'none';
}

// إغلاق النافذة عند الضغط على زر Confirm
confirmBtn.onclick = function() {
    
}

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    if (event.target == poopup) {
        poopup.style.display = 'none';
    }
}