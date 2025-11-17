// src/api/taskApi.ts
import { api } from './axiosConfig';
import { Task } from '../types/taskTypes';

export const fetchAllTasks = () => api.get('/tasks');
export const fetchAllEmployeesWithStats = () => api.get('/employees/with-stats'); // ستحتاج لإنشاء هذا المسار
export const createNewTask = (taskData: any) => api.post('/tasks', taskData);
export const updateTaskStatus = (taskId: string, statusData: any) => 
  api.patch(`/tasks/${taskId}/status`, statusData);
export const transferTask = (taskId: string, transferData: any) => 
  api.patch(`/tasks/${taskId}/transfer`, transferData);
export const freezeTask = (taskId: string, freezeData: any) => 
  api.patch(`/tasks/${taskId}/freeze`, freezeData);

export const getMyTasks = async (): Promise<Task[]> => {
  try {
    // (المسار /tasks/my-tasks لا يحتاج /api/ لأنها في axiosConfig)
    const response = await api.get<Task[]>('/tasks/my-tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching my tasks:', error);
    throw error;
  }
};

/**
 * [جديد] تحديث بيانات مهمة
 * PUT /api/tasks/:id
 */
export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  try {
    // [الإصلاح] تغيير "put" إلى "patch"
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};