const inputForm = document.querySelector('.input_form');
const addButton = document.querySelector('.add');
const toDoList = document.querySelector('.todo');
const sortElement = document.querySelector('.sort_todos');

document.addEventListener('DOMContentLoaded', getTasks);
addButton.addEventListener('click', createTask);
inputForm.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') return createTask(event);
});
toDoList.addEventListener('click', editTask);
toDoList.addEventListener('click', checkTask);
toDoList.addEventListener('click', deleteTask);
sortElement.addEventListener('click', filterTasks);

function createTask(event) {
    event.preventDefault();
    if (inputForm.value) {
        const taskArea = document.createElement('div');
        taskArea.className = 'task_area';

        const task = document.createElement('p');
        task.innerText = inputForm.value;
        task.className = 'todo_task';
        taskArea.appendChild(task);

        const doneButton = document.createElement('div');
        doneButton.className = 'btn_done';
        doneButton.innerHTML = '<i class="material-icons">done</i>'
        taskArea.insertBefore(doneButton, task);

        const deadline = document.createElement('input');
        deadline.type = 'date';
        taskArea.appendChild(deadline);
        deadline.style.display = 'none';

        const deadlineButton = document.createElement('div');
        deadlineButton.className = 'deadline_btn';
        deadlineButton.innerHTML = '<i class="material-icons">date_range</i>'
        deadlineButton.addEventListener('click', () => {
            deadline.style.display = 'flex';
            deadlineButton.style.display = 'none';
            deadline.addEventListener('keyup', (event) => {
                if (event.code === 'Enter') {
                    if (deadline.value !== '') {
                        console.log(deadline.value)
                        const deadlineElem = document.createElement('div');
                        taskArea.classList.add('deadline_elem');
                        deadlineElem.innerText = deadline.value;
                        taskArea.insertBefore(deadlineElem, delButton);
                        deadline.style.display = 'none';
                        const taskID = getTaskID(task.innerText);
                        deadlineLocalTasks(deadline.value, taskID);
                    } else {
                        deadline.style.display = 'none';
                        deadlineButton.style.display = 'flex';
                    }
                }
            });
        });
        taskArea.appendChild(deadlineButton);


        const delButton = document.createElement('div');
        delButton.className = 'btn_delete';
        delButton.innerHTML = '<i class="material-icons">delete</i>';
        taskArea.appendChild(delButton);

        toDoList.appendChild(taskArea);

        const taskObj = {
            value: inputForm.value,
            status: taskArea.className,
            deadline: deadline.value
        }
        saveData(taskObj);
        inputForm.value = '';
    }
}
function editTask(event) {
    const item = event.target;
    if(item.classList[0] === 'todo_task') {
        const taskID = getTaskID(item.innerText);
        item.setAttribute('contenteditable', 'true');
        item.focus();
        item.addEventListener('keydown', (event) => {
            if (event.code === 'Enter') {
                editLocalTasks(item.innerText, taskID);
                item.blur();
            }
        })
    }
}
function checkTask(event) {
    const item = event.target;
    if(item.classList[0] === 'btn_done') {
        console.log('completed')
        item.parentElement.classList.toggle('completed');
        console.log(item.parentElement)
        checkLocalTasks(item.parentElement);
    }
}
function deleteTask(event) {
    const item = event.target;

    if(item.classList[0] === 'btn_delete') {
        deleteLocalTasks(item.parentElement);
        item.parentElement.remove()
    }
}
function filterTasks(event) {
    const tasks = toDoList.childNodes;
    tasks.forEach(function (task) {
        switch (event.target.value) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                if (task.classList.contains('completed')) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!task.classList.contains('completed')) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
            case 'deadline':
                if (task.classList.contains('deadline_elem')) {
                    console.log('deadline');
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
        }
    });
}

function checkData() {
    let array;
    if (localStorage.getItem('todos') === null) {
        array = [];
    } else {
        array = JSON.parse(localStorage.getItem('todos'));
    }
    return array;
}
function saveData(task){
    let tasks = checkData();
    tasks.push(task);
    localStorage.setItem('todos', JSON.stringify(tasks));
}
function getTasks() {
    let tasks = checkData();

    tasks.forEach(function (todo) {
        const taskArea = document.createElement('div');
        taskArea.className = todo.status;

        const task = document.createElement('p');
        task.innerText = todo.value;
        task.className = 'todo_task';
        taskArea.appendChild(task);

        const doneButton = document.createElement('div');
        doneButton.className = 'btn_done';
        doneButton.innerHTML = '<i class="material-icons">done</i>'
        taskArea.insertBefore(doneButton, task);

        const delButton = document.createElement('div');
        delButton.className = 'btn_delete';
        delButton.innerHTML = '<i class="material-icons">delete</i>';
        taskArea.appendChild(delButton);

        if (todo.deadline.length !== 0) {
            const deadlineElem = document.createElement('div');
            taskArea.classList.add('deadline_elem');
            deadlineElem.innerText = todo.deadline;
            taskArea.insertBefore(deadlineElem, delButton);
        } else {
            const deadline = document.createElement('input');
            deadline.type = 'date';
            taskArea.insertBefore(deadline, delButton);
            deadline.style.display = 'none';

            const deadlineButton = document.createElement('div');
            deadlineButton.className = 'deadline_btn';
            deadlineButton.innerHTML = '<i class="material-icons">date_range</i>'
            deadlineButton.addEventListener('click', () => {
                deadline.style.display = 'flex';
                deadlineButton.style.display = 'none';
                deadline.addEventListener('keyup', (event) => {
                    if (event.code === 'Enter') {
                        if (deadline.value !== '') {
                            console.log(deadline.value)
                            const deadlineElem = document.createElement('div');
                            taskArea.classList.add('deadline_elem');
                            deadlineElem.innerText = deadline.value;
                            taskArea.insertBefore(deadlineElem, delButton);
                            deadline.style.display = 'none';
                            const taskID = getTaskID(task.innerText);
                            deadlineLocalTasks(deadline.value, taskID);
                        } else {
                            deadline.style.display = 'none';
                            deadlineButton.style.display = 'flex';
                        }
                    }
                });
            });
            taskArea.insertBefore(deadlineButton, delButton);
        }

        toDoList.appendChild(taskArea);
    })
}
function editLocalTasks(task, id) {
    let tasks = checkData();
    if (tasks[id].value !== task) {
        tasks[id].value = task;
    }
    localStorage.setItem('todos', JSON.stringify(tasks));
}
function checkLocalTasks(task) {
    let tasks = checkData();
    const taskID = getTaskID(task.children[1].innerText);
    if (tasks[taskID].status !== 'task_area completed' && task.classList.contains('completed')) {
        tasks[taskID].status = 'task_area completed';
    } else {
        tasks[taskID].status = 'task_area';
    }
    localStorage.setItem('todos', JSON.stringify(tasks));
}
function deleteLocalTasks(task) {
    let tasks = checkData();
    const taskID = getTaskID(task.children[0].innerText);
    tasks.splice(taskID, 1);
    localStorage.setItem('todos', JSON.stringify(tasks));
}
function deadlineLocalTasks(deadline, id) {
    let tasks = checkData();
    if (tasks[id].deadline === '' && deadline !== '') {
        tasks[id].deadline = deadline;
    }
    localStorage.setItem('todos', JSON.stringify(tasks));
}
function getTaskID(task) {
    let tasks = checkData();
    let id;
    tasks.forEach(item => {
        if (item.value === task) {
            id = tasks.indexOf(item);
        }
    });

    return id;
}