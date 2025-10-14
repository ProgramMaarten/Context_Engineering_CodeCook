// Todo App JavaScript
// Tasks 4-8: Complete CRUD functionaliteit met inladen bij paginaload

class TodoApp {
    constructor() {
        this.todos = this.getTodosFromStorage();
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        
        this.initEventListeners();
        this.renderTodos(); // Task 8: Laad todos in bij startup
        this.updateTodoCount();
    }

    // Task 4: LocalStorage helper functies
    getTodosFromStorage() {
        try {
            const todos = localStorage.getItem('todoApp');
            return todos ? JSON.parse(todos) : [];
        } catch (error) {
            console.error('Fout bij laden van todos:', error);
            return [];
        }
    }

    saveTodosToStorage() {
        try {
            localStorage.setItem('todoApp', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Fout bij opslaan van todos:', error);
        }
    }

    // Task 5: Nieuwe todo toevoegen aan DOM en opslaan
    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            alert('Voer een taak in!');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(newTodo);
        this.saveTodosToStorage();
        this.renderTodo(newTodo);
        this.clearInput();
        this.updateTodoCount();
    }

    // Task 6: Todo afvinken functionaliteit
    toggleTodoComplete(todoId) {
        const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
        
        if (todoIndex !== -1) {
            this.todos[todoIndex].completed = !this.todos[todoIndex].completed;
            this.saveTodosToStorage();
            
            // Update DOM
            const todoElement = document.querySelector(`[data-id="${todoId}"]`);
            if (todoElement) {
                todoElement.classList.toggle('completed', this.todos[todoIndex].completed);
                const checkbox = todoElement.querySelector('.todo-checkbox');
                checkbox.checked = this.todos[todoIndex].completed;
            }
        }
    }

    // Task 7: Todo verwijderen functionaliteit
    deleteTodo(todoId) {
        if (!confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
            return;
        }

        this.todos = this.todos.filter(todo => todo.id !== todoId);
        this.saveTodosToStorage();
        
        // Verwijder uit DOM
        const todoElement = document.querySelector(`[data-id="${todoId}"]`);
        if (todoElement) {
            todoElement.remove();
        }
        
        this.updateTodoCount();
    }

    // Task 8: Todos inladen bij paginaload
    renderTodos() {
        this.todoList.innerHTML = '';
        
        if (this.todos.length === 0) {
            // Toon lege state (wordt al gestyled door CSS)
            return;
        }

        // Sorteer todos: onvoltooide eerst, dan voltooide
        const sortedTodos = [...this.todos].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        sortedTodos.forEach(todo => this.renderTodo(todo));
    }

    renderTodo(todo) {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.dataset.id = todo.id;
        
        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="edit-btn" title="Bewerken">✏️</button>
                <button class="delete-btn" title="Verwijderen">🗑️</button>
            </div>
        `;

        // Bestaande event listeners voor checkbox en delete
        const checkbox = todoItem.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            this.toggleTodoComplete(todo.id);
        });
        
        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            this.deleteTodo(todo.id);
        });

        // NIEUW: Event listener voor edit knop (placeholder voor nu)
        const editBtn = todoItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            this.enterEditMode(todo.id);
        });

        this.todoList.appendChild(todoItem);
    }

    clearInput() {
        this.todoInput.value = '';
        this.todoInput.focus();
    }

    updateTodoCount() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const remaining = total - completed;
        
        this.todoCount.textContent = `${remaining} van ${total} ${total === 1 ? 'taak' : 'taken'} resterend`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    initEventListeners() {
        // Enter key om todo toe te voegen
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Klik op add button
        this.addBtn.addEventListener('click', () => {
            this.addTodo();
        });
    }

    // NIEUWE METHODE: Enter edit mode
    enterEditMode(todoId) {
        const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const todo = this.todos[todoIndex];
        const todoElement = document.querySelector(`[data-id="${todoId}"]`);
        
        if (!todoElement) return;

        // Bewaar de originele HTML zodat we kunnen annuleren
        todoElement.dataset.originalHtml = todoElement.innerHTML;

        // Transformeer naar edit mode
        todoElement.classList.add('editing');
        todoElement.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(todo.text)}">
            <div class="edit-actions">
                <button class="save-btn" title="Opslaan">💾</button>
                <button class="cancel-btn" title="Annuleren">❌</button>
            </div>
        `;

        // Event listeners voor save en cancel
        const saveBtn = todoElement.querySelector('.save-btn');
        const cancelBtn = todoElement.querySelector('.cancel-btn');
        const editInput = todoElement.querySelector('.edit-input');

        saveBtn.addEventListener('click', () => {
            this.saveEdit(todoId, editInput.value);
        });

        cancelBtn.addEventListener('click', () => {
            this.cancelEdit(todoId);
        });

        // Task 3: Auto-focus en text selection
        editInput.focus();
        editInput.select();
    }

    // TIJDELIJKE METHODES - worden in Fase 3 afgemaakt
    saveEdit(todoId, newText) {
        console.log('Opslaan:', todoId, newText);
        // Voor nu: gewoon terug naar normale mode
        this.cancelEdit(todoId);
    }

    cancelEdit(todoId) {
        const todoElement = document.querySelector(`[data-id="${todoId}"]`);
        if (!todoElement || !todoElement.dataset.originalHtml) return;

        // Herstel de originele HTML
        todoElement.classList.remove('editing');
        todoElement.innerHTML = todoElement.dataset.originalHtml;
        delete todoElement.dataset.originalHtml;

        // Her-attach event listeners voor de herstelde knoppen
        this.reattachEventListeners(todoElement);
    }

    // Helper om event listeners opnieuw te attachen
    reattachEventListeners(todoElement) {
        const todoId = parseInt(todoElement.dataset.id);
        const checkbox = todoElement.querySelector('.todo-checkbox');
        const editBtn = todoElement.querySelector('.edit-btn');
        const deleteBtn = todoElement.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            this.toggleTodoComplete(todoId);
        });

        editBtn.addEventListener('click', () => {
            this.enterEditMode(todoId);
        });

        deleteBtn.addEventListener('click', () => {
            this.deleteTodo(todoId);
        });
    }
}

// Start de app wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});