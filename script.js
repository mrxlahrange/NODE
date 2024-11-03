//opage
function navigateTo(pageId) {
  history.pushState({ page: pageId }, null, `#${pageId}`);
  showPage(pageId);
}
function showPage(pageId) {
  var content = document.getElementById("app");
  content.innerHTML = `<h1>${pageId}</h1>`;
}
window.onload = function () {
  var initialPageId = window.location.hash.slice(1) || "page1";
  navigateTo(initialPageId);
};
window.onload = function () {
};

window.onpopstate = function (event) {
  var pageId = (event.state && event.state.page) || "page1";
  showPage(pageId);
};
function showPage(pageId) {
  window.scrollTo(0, 0);

  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  var pageToShow = document.getElementById(pageId);
  pageToShow.style.display = "block";
  var tableRow = document.getElementById("table-" + pageId);
}
//node
const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("heade p"),
closeIcon = popupBox.querySelector("heade i"),
titleTag = popupBox.querySelector(".id"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = [
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December",
];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
updateId;

addBox.addEventListener("click", () => {
popupTitle.innerText = "Add a new Note";
addBtn.innerText = "Add Note";
popupBox.classList.add("show");
document.querySelector("body").style.overflow = "hidden";
if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
isUpdate = false;
titleTag.value = descTag.value = "";
popupBox.classList.remove("show");
document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
if (!notes) return;
document.querySelectorAll(".note").forEach((li) => li.remove());
notes.forEach((note, id) => {
  let filterDesc = note.description.replaceAll("\n", "<br/>");
  let liTag = `<li class="note">
                    <div class="detail">
<p>${note.title}


<button class="copy" onclick="copyText('span${id}')"><i class="fa-regular fa-clone fa-fade"></i>  </button>
<span id="span${id}">${filterDesc}</span>
</div>
                      <div class="bottom-content">
                          <span>${note.date}</span>
                          <div class="settings">
                              <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                              <ul class="menu">
                                  <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                  <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                              </ul>
                          </div>
                      </div>
                  </li>`;
  addBox.insertAdjacentHTML("afterend", liTag);
});
}
showNotes();

function showMenu(elem) {
elem.parentElement.classList.add("show");
document.addEventListener("click", (e) => {
  if (e.target.tagName != "I" || e.target != elem) {
    elem.parentElement.classList.remove("show");
  }
});
}

function deleteNote(noteId) {
let confirmDel = confirm("Are you sure you want to delete this note?");
if (!confirmDel) return;
notes.splice(noteId, 1);
localStorage.setItem("notes", JSON.stringify(notes));
showNotes();
}

function updateNote(noteId, title, filterDesc) {
let description = filterDesc.replaceAll("<br/>", "\r\n");
updateId = noteId;
isUpdate = true;
addBox.click();
titleTag.value = title;
descTag.value = description;
popupTitle.innerText = "Update a Note";
addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", (e) => {
e.preventDefault();
let title = titleTag.value.trim(),
  description = descTag.value.trim();

if (title || description) {
  let currentDate = new Date(),
    month = months[currentDate.getMonth()],
    day = currentDate.getDate(),
    year = currentDate.getFullYear();

  let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
  if (!isUpdate) {
    notes.push(noteInfo);
  } else {
    isUpdate = false;
    notes[updateId] = noteInfo;
  }
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
  closeIcon.click();
}
});

function copyText(elementId) {
var textToCopy = document.getElementById(elementId);
var text = textToCopy.textContent;

var tempInput = document.createElement("input");
tempInput.value = text;
document.body.appendChild(tempInput);
tempInput.select();
document.execCommand("copy");
document.body.removeChild(tempInput);
}


