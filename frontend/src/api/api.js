const API_BASE = "http://localhost:3000/api"; 
const initData = window.Telegram?.WebApp?.initData || "";

export async function fetchProjects() {
    const res = await fetch(`${API_BASE}/projects`, {  
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "x-telegram-init-data": initData
        }
    });
    return res.json();
}

export async function createProject(name) {
    await fetch(`${API_BASE}/projects/create`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, name }),
    });
}

export async function fetchTasks(projectId) {
    const res = await fetch(`${API_BASE}/tasks`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, projectId }),
    });
    return res.json();
}

export async function createTask(projectId, title, priority = "medium") {
    await fetch(`${API_BASE}/tasks/create`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, projectId, title, priority }),
    });
}

export async function generateShareToken(projectId) {
    const res = await fetch(`${API_BASE}/projects/share/${projectId}`, { 
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
    });
    return res.json();
}

export async function getProjectByToken(token) {
    const res = await fetch(`${API_BASE}/projects/token/${token}`, {  
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
    });
    return res.json();
}

export async function toggleTaskCompletion(taskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {  
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
    });
    return res.json();
}