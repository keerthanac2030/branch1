async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories.php?user_id=${currentUserId}`);
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        const cached = localStorage.getItem(`categories_${currentUserId}`);
        if (cached) renderCategories(JSON.parse(cached));
    }
}

function renderCategories(categories) {
    const container = document.getElementById('categoryList');
    localStorage.setItem(`categories_${currentUserId}`, JSON.stringify(categories));

    if (categories.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📁</div>No categories yet</div>';
        return;
    }

    container.innerHTML = categories.map(cat => `
        <div class="category-card">
            <div class="category-color" style="background-color: ${cat.color}"></div>
            <div class="category-info">
                <div class="category-name">${cat.icon} ${escapeHtml(cat.name)}</div>
            </div>
            <div class="list-item-actions">
                <button class="btn-sm btn-edit" onclick="editCategory(${cat.id})">Edit</button>
                <button class="btn-sm btn-delete" onclick="deleteCategory(${cat.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddCategoryForm() {
    document.getElementById('categoryForm').style.display = 'block';
}

function hideAddCategoryForm() {
    document.getElementById('categoryForm').style.display = 'none';
    document.getElementById('categoryName').value = '';
}

async function handleAddCategory(event) {
    event.preventDefault();
    const name = document.getElementById('categoryName').value;
    const color = document.getElementById('categoryColor').value;

    try {
        const response = await fetch(`${API_URL}/categories.php?user_id=${currentUserId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, color })
        });
        const data = await response.json();
        if (data.success) {
            hideAddCategoryForm();
            loadCategories();
        }
    } catch (error) {
        console.error('Error adding category:', error);
    }
}

async function deleteCategory(id) {
    if (!confirm('Delete this category?')) return;
    try {
        await fetch(`${API_URL}/categories.php?user_id=${currentUserId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
    }
}
