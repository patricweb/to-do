const API_BASE = 'https://to-do-1-ob6b.onrender.com/api';
const initData = window.Telegram?.WebApp?.initData || '';

const checkInitData = () => {
  if (!initData) {
    throw new Error('Telegram Web App is not initialized');
  }
};

export async function fetchProjects() {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function createProject(title, description = '') {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function fetchTasks(projectId) {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/tasks/projects/${projectId}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(projectId, title, priority = 'medium', dueDate = null) {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/tasks/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ title, priority, dueDate }),
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function generateShareToken(projectId) {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/projects/share/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error generating share token:', error);
    throw error;
  }
}

export async function getProjectByToken(token) {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/projects/shared/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching project by token:', error);
    throw error;
  }
}

export async function toggleTaskCompletion(taskId) {
  checkInitData();
  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ completed: true }),
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
}