async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos.php?user_id=${currentUserId}`);
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error loading todos:', error);
        const cached = localStorage.getItem(`todos_${currentUserId}`);
        if (cached) renderTodos(JSON.parse(cached));
    }
}

function renderTodos(todos) {
    const container = document.getElementById('todoList');
    localStorage.setItem(`todos_${currentUserId}`, JSON.stringify(todos));

    if (todos.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div>No todos yet</div>';
        return;
    }

    container.innerHTML = todos.map(todo => `
        <div class="list-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
            <div class="list-item-content">
                <div class="list-item-title">${escapeHtml(todo.title)}</div>
                ${todo.description ? `<div class="list-item-desc">${escapeHtml(todo.description)}</div>` : ''}
                <div class="list-item-meta">
                    <span class="badge badge-${todo.priority}">${todo.priority.toUpperCase()}</span>
                    ${todo.due_date ? `<span>📅 ${todo.due_date}</span>` : ''}
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn-sm btn-edit" onclick="editTodo(${todo.id})">Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddTodoForm() {
    document.getElementById('todoForm').style.display = 'block';
    loadCategoriesForSelect();
}

function hideAddTodoForm() {
    document.getElementById('todoForm').style.display = 'none';
    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
}

async function loadCategoriesForSelect() {
    try {
        const response = await fetch(`${API_URL}/categories.php?user_id=${currentUserId}`);
        const categories = await response.json();
        const select = document.getElementById('todoCategory');
        select.innerHTML = '<option value="">Select Category</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function handleAddTodo(event) {
    event.preventDefault();
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    const categoryId = document.getElementById('todoCategory').value || null;
    const priority = document.getElementById('todoPriority').value;
    const dueDate = document.getElementById('todoDueDate').value || null;

    try {
        const response = await fetch(`${API_URL}/todos.php?user_id=${currentUserId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, category_id: categoryId, priority, due_date: dueDate })
        });
        const data = await response.json();
        if (data.success) {
            hideAddTodoForm();
            loadTodos();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id) {
    const todos = JSON.parse(localStorage.getItem(`todos_${currentUserId}`) || '[]');
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const completed = !todo.completed;
        try {
            await fetch(`${API_URL}/todos.php?user_id=${currentUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, completed: completed ? 1 : 0 })
            });
            loadTodos();
            loadDashboard();
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }
}

async function deleteTodo(id) {
    if (!confirm('Delete this todo?')) return;
    try {
        await fetch(`${API_URL}/todos.php?user_id=${currentUserId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        loadTodos();
        loadDashboard();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}
