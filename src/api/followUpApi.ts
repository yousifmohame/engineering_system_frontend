// src/api/followUpApi.ts
import { api } from './axiosConfig';
import { 
  FollowUpAgent, 
  FollowUpTask, 
  CreateAgentPayload, 
  CreateTaskPayload, 
  UpdateTaskStatusPayload 
} from '../types/followUpTypes';

const BASE_URL = '/followup'; // هذا يطابق ما عرفناه في server.js (app.use('/api/followup', ...))

// ============================================================
// 1. إدارة المعقبين (Agents)
// ============================================================

export const getAllAgents = async (type: string = 'all', status: string = 'all'): Promise<FollowUpAgent[]> => {
  try {
    const { data } = await api.get(`${BASE_URL}/agents`, {
      params: { type, status }
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching agents:', error);
    throw new Error(error.response?.data?.message || 'فشل في جلب المعقبين');
  }
};

export const getAgentById = async (id: string): Promise<FollowUpAgent> => {
  try {
    const { data } = await api.get(`${BASE_URL}/agents/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في جلب تفاصيل المعقب');
  }
};

export const createAgent = async (agentData: CreateAgentPayload): Promise<FollowUpAgent> => {
  try {
    const { data } = await api.post(`${BASE_URL}/agents`, agentData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في إضافة المعقب');
  }
};

export const updateAgent = async (id: string, updates: Partial<FollowUpAgent>): Promise<FollowUpAgent> => {
  try {
    const { data } = await api.put(`${BASE_URL}/agents/${id}`, updates);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في تحديث بيانات المعقب');
  }
};

// ============================================================
// 2. إدارة المهام (Tasks)
// ============================================================

export const getAllTasks = async (): Promise<FollowUpTask[]> => {
  try {
    const { data } = await api.get(`${BASE_URL}/tasks`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في جلب سجل المهام');
  }
};

export const createTask = async (taskData: CreateTaskPayload): Promise<FollowUpTask> => {
  try {
    const { data } = await api.post(`${BASE_URL}/tasks`, taskData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في إسناد المهمة');
  }
};

export const updateTaskStatus = async (id: string, updates: UpdateTaskStatusPayload): Promise<FollowUpTask> => {
  try {
    const { data } = await api.put(`${BASE_URL}/tasks/${id}`, updates);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'فشل في تحديث حالة المهمة');
  }
};