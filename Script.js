const Mpopup = document.querySelector("#Modifypopup");
const Apopup = document.querySelector("#Addpopup");
const AddTaskBtn = document.querySelector("#AddTaskBtn");
const Addbutton = document.querySelector("#ABtnAdd");
const ATinput = document.querySelector("#Atitle");
const ADinput = document.querySelector("#Adate");
const ADDinput = document.querySelector("#Adesc");
const Mtitle = document.querySelector("#Mtitle");
const Mdate = document.querySelector("#Mdate");
const Status = document.querySelector("#Status");
const Mdesc = document.querySelector("#Mdesc");
const table = document.getElementById("tableBody");
const topbar = document.querySelector("#topbar");
const pCheck = document.querySelector("#Pending");
const cCheck = document.querySelector("#Completed");
let data = JSON.parse(localStorage.getItem("tasks"))
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];
let completed = [];
let pending = [];
const hdninput = document.querySelector("#hiddenId");
function CPlist() {
  completed = [];
  pending = [];
  for (let item of data) {
    if (item.status == "Pending") {
      pending.push(item);
    } else {
      completed.push(item);
    }
  }
}
function updatedashboard() {
  CPlist();
  document.querySelector("#Completed-count").textContent = completed.length;
  document.querySelector("#Pending-count").textContent = pending.length;
  document.querySelector("#Total-count").textContent = data.length;
}
function notification() {
  CPlist();
  if (!pending || pending.length === 0) return "No pending tasks";

  let nearest_task = pending[0];
  let nearest_date = new Date(nearest_task.date);

  for (let i = 1; i < pending.length; i++) {
    let current_date = new Date(pending[i].date);
    if (current_date < nearest_date) {
      nearest_task = pending[i];
      nearest_date = current_date;
    }
  }

  const now = new Date();
  const taskDate = new Date(nearest_task.date);
  const diffMs = taskDate - now;

  if (diffMs <= 0) {
    return `Task "${nearest_task.title}" is overdue!`;
  }

  const diffMinutes = diffMs / (1000 * 60);
  const diffHours = diffMinutes / 60;

  if (diffMinutes < 60) {
  const mins = Math.floor(diffMinutes);
  return `Due soon: "${nearest_task.title}" — ${mins} minute${mins !== 1 ? "s" : ""} left`;
} else if (diffHours < 24) {
  const hours = Math.floor(diffHours);
  const mins = Math.floor(diffMinutes % 60);
  if (mins > 0) {
    return `Due soon: "${nearest_task.title}" — ${hours} hour${hours !== 1 ? "s" : ""} and ${mins} minute${mins !== 1 ? "s" : ""} left`;
  } else {
    return `Due soon: "${nearest_task.title}" — ${hours} hour${hours !== 1 ? "s" : ""} left`;
  }
} else {
  const days = Math.floor(diffHours / 24);
  const hours = Math.floor(diffHours % 24);
  if (days === 1 && hours === 0) {
    return `Due soon: "${nearest_task.title}" — One day left`;
  } else {
    return `Due soon: "${nearest_task.title}" — ${days}D ${hours}H left`;
  }
}
}

