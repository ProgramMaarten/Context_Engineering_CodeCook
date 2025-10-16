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

        // NIEUW: allow dropping on the list container (drop-to-end). Guard so we attach once.
        if (!this._listDragHandlersAttached) {
            this.todoList.addEventListener('dragover', (e) => e.preventDefault());
            this.todoList.addEventListener('drop', (e) => {
                e.preventDefault();
                const idFromData = e.dataTransfer.getData('text/plain');
                const draggedId = idFromData ? Number(idFromData) : this.draggedId;
                if (!draggedId) return;
                const fromIndex = this.todos.findIndex(t => t.id === draggedId);
                if (fromIndex === -1) return;
                // move item to end
                const [moved] = this.todos.splice(fromIndex, 1);
                this.todos.push(moved);
                this.saveTodosToStorage();
                this.renderTodos();
            });
            this._listDragHandlersAttached = true;
        }

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
        // Direct delete (no confirmation): verwijder het item uit het data model en localStorage
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
        // Clear huidige lijst
        this.todoList.innerHTML = '';

        // Render todos in de exacte volgorde zoals opgeslagen in this.todos
        // (Geen automatische sortering - respecteer handmatige order)
        this.todos.forEach(todo => {
            this.renderTodo(todo);
        });

        // Update teller
        this.updateTodoCount();
    }

    renderTodo(todo) {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        // data-id aanwezig voor drag/drop en andere handlers
        todoItem.dataset.id = todo.id;
        // draggable attribute toegevoegd eerder
        todoItem.setAttribute('draggable', 'true');

        todoItem.innerHTML = `
            <span class="drag-handle" title="Versleep om te ordenen">☰</span>
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

        const editBtn = todoItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            this.enterEditMode(todo.id);
        });

        // NIEUW: dragstart / dragend handlers (reused)
        todoItem.addEventListener('dragstart', (e) => {
            try {
                e.dataTransfer.setData('text/plain', String(todo.id));
                e.dataTransfer.effectAllowed = 'move';
            } catch (err) {
                // fallback: store on instance
            }
            todoItem.classList.add('dragging');
            this.draggedId = todo.id;
        });

        todoItem.addEventListener('dragend', () => {
            todoItem.classList.remove('dragging');
            delete this.draggedId;
            const over = this.todoList.querySelectorAll('.drag-over');
            over.forEach(el => el.classList.remove('drag-over'));
        });

        // NIEUW: dragover / dragenter / dragleave handlers (visuals)
        todoItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            todoItem.classList.add('drag-over');
        });

        todoItem.addEventListener('dragenter', (e) => {
            e.preventDefault();
            todoItem.classList.add('drag-over');
        });

        todoItem.addEventListener('dragleave', () => {
            todoItem.classList.remove('drag-over');
        });

        // NIEUW: drop handler - bepaal index en werk model bij
        todoItem.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation(); // <-- voorkom dat de lijst-drop handler ook afgaat
            const idFromData = e.dataTransfer.getData('text/plain');
            const draggedId = idFromData ? Number(idFromData) : this.draggedId;
            if (!draggedId) return;

            const fromIndex = this.todos.findIndex(t => t.id === draggedId);
            const targetId = todo.id;
            let toIndex = this.todos.findIndex(t => t.id === targetId);
            if (toIndex === -1 || fromIndex === -1) return;

            // bepaal of drop boven of onder de helft van target viel
            const rect = todoItem.getBoundingClientRect();
            const insertBefore = e.clientY < rect.top + rect.height / 2;
            if (!insertBefore) toIndex = toIndex + 1;

            // no-op checks: if moving to same spot
            if (fromIndex === toIndex || fromIndex === toIndex - 1) {
                // cleanup visuals
                const over = this.todoList.querySelectorAll('.drag-over');
                over.forEach(el => el.classList.remove('drag-over'));
                return;
            }

            // gebruik centrale helper voor verplaatsen (Task: Logica)
            const finalIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
            this.moveTodo(fromIndex, finalIndex);

            // persist en her-render
            this.saveTodosToStorage();
            this.renderTodos();
        });

        // Voeg het todoItem toe aan de lijst
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
        // Enter key om todo toe te voegen (use keydown for better compatibility)
        this.todoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
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

        // Enforce same maxlength as the main input to avoid very long todos
        editInput.maxLength = 100;

        saveBtn.addEventListener('click', () => {
            this.saveEdit(todoId, editInput.value);
        });

        cancelBtn.addEventListener('click', () => {
            this.cancelEdit(todoId);
        });

        // Keyboard support for edit mode: Enter = save, Escape = cancel
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveEdit(todoId, editInput.value);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cancelEdit(todoId);
            }
        });

        // Task 3: Auto-focus en text selection
        // Use setTimeout to ensure element is in the DOM and focusable in all browsers
        setTimeout(() => {
            try {
                editInput.focus();
                editInput.select();
            } catch (err) {
                // silent fallback if focus fails for some reason
            }
        }, 0);
    }

    // MET deze complete implementatie:
    saveEdit(todoId, newText) {
        const trimmedText = newText.trim();
        
        // Task 4: Input validation (basis)
        if (trimmedText === '') {
            alert('Todo mag niet leeg zijn!');
            return; // Stop hier als de todo leeg is
        }

        const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        // Update de tekst in het data model
        this.todos[todoIndex].text = trimmedText;
        
        // Task 3: LocalStorage bijwerken
        this.saveTodosToStorage();
        
        // DOM updaten met nieuwe tekst
        this.updateTodoInDOM(todoId, trimmedText);
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

    // NIEUWE METHODE: Update todo in DOM na edit
    updateTodoInDOM(todoId, newText) {
        const todoElement = document.querySelector(`[data-id="${todoId}"]`);
        if (!todoElement) return;

        // Verlaat edit mode en herstel normale view
        todoElement.classList.remove('editing');
        
        // Herstel de normale structuur met bijgewerkte tekst
        const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
        const todo = this.todos[todoIndex];
        
        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(newText)}</span>
            <div class="todo-actions">
                <button class="edit-btn" title="Bewerken">✏️</button>
                <button class="delete-btn" title="Verwijderen">🗑️</button>
            </div>
        `;

        // Her-attach event listeners
        this.reattachEventListeners(todoElement);
    }

    // NIEUWE HELPER: verplaats item binnen this.todos via splice & insert
    moveTodo(fromIndex, toIndex) {
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return false;
        const [moved] = this.todos.splice(fromIndex, 1);
        if (moved) {
            this.todos.splice(toIndex, 0, moved);
            return true;
        }
        return false;
    }
}

// Start de app wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});