const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTasks);
taskList.addEventListener('click', doneTasks);

function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    tasks.push(newTask);

    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();
    checkEmptyList();
    saveToLocalStorage();
}

function deleteTasks(event) {
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('li');

        const id = Number(parentNode.id);

        // Находим индекс задачи в массиве
        const index = tasks.findIndex((task) => {
            return task.id === id;
        });

        // Удаляем задачу из массива с задачами
        tasks.splice(index, 1);

        // Удаляем задачу из разметки
        parentNode.remove();
    }
    checkEmptyList();
    saveToLocalStorage();
}

function doneTasks(event) {
    if (event.target.dataset.action !== 'done') return;
    const parentNode = event.target.closest('li');

    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
    saveToLocalStorage();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img
                    src="./img/leaf.svg"
                    alt="Empty"
                    width="48"
                    class="mt-3"
                />
                <div class="empty-list__title">Список дел пуст</div>
            </li>`;

        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `<li
        id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button
                type="button"
                data-action="done"
                class="btn-action">
                <img
                    src="./img/tick.svg"
                    alt="Done"
                    width="18"
                    height="18"/>
            </button>
            <button
                type="button"
                data-action="delete"
                class="btn-action">
                <img
                    src="./img/cross.svg"
                    alt="Done"
                    width="18"
                    height="18"/>
            </button>
        </div>
    </li>`;
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}
