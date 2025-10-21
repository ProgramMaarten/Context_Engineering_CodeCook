// Compact, annotated TodoApp
// Preserves original behaviors: add/edit/clear, deadline normalization (default date/time),
// drag & drop reordering, sort-by-deadline (view-only), visual states (overdue/due-soon/no-deadline).

class TodoApp {
  constructor() {
    // Core state + DOM refs
    this.todos = this._load().map(t => Object.assign({ deadline: null }, t));
    this.todoInput = document.getElementById('todoInput');
    this.deadlineInput = document.getElementById('todo-deadline');
    this.deadlineError = document.getElementById('deadline-error');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.todoCount = document.getElementById('todoCount');
    this.sortToggle = document.getElementById('sort-deadline-toggle');
    this.sortByDeadline = false; // transient view only

    this._attachGlobalHandlers();
    this._attachListDrop();
    this._setDefaultDeadlineInput();
    this.renderTodos();
  }

  /* ---------- Persistence ---------- */
  _load() {
    try {
      return JSON.parse(localStorage.getItem('todoApp') || '[]');
    } catch (e) {
      return [];
    }
  }

  _save() {
    try {
      localStorage.setItem('todoApp', JSON.stringify(this.todos));
    } catch (e) {}
  }

  /* ---------- Helpers: formatting & normalization ---------- */
  // return 'YYYY-MM-DDTHH:MM' (datetime-local) given ISO or ''
  isoToDatetimeLocal(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Accepts 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM...' and returns datetimelocal with default time 23:59
  normalizeDatetimeLocal(raw) {
    if (!raw) return '';
    // date-only YYYY-MM-DD -> append 23:59
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T23:59`;
    const m = raw.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
    if (!m) return raw;
    const [, , hh, mm] = m.map(x => x);
    // if time is 00:00 normalize to 23:59
    if (Number(hh) === 0 && Number(mm) === 0) return `${m[1]}T23:59`;
    return `${m[1]}T${hh}:${mm}`;
  }

  // Basic accept check for date-only or datetime-local
  isValidDatetimeLocal(v) {
    return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?)?$/.test(v);
  }

  // Compute visual state class for an ISO deadline
  computeVisualState(deadlineIso) {
    if (!deadlineIso) return 'no-deadline';
    const now = new Date(), d = new Date(deadlineIso);
    if (isNaN(d)) return 'no-deadline';
    const diff = (d - now) / (1000 * 60 * 60); // hours
    if (d - now < 0) return 'overdue';
    if (diff <= 48) return 'due-soon';
    return '';
  }

  /* ---------- UI rendering ---------- */
  renderTodos() {
    this.todoList.innerHTML = '';
    let list = this.todos.slice();
    if (this.sortByDeadline) list.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    list.forEach(t => this._renderTodoItem(t));
    this._updateCount();
  }

  // Minimal, focused item render that re-attaches only needed handlers
  _renderTodoItem(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    const vs = this.computeVisualState(todo.deadline);
    if (vs) li.classList.add(vs);
    li.dataset.id = todo.id;
    li.draggable = true;
    li.innerHTML = `
      <span class="drag-handle">☰</span>
      <input class="todo-checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-text">${this._esc(todo.text)}</span>
      <span class="todo-deadline">${this._esc(this._formatDeadline(todo.deadline))}</span>
      <div class="todo-actions">
        <button class="edit-btn">✏️</button> <button class="delete-btn">🗑️</button>
      </div>
    `;

    // handlers
    li.querySelector('.todo-checkbox').addEventListener('change', () =>
      this._toggleComplete(todo.id)
    );
    li.querySelector('.delete-btn').addEventListener('click', () => this._delete(todo.id));
    li.querySelector('.edit-btn').addEventListener('click', () => this._enterEdit(todo.id));

    // drag handlers
    li.addEventListener('dragstart', (e) => {
      try { e.dataTransfer.setData('text/plain', String(todo.id)); } catch {}
      li.classList.add('dragging');
      this.draggedId = todo.id;
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      delete this.draggedId;
      this._clearDragOver();
    });
    ['dragover', 'dragenter'].forEach(ev => li.addEventListener(ev, e => {
      e.preventDefault();
      li.classList.add('drag-over');
    }));
    li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
    li.addEventListener('drop', (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = e.dataTransfer.getData('text/plain') || this.draggedId;
      if (!id) return;
      const from = this.todos.findIndex(x => x.id == Number(id));
      let to = this.todos.findIndex(x => x.id == todo.id);
      if (to === -1 || from === -1) return;
      const rect = li.getBoundingClientRect();
      if (!(e.clientY < rect.top + rect.height / 2)) to++;
      const finalIndex = from < to ? to - 1 : to;
      if (from !== finalIndex) {
        this._move(from, finalIndex);
        this._saveAndRender();
      } else this._clearDragOver();
    });

    this.todoList.appendChild(li);
  }

  /* ---------- Small UI helpers ---------- */
  _formatDeadline(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    if (isNaN(d)) return '--';
    try {
      return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) { return d.toLocaleString(); }
  }

  _esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML }

  _updateCount() {
    const total = this.todos.length, done = this.todos.filter(t => t.completed).length;
    this.todoCount.textContent = `${total - done} van ${total} ${total === 1 ? 'taak' : 'taken'} resterend`;
  }

  _clearDragOver() { this.todoList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')) }

  /* ---------- Core actions (short, descriptive names) ---------- */
  _add() {
    const text = this.todoInput.value.trim();
    if (!text) { alert('Voer een taak in!'); return }
    // determine deadline ISO: user value normalized, empty -> tomorrow 23:59, invalid -> block
    let raw = this.deadlineInput ? this.deadlineInput.value : '';
    if (raw && !this.isValidDatetimeLocal(raw)) {
      this.deadlineError && (this.deadlineError.style.display = 'block');
      this.deadlineError && (this.deadlineError.textContent = 'Ongeldige datum/tijd');
      return;
    }
    this.deadlineError && (this.deadlineError.style.display = 'none');
    let deadlineIso = raw ? new Date(this.normalizeDatetimeLocal(raw)).toISOString() : (() => {
      const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(23, 59, 0, 0); return t.toISOString();
    })();
    this.todos.push({ id: Date.now(), text, completed: false, createdAt: new Date().toISOString(), deadline: deadlineIso });
    this._saveAndRender(); this._setDefaultDeadlineInput(); this.todoInput.value = ''; this.todoInput.focus();
  }

  _toggleComplete(id) { const i = this.todos.findIndex(t => t.id === id); if (i === -1) return; this.todos[i].completed = !this.todos[i].completed; this._saveAndRender() }
  _delete(id) { this.todos = this.todos.filter(t => t.id !== id); this._saveAndRender() }
  _move(from, to) { if (from < 0 || to < 0 || from === to) return; const [item] = this.todos.splice(from, 1); this.todos.splice(to, 0, item) }

  _saveAndRender() { this._save(); this.renderTodos() }

  /* ---------- Edit flow (small, in-place) ---------- */
  _enterEdit(id) {
    const i = this.todos.findIndex(t => t.id === id); if (i === -1) return;
    const todo = this.todos[i];
    const el = this.todoList.querySelector(`[data-id="${id}"]`);
    if (!el) return; el.dataset.originalHtml = el.innerHTML; el.classList.add('editing');
    const value = this.isoToDatetimeLocal(todo.deadline);
    el.innerHTML = `
      <input class="edit-input" value="${this._esc(todo.text)}">
      <input class="edit-deadline-input" type="datetime-local" value="${this._esc(value)}">
      <div class="edit-actions">
        <button class="save-btn">💾</button> <button class="cancel-btn">❌</button> <button class="clear-deadline-btn">🗑️</button>
      </div>
      <div class="edit-deadline-error" style="display:none;color:#d9534f;margin-top:6px">Ongeldige datum/tijd</div>
    `;

    const saveBtn = el.querySelector('.save-btn'), cancelBtn = el.querySelector('.cancel-btn'),
      clearBtn = el.querySelector('.clear-deadline-btn'), input = el.querySelector('.edit-input'),
      dl = el.querySelector('.edit-deadline-input'), dlErr = el.querySelector('.edit-deadline-error');
    input.maxLength = 100;
    saveBtn.addEventListener('click', () => {
      const newText = input.value.trim();
      if (!newText) { alert('Todo mag niet leeg zijn!'); return }
      if (dl && dl.value && !this.isValidDatetimeLocal(dl.value)) { dlErr.style.display = 'block'; dlErr.textContent = 'Ongeldige datum/tijd'; return }
      dlErr.style.display = 'none';
      const norm = dl && dl.value ? new Date(this.normalizeDatetimeLocal(dl.value)).toISOString() : null;
      this.todos[i].text = newText; this.todos[i].deadline = norm; this._saveAndRender();
    });
    cancelBtn.addEventListener('click', () => {
      if (!el.dataset.originalHtml) return; el.classList.remove('editing'); el.innerHTML = el.dataset.originalHtml; this._reattach(el);
    });
    clearBtn.addEventListener('click', () => { if (dl) dl.value = ''; if (dlErr) dlErr.style.display = 'none' });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveBtn.click() } else if (e.key === 'Escape') { cancelBtn.click() } });
    setTimeout(() => { try { input.focus(); input.select() } catch (e) {} }, 0);
  }

  _reattach(el) { const id = Number(el.dataset.id); el.querySelector('.todo-checkbox').addEventListener('change', () => this._toggleComplete(id)); el.querySelector('.edit-btn').addEventListener('click', () => this._enterEdit(id)); el.querySelector('.delete-btn').addEventListener('click', () => this._delete(id)); }

  /* ---------- Wiring ---------- */
  _attachGlobalHandlers() {
    this.todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); this._add() } });
    this.addBtn.addEventListener('click', () => this._add());
    if (this.sortToggle) this.sortToggle.addEventListener('change', e => { this.sortByDeadline = !!e.target.checked; this.renderTodos() });
  }

  _attachListDrop() {
    if (this._listDragHandlersAttached) return;
    this.todoList.addEventListener('dragover', e => e.preventDefault());
    this.todoList.addEventListener('drop', e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain') || this.draggedId;
      if (!id) return;
      const from = this.todos.findIndex(x => x.id == Number(id));
      if (from === -1) return;
      const [moved] = this.todos.splice(from, 1);
      this.todos.push(moved);
      this._saveAndRender();
    });
    this._listDragHandlersAttached = true;
  }

  _setDefaultDeadlineInput() { if (!this.deadlineInput) return; const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(23, 59, 0, 0); this.deadlineInput.value = this.isoToDatetimeLocal(t.toISOString()) }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => { window.todoApp = new TodoApp(); });