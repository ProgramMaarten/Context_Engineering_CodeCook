// Todo App JavaScript
// Tasks 4-8: Complete CRUD functionaliteit met inladen bij paginaload

class TodoApp {
    constructor() {
    this.todos = this.getTodosFromStorage();
    // Normaliseer het model: zorg dat elk todo-object een `deadline` property heeft (optioneel)
    this.todos = this.todos.map(t => Object.assign({ deadline: null }, t));
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
    this.deadlineInput = document.getElementById('todo-deadline');
    this.deadlineError = document.getElementById('deadline-error');
    this.todoList = document.getElementById('todoList');
    this.todoCount = document.getElementById('todoCount');
    this.sortToggle = document.getElementById('sort-deadline-toggle');
    this.sortByDeadline = false; // transient view only
        
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

        // Lees deadline value (datetime-local) en normaliseer naar ISO of null
        let deadlineIso = null;
        try {
            const raw = this.deadlineInput ? this.deadlineInput.value : '';
            if (raw) {
                // basic validation for datetime-local format
                if (!this.isValidDatetimeLocal(raw)) {
                    if (this.deadlineError) {
                        this.deadlineError.style.display = 'block';
                        this.deadlineError.textContent = 'Ongeldige datum/tijd';
                    }
                    return; // blokkeer toevoegen
                } else {
                    if (this.deadlineError) this.deadlineError.style.display = 'none';
                }

                // Normalize to include default time when user omitted it or entered midnight
                const normalized = this.normalizeDatetimeLocal(raw);
                const parsed = new Date(normalized);
                if (!isNaN(parsed)) {
                    deadlineIso = parsed.toISOString();
                }
            } else {
                // If user left the deadline empty, default to tomorrow at 23:59
                if (this.deadlineError) this.deadlineError.style.display = 'none';
                const t = new Date();
                t.setDate(t.getDate() + 1);
                t.setHours(23, 59, 0, 0);
                deadlineIso = t.toISOString();
            }
        } catch (err) {
            deadlineIso = null;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            // nieuw veld: deadline (ISO datetime string) — wordt gevuld wanneer de gebruiker een deadline kiest
            deadline: deadlineIso
        };

        this.todos.push(newTodo);
        this.saveTodosToStorage();
        this.renderTodo(newTodo);
        this.clearInput();
        this.updateTodoCount();
    }

