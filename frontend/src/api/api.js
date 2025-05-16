const API_BASE = 'https://to-do-1-ob6b.onrender.com/api';
const initData = window.Telegram?.WebApp?.initData || '';

if (!initData) {
  console.warn('API: initData is empty. Ensure app is running in Telegram Web App.');
}

export async function fetchProjects() {
  console.log('API: Sending fetchProjects request with initData:', initData);
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('API: fetchProjects error response:', errorData);
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
  console.log('API: Sending createProject request with initData:', initData);
  try {
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
      console.error('API: createProject error response:', errorData);
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
  console.log('API: Sending fetchTasks request with initData:', initData);
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('API: fetchTasks error response:', errorData);
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
  console.log('API: Sending createTask request with initData:', initData);
  try {
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
      console.error('API: createTask error response:', errorData);
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

export async function toggleTaskCompletion(taskId) {
  console.log('API: Sending toggleTaskCompletion request with initData:', initData);
  try {
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
      console.error('API: toggleTaskCompletion error response:', errorData);
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

export async function getProjectByToken(token) {
  console.log('API: Sending getProjectByToken request with initData:', initData);
  try {
    const res = await fetch(`${API_BASE}/projects/shared/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('API: getProjectByToken error response:', errorData);
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