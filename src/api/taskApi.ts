// src/api/taskApi.ts
import { api } from './axiosConfig';

export const fetchAllTasks = () => api.get('/tasks');
export const fetchAllEmployeesWithStats = () => api.get('/employees/with-stats'); // ستحتاج لإنشاء هذا المسار
export const createNewTask = (taskData: any) => api.post('/tasks', taskData);
export const updateTaskStatus = (taskId: string, statusData: any) => 
  api.patch(`/tasks/${taskId}/status`, statusData);
export const transferTask = (taskId: string, transferData: any) => 
  api.patch(`/tasks/${taskId}/transfer`, transferData);
export const freezeTask = (taskId: string, freezeData: any) => 
  api.patch(`/tasks/${taskId}/freeze`, freezeData);