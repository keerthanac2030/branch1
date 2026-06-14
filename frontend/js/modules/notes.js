async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes.php?user_id=${currentUserId}`);
        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
        const cached = localStorage.getItem(`notes_${currentUserId}`);
        if (cached) renderNotes(JSON.parse(cached));
    }
}

function renderNotes(notes) {
    const container = document.getElementById('noteList');
    localStorage.setItem(`notes_${currentUserId}`, JSON.stringify(notes));

    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div>No notes yet</div>';
        return;
    }

    container.innerHTML = notes.map(note => `
        <div class="note-card ${note.is_pinned ? 'pinned' : ''}" style="background-color: ${note.color}">
            <div class="note-title">${escapeHtml(note.title)}</div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-actions">
                <button onclick="togglePin(${note.id})">📌 Pin</button>
                <button onclick="editNote(${note.id})">✏️ Edit</button>
                <button onclick="deleteNote(${note.id})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddNoteForm() {
    document.getElementById('noteForm').style.display = 'block';
}

function hideAddNoteForm() {
    document.getElementById('noteForm').style.display = 'none';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
}

async function handleAddNote(event) {
    event.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const color = document.getElementById('noteColor').value;

    try {
        const response = await fetch(`${API_URL}/notes.php?user_id=${currentUserId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, color })
        });
        const data = await response.json();
        if (data.success) {
            hideAddNoteForm();
            loadNotes();
        }
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

async function togglePin(id) {
    const notes = JSON.parse(localStorage.getItem(`notes_${currentUserId}`) || '[]');
    const note = notes.find(n => n.id === id);
    if (note) {
        const isPinned = !note.is_pinned;
        try {
            await fetch(`${API_URL}/notes.php?user_id=${currentUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_pinned: isPinned ? 1 : 0 })
            });
            loadNotes();
        } catch (error) {
            console.error('Error pinning note:', error);
        }
    }
}

async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    try {
        await fetch(`${API_URL}/notes.php?user_id=${currentUserId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}
