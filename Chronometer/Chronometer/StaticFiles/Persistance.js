const route = "../api/chronometer";
let connection = new signalR.HubConnectionBuilder().withUrl('../chats').build();
connection.start().then(() => { console.log('connected'); }).catch((err) => { console.log(err); })


connection.on("Add", (model) => {
    let messagesUl = document.querySelector('.messages-ul');
    let newEl = document.createElement('li');
    newEl.innerHTML = `Added timer:  ${model.id}`;
    messagesUl.appendChild(newEl);

    AddChronometer(model);
})

connection.on("Update", (model) => {
    let messagesUl = document.querySelector('.messages-ul');
    let newEl = document.createElement('li');
    newEl.innerHTML = `Updated timer:  ${model.id}`;
    messagesUl.appendChild(newEl);

    UpdateChronometerState(model);
})

connection.on("Delete", (id) => {
    let messagesUl = document.querySelector('.messages-ul');
    let newEl = document.createElement('li');
    newEl.innerHTML = `Deleted timer: ${id}`;
    messagesUl.appendChild(newEl);

    RemoveChronometer(id);
})