setInterval(() => {
  document.querySelector("#notificationParagraph").textContent = notification();
  document.querySelector("#notificationd").style.display = "flex";
  setTimeout(() => {
    document.querySelector("#notificationd").style.display = "none";
  }, 30000);
}, 60000);
function addToTable(data) {
  table.innerHTML = "";
  let box = document.createDocumentFragment();
  for (let item of data) {
    let tr = document.createElement("tr");
    tr.setAttribute("data-id", item.id);
    tr.setAttribute("data-title", item.title);
    tr.setAttribute("data-status", item.status);
    tr.setAttribute("data-desc", item.desc);
    tr.setAttribute("data-date", item.date);
    for (let t of ["title", "date", "status", "desc"]) {
      let td = document.createElement("td");
      if (t === "date") {
        td.textContent = new Date(item[t])
          .toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(" ", "  ");
      } else if (t == "status") {
        if (item[t] == "Completed") {
          td.style.color = "Green";
          td.textContent = item[t];
        } else {
          if (new Date(item.date) > new Date()) {
            td.style.color = "Yellow";
          } else {
            td.style.color = "red";
          }
          td.textContent = item[t];
        }
      } else if (t == "title") {
        td.style.fontSize = "1.1em";
        td.textContent = item[t];
      } else {
        td.textContent = item[t];
      }
      tr.appendChild(td);
    }

    let td = document.createElement("td");
    let modifybtn = document.createElement("button");
    modifybtn.textContent = "Modify";
    modifybtn.classList.add("modifybtn");
    modifybtn.classList.add("Buttons");
    modifybtn.style.margin = "0px 5px";
    let dltbutton = document.createElement("button");
    dltbutton.textContent = "Delete";
    dltbutton.classList.add("deletebtn");
    dltbutton.classList.add("Buttons");
    dltbutton.style.margin = "0px 5px";
    dltbutton.style.background = "linear-gradient(to bottom, #e03131, #9b0000)";
    let validbtn = document.createElement("button");
    validbtn.textContent = "Complete";
    validbtn.style.margin = "0px 5px";
    validbtn.classList.add("validbtn");
    validbtn.classList.add("Buttons");
    validbtn.style.background = "linear-gradient(135deg, #51cf66, #2f9e44)";
    td.appendChild(modifybtn);
    td.appendChild(dltbutton);
    td.appendChild(validbtn);
    tr.appendChild(td);
    box.appendChild(tr);
  }
  table.appendChild(box);
}
addToTable(data);
updatedashboard();
AddTaskBtn.addEventListener("click", () => {
  Apopup.style.display = "inline";
});
Addbutton.addEventListener("click", () => {
  let title = ATinput.value;
  let date = new Date(ADinput.value).toISOString();
  let desc = ADDinput.value;
  Apopup.style.display = "none";
  ATinput.value = "";
  ADinput.value = "";
  ADDinput.value = "";
  data.push({
    id: Date.now(),
    title: title,
    date: date,
    status: "Pending",
    desc: desc,
  });
  localStorage.setItem("tasks", JSON.stringify(data));
  updatedashboard();
  addToTable(data);
});
document.querySelector("#ABtnclose").addEventListener("click", () => {
  Apopup.style.display = "none";
});
table.addEventListener("click", (e) => {
  if (e.target.classList.contains("modifybtn")) {
    let tr = e.target.closest("tr");
    Mpopup.style.display = "inline";
    Mtitle.value = tr.dataset.title;
    Mdate.value = new Date(tr.dataset.date).toISOString().slice(0, 16);
    Status.value = tr.dataset.status;
    Mdesc.value = tr.dataset.desc;
    hdninput.setAttribute("data-id", tr.dataset.id);
    updatedashboard();
  }
  if (e.target.classList.contains("deletebtn")) {
    if (confirm("Are You sure")) {
      let id = e.target.closest("tr").dataset.id;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
          data.splice(i, 1);
          break;
        }
      }
      localStorage.setItem("tasks", JSON.stringify(data));
      addToTable(data);
      updatedashboard();
    }
  }
  if (e.target.classList.contains("validbtn")) {
    let id = e.target.closest("tr").dataset.id;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].status = "Completed";
        localStorage.setItem("tasks", JSON.stringify(data));
        addToTable(data);
        break;
      }
    }
    updatedashboard();
  }
});
Mpopup.addEventListener("click", (e) => {
  if (e.target.classList.contains("CloseButton")) {
    Mpopup.style.display = "none";
    Mtitle.value = "";
    Mdate.value = "";
    Status.value = "";
    Mdesc.value = "";
  }
  if (e.target.classList.contains("ModifyButton")) {
    let id = hdninput.dataset.id;
    let title = Mtitle.value;
    let date = Mdate.value;
    let status = Status.value;
    let desc = Mdesc.value;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].title = title;
        data[i].date = date;
        data[i].status = status;
        data[i].desc = desc;
        break;
      }
    }
    addToTable(data);
    updatedashboard();
    Mpopup.style.display = "none";
    Mtitle.value = "";
    Mdate.value = "";
    Status.value = "";
    Mdesc.value = "";
    localStorage.setItem("tasks", JSON.stringify(data));
  }
});
topbar.addEventListener("change", (e) => {
  if (e.target.classList.contains("filter-check")) {
    CPlist();
    if (pCheck.checked && !cCheck.checked) {
      addToTable(pending);
    } else if (!pCheck.checked && cCheck.checked) {
      addToTable(completed);
    } else if (pCheck.checked && cCheck.checked) {
      addToTable([...pending, ...completed]);
    } else {
      addToTable(data);
    }
  }
});
document.querySelector("#notificationd").addEventListener("click", (e) => {
  if (e.target.classList.contains("Closenotif")) {
    document.querySelector("#notificationd").style.display = "none";
  }
});
const searchField = document.querySelector("#searchfield");

searchField.addEventListener("input", () => {
  let value = searchField.value.toLowerCase().trim();
  if (!value) {
    addToTable(data);
  } else {
    let filtered = data.filter((item) => {
     return item.title.toLowerCase().includes(value);
    });

    addToTable(filtered);
  }
});