    // Validate a datetime-local string (basic check: pattern and parsable)
    isValidDatetimeLocal(value) {
        if (!value || typeof value !== 'string') return false;
        // Accept either date-only YYYY-MM-DD or full YYYY-MM-DDTHH:MM(:SS)
        const re = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?)?$/;
        if (!re.test(value)) return false;
        const parsed = new Date(value);
        return !isNaN(parsed.getTime());
    }

    // Normalize a datetime-local input string: if user provided date-only or time is 00:00,
    // default the time to 23:59 for that date. Returns a datetime-local string 'YYYY-MM-DDTHH:MM' or ''
    normalizeDatetimeLocal(raw) {
        if (!raw || typeof raw !== 'string') return '';
        // If it's just a date (YYYY-MM-DD), append 23:59
        const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
        if (dateOnly) return `${raw}T23:59`;

        const m = raw.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (!m) return raw; // unknown format - return as-is for validation to catch

        const datePart = m[1];
        const hour = Number(m[2]);
        const minute = Number(m[3]);
        // If time is exactly 00:00, default to 23:59
        if (hour === 0 && minute === 0) {
            return `${datePart}T23:59`;
        }

        // preserve provided time (drop seconds if present for consistency)
        return `${datePart}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
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

        // Decide welke lijst we renderen: originele this.todos (persistent order)
        // of een transient view gesorteerd op deadline (geen wijziging van this.todos)
        let listToRender = this.todos.slice();
        if (this.sortByDeadline) {
            listToRender.sort((a, b) => {
                if (!a.deadline && !b.deadline) return 0;
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
        }

        listToRender.forEach(todo => {
            this.renderTodo(todo);
        });

        // Update teller
        this.updateTodoCount();
    }

    // Helper: format deadline ISO string to locale short datetime or return '--'
    formatDeadline(deadlineIso) {
        if (!deadlineIso) return '--';
        const d = new Date(deadlineIso);
        if (isNaN(d)) return '--';
        // locale short date + time (fallback simple formatting)
        try {
            return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
        } catch (err) {
            return d.toLocaleString();
        }
    }

    // Convert ISO datetime (UTC) to a local 'YYYY-MM-DDTHH:MM' string for datetime-local input
    isoToDatetimeLocal(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d)) return '';
        const pad = (n) => String(n).padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    renderTodo(todo) {
        // Format deadline for display
        const deadlineText = this.formatDeadline ? this.formatDeadline(todo.deadline) : (todo.deadline ? todo.deadline : '--');
        const todoItem = document.createElement('li');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    // visual state classes will be appended based on deadline vs now
    const visualState = this.computeVisualState(todo.deadline);
    if (visualState) todoItem.classList.add(visualState);
        // data-id aanwezig voor drag/drop en andere handlers
        todoItem.dataset.id = todo.id;
        // draggable attribute toegevoegd eerder
        todoItem.setAttribute('draggable', 'true');

        todoItem.innerHTML = `
            <span class="drag-handle" title="Versleep om te ordenen">☰</span>
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <span class="todo-deadline">${this.escapeHtml(deadlineText)}</span>
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
        if (this.deadlineInput) {
            // Prefill the deadline input with tomorrow 23:59 as a friendly default
            const t = new Date();
            t.setDate(t.getDate() + 1);
            t.setHours(23, 59, 0, 0);
            this.deadlineInput.value = this.isoToDatetimeLocal(t.toISOString());
        }
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

        // Sorteer toggle
        if (this.sortToggle) {
            this.sortToggle.addEventListener('change', (e) => {
                this.sortByDeadline = !!e.target.checked;
                this.renderTodos();
            });
        }
    }

    // Compute visual state based on deadline: 'overdue', 'due-soon', 'no-deadline' or ''
    computeVisualState(deadlineIso) {
        if (!deadlineIso) return 'no-deadline';
        const now = new Date();
        const d = new Date(deadlineIso);
        if (isNaN(d)) return 'no-deadline';
        const diffMs = d - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffMs < 0) return 'overdue';
        if (diffHours <= 48) return 'due-soon';
        return '';
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
        // Prefill deadline in datetime-local format
        const deadlineInputValue = this.isoToDatetimeLocal(todo.deadline);
        todoElement.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(todo.text)}">
            <input type="datetime-local" class="edit-deadline-input" value="${this.escapeHtml(deadlineInputValue)}">
            <div class="edit-actions">
                <button class="save-btn" title="Opslaan">💾</button>
                <button class="cancel-btn" title="Annuleren">❌</button>
                <button class="clear-deadline-btn" title="Clear deadline">🗑️</button>
            </div>
            <div class="edit-deadline-error" style="display:none;color:#d9534f;margin-top:6px">Ongeldige datum/tijd</div>
        `;

        // Event listeners voor save en cancel
        const saveBtn = todoElement.querySelector('.save-btn');
        const cancelBtn = todoElement.querySelector('.cancel-btn');
        const editInput = todoElement.querySelector('.edit-input');

        // Enforce same maxlength as the main input to avoid very long todos
        editInput.maxLength = 100;

        saveBtn.addEventListener('click', () => {
            this.saveEdit(todoId);
        });

        cancelBtn.addEventListener('click', () => {
            this.cancelEdit(todoId);
        });

        // Keyboard support for edit mode: Enter = save, Escape = cancel
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveEdit(todoId);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cancelEdit(todoId);
            }
        });

        // Clear deadline button
        const clearBtn = todoElement.querySelector('.clear-deadline-btn');
        const editDeadlineInput = todoElement.querySelector('.edit-deadline-input');
        const editDeadlineError = todoElement.querySelector('.edit-deadline-error');
        clearBtn.addEventListener('click', () => {
            if (editDeadlineInput) editDeadlineInput.value = '';
            if (editDeadlineError) editDeadlineError.style.display = 'none';
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
        // If newText not provided, read values from DOM
        const todoElement = document.querySelector(`[data-id="${todoId}"]`);
        if (!todoElement) return;

        const editInput = todoElement.querySelector('.edit-input');
        const editDeadlineInput = todoElement.querySelector('.edit-deadline-input');
        const editDeadlineError = todoElement.querySelector('.edit-deadline-error');

        const trimmedText = editInput ? editInput.value.trim() : '';
        
        // Task 4: Input validation (basis)
        if (trimmedText === '') {
            alert('Todo mag niet leeg zijn!');
            return; // Stop hier als de todo leeg is
        }

        const todoIndex = this.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;
        // Update de tekst in het data model
        this.todos[todoIndex].text = trimmedText;

        // Read deadline from edit input and validate
        let deadlineIso = null;
        if (editDeadlineInput && editDeadlineInput.value) {
            const raw = editDeadlineInput.value;
            if (!this.isValidDatetimeLocal(raw)) {
                if (editDeadlineError) {
                    editDeadlineError.style.display = 'block';
                    editDeadlineError.textContent = 'Ongeldige datum/tijd';
                }
                return; // do not save if invalid
            } else {
                if (editDeadlineError) editDeadlineError.style.display = 'none';
                const normalized = this.normalizeDatetimeLocal(raw);
                const parsed = new Date(normalized);
                if (!isNaN(parsed)) deadlineIso = parsed.toISOString();
            }
        } else {
            // cleared
            deadlineIso = null;
        }

        this.todos[todoIndex].deadline = deadlineIso;

        // Sla op en render opnieuw
        this.saveTodosToStorage();
        this.renderTodos();
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

        // Reset classes and apply visual state
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        const visualState = this.computeVisualState(todo.deadline);
        if (visualState) todoElement.classList.add(visualState);

        todoElement.dataset.id = todo.id;

        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(newText)}</span>
            <span class="todo-deadline">${this.escapeHtml(this.formatDeadline(todo.deadline))}</span>
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