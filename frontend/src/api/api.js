const API_BASE = 'https://to-do-1-ob6b.onrender.com/api';
const initData = window.Telegram?.WebApp?.initData || '';

const checkInitData = () => {
  if (!initData) {
    console.error('API: initData is empty');
    throw new Error('Telegram initialization data is missing');
  }
  console.log('API: Using initData:', initData);
};

// Задержка для ожидания "пробуждения" сервера
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchProjects() {
  checkInitData();
  try {
    console.log('API: Sending fetchProjects request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: fetchProjects response:', data);
    return data;
  } catch (error) {
    console.error('API: Error fetching projects:', error);
    throw error;
  }
}

export async function createProject(title, description = '') {
  checkInitData();
  try {
    console.log('API: Sending createProject request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: createProject response:', data);
    return data;
  } catch (error) {
    console.error('API: Error creating project:', error);
    throw error;
  }
}

export async function fetchTasks(projectId) {
  checkInitData();
  try {
    console.log('API: Sending fetchTasks request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: fetchTasks response:', data);
    return data;
  } catch (error) {
    console.error('API: Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(projectId, title, priority = 'medium', dueDate = null) {
  checkInitData();
  try {
    console.log('API: Sending createTask request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ title, priority, dueDate }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: createTask response:', data);
    return data;
  } catch (error) {
    console.error('API: Error creating task:', error);
    throw error;
  }
}

export async function generateShareToken(projectId) {
  checkInitData();
  try {
    console.log('API: Sending generateShareToken request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/projects/share/${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: generateShareToken response:', data);
    return data;
  } catch (error) {
    console.error('API: Error generating share token:', error);
    throw error;
  }
}

export async function getProjectByToken(token) {
  checkInitData();
  try {
    console.log('API: Sending getProjectByToken request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/projects/shared/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: getProjectByToken response:', data);
    return data;
  } catch (error) {
    console.error('API: Error fetching project by token:', error);
    throw error;
  }
}

export async function toggleTaskCompletion(taskId) {
  checkInitData();
  try {
    console.log('API: Sending toggleTaskCompletion request...');
    await delay(1000);
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ completed: true }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.error || 'Unknown'}`);
    }
    const data = await res.json();
    console.log('API: toggleTaskCompletion response:', data);
    return data;
  } catch (error) {
    console.error('API: Error toggling task completion:', error);
    throw error;
  }
}