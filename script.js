const input = document.getElementById("input");
const addTodoButton = document.getElementById("addbtn");
const todoList = document.getElementById("todolist");

let toDos = [];
window.onload = () => {
            // Load data from local storage
         toDos = JSON.parse(localStorage.getItem('todos')) || [];
            // Load data from cookies as a backup if local storage is empty
            if (toDos.length === 0) {
                const cookieTodos = getCookie('todos');
                toDos = cookieTodos ? JSON.parse(cookieTodos) : [];
            }
            toDos.map(todo => addtodo(todo.text, todo.completed));

            // Load current input value from session storage
            input.value = sessionStorage.getItem('currentInput') || '';
        };

        addTodoButton.addEventListener('click', () => {
            const todoText = input.value.trim();
            if (todoText) {
                const todo = { text: todoText, completed: false };
                toDos.push(todo);
                localStorage.setItem('todos', JSON.stringify(toDos));
                setCookie('todos', JSON.stringify(toDos), 7);
                addtodo(todo.text, todo.completed);
                input.value = '';

                // Clear session storage input value after adding todo
                sessionStorage.removeItem('currentInput');
            }
        });

        // Store current input value in session storage
        input.addEventListener('input', () => {
            sessionStorage.setItem('currentInput', input.value);
        });

        function addtodo(todoText, completed) {
            const li = document.createElement('li');

            // Task text
            const span = document.createElement('span');
            span.innerText = todoText;
            li.appendChild(span);

            if (completed) {
                span.style.textDecoration = 'line-through';
            }

            const button = document.createElement('button');
            button.id = 'delbtn';
            button.innerText = 'Delete';
            li.appendChild(button);
            todoList.appendChild(li);

            // Apply line-through on task text click
            span.addEventListener('click', () => {
                completed = !completed;
                span.style.textDecoration = completed ? 'line-through' : 'none';
                updateTodo(todoText, completed);
            });

            // Remove task on button click
            button.addEventListener('click', () => {
                todoList.removeChild(li);
                remove(todoText);
            });
        }

        function updateTodo(todoText, completed) {
            const index = toDos.findIndex(todo => todo.text === todoText);
            if (index > -1) {
                toDos[index].completed = completed;
            }
            localStorage.setItem('todos', JSON.stringify(toDos));
            setCookie('todos', JSON.stringify(toDos), 7);
        }

        function remove(todoText) {
            const index = toDos.findIndex(todo => todo.text === todoText);
            if (index > -1) {
                toDos.splice(index, 1);
            }
            localStorage.setItem('todos', JSON.stringify(toDos));
            setCookie('todos', JSON.stringify(toDos), 7);
        }

        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

