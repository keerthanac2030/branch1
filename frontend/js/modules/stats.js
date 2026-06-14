async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/statistics.php?user_id=${currentUserId}`);
        const stats = await response.json();
        document.getElementById('totalTodos').textContent = stats.total_todos;
        document.getElementById('completedTodos').textContent = stats.completed_todos;
        document.getElementById('pendingTodos').textContent = stats.pending_todos;
        document.getElementById('completionRate').textContent = stats.completion_rate + '%';
        document.getElementById('totalNotes').textContent = stats.total_notes;
        document.getElementById('totalCategories').textContent = stats.total_categories;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/statistics.php?user_id=${currentUserId}`);
        const stats = await response.json();
        renderPriorityChart(stats.priority_breakdown);
        renderCategoryChart(stats.category_breakdown);
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

function renderPriorityChart(data) {
    const container = document.getElementById('priorityChart');
    const total = data.reduce((sum, item) => sum + item.count, 0);

    if (total === 0) {
        container.innerHTML = '<div class="empty-state">No data available</div>';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="chart-item">
            <div class="chart-label">${item.priority}</div>
            <div class="chart-bar" style="width: ${(item.count / total) * 100}%">${item.count}</div>
        </div>
    `).join('');
}

function renderCategoryChart(data) {
    const container = document.getElementById('categoryChart');
    const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

    if (total === 0) {
        container.innerHTML = '<div class="empty-state">No data available</div>';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="chart-item">
            <div class="chart-label">${item.name}</div>
            <div class="chart-bar" style="width: ${((item.count || 0) / total) * 100}%">${item.count || 0}</div>
        </div>
    `).join('');
}
