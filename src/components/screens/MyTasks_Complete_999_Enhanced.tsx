/**
 * My Tasks Screen - Complete Task Management v9.1
 * ====================================================
 *
 * Update v9.1:
 * - [New] Added useMutation for updating task status and progress.
 * - [New] Converted Dialog to edit form.
 * - [New] Added useState to track edits (newStatus, newProgress).
 * - [Enabled] Fetching tasks from server (useQuery).
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';

// --- 1. Import API functions and types ---
import { getMyTasks, updateTask } from '../../api/taskApi';
import { Task, TaskStatus, TaskPriority } from '../../types/taskTypes'; // (Ensure TaskPriority exists)

// --- 2. Import components ---
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  CheckCircle, Clock, AlertCircle, XCircle, User, Calendar, FileText,
  Search, Filter, Download, RefreshCw, Eye, Edit,
  TrendingUp, Target, Activity, Bell, ChevronRight,
  PlayCircle, Archive, Star, Flag, MessageSquare,
  Paperclip, BarChart3, ClipboardCheck, DollarSign, Zap, Loader2, Save // <-- Added
} from 'lucide-react';
import { InputWithCopy } from '../InputWithCopy';
import { Skeleton } from '../ui/skeleton';
import { Label } from '../ui/label';
import { Input } from '../ui/input'; // <-- Added
import { Slider } from '../ui/slider'; // <-- Added
import { format } from 'date-fns'; // Add this import for date formatting
import { ar } from 'date-fns/locale'; // Import Arabic locale if needed

const MyTasks_Complete_999_Enhanced: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  // --- [New] States for edit data inside Dialog ---
  const [newStatus, setNewStatus] = useState<TaskStatus>('pending');
  const [newProgress, setNewProgress] = useState<number>(0);
  // ---------------------------------------------------

  const { data: tasksData, isLoading, isError, isRefetching } = useQuery<Task[]>({
    queryKey: ['myTasks'],
    queryFn: getMyTasks,
  });

  const tasks = tasksData || [];

  // --- [New] Update Mutation ---
  const updateTaskMutation = useMutation({
    mutationFn: (data: { id: string; status: TaskStatus; progress: number }) => 
      updateTask(data.id, { status: data.status, progress: data.progress }),
    
    onSuccess: (updatedTask) => {
      // toast.success(`Task updated: ${updatedTask.taskNumber}`);
      
      // Update cache immediately
      queryClient.setQueryData(['myTasks'], (oldData: Task[] | undefined) => {
        return oldData ? oldData.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ) : [];
      });
      
      setShowTaskDialog(false); // Close dialog
    },
    onError: (error: Error) => {
      // toast.error(`Update failed: ${error.message}`);
    }
  });
  // ---------------------------------------------

  // (useEffect to populate edit data when Dialog opens)
  useEffect(() => {
    if (selectedTask) {
      setNewStatus(selectedTask.status);
      setNewProgress(selectedTask.progress || 0);
    }
  }, [selectedTask]);

  // (Task statistics - remains unchanged)
  const statistics = useMemo(() => {
    const validTasks = tasks || [];
    const totalFees = validTasks.reduce((sum, task) => sum + (task.fees?.total || 0), 0);
    const paidFees = validTasks.reduce((sum, task) => sum + (task.fees?.paid || 0), 0);
    const unpaidFees = totalFees - paidFees;
    const paidPercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;

    return {
      processing: validTasks.filter(t => t.status === 'processing').length,
      unassigned: validTasks.filter(t => t.status === 'unassigned' || t.status === 'not-received').length,
      completed: validTasks.filter(t => t.status === 'completed').length,
      overdue: validTasks.filter(t => t.status === 'overdue').length,
      total: validTasks.length,
      highPriority: validTasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
      totalFees,
      paidFees,
      unpaidFees,
      paidPercentage
    };
  }, [tasks]);

  // (Filter tasks - remains unchanged)
  const filteredTasks = useMemo(() => {
    let filtered = tasks || [];
    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === activeTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.taskNumber && t.taskNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.transactionNumber && t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    return filtered;
  }, [tasks, activeTab, searchQuery, filterPriority, filterCategory]);

  // (Helper functions - remains unchanged)
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.taskNumber === taskId);
    if (task) {
      setSelectedTask(task);
      setShowTaskDialog(true);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'processing': case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'unassigned': case 'not-received': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'processing': case 'in-progress': return 'Processing';
      case 'unassigned': case 'not-received': return 'Not Received';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Normal';
    }
  };

  const getPaymentStatusColor = (status: 'paid' | 'partial' | 'unpaid') => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-yellow-100 text-yellow-700';
      case 'unpaid': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusText = (status: 'paid' | 'partial' | 'unpaid') => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'partial': return 'Partial';
      case 'unpaid': return 'Unpaid';
      default: return 'Undefined';
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) amount = 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // --- [New] Function to execute update ---
  const handleUpdateTask = () => {
    if (!selectedTask) return;
    updateTaskMutation.mutate({
      id: selectedTask.id,
      status: newStatus,
      progress: newProgress,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50">
      <div className="container mx-auto p-4 space-y-4">
        
        {/* Header - Dense */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                My Tasks
              </h1>
              <p className="text-xs text-gray-600">
                Manage and track your assigned tasks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-100 text-orange-700 text-xs">
              <code>SCR-999</code>
            </Badge>
          </div>
        </div>

        {/* Quick Stats - Dense */}
        <div className="grid grid-cols-8 gap-2">
          {[
            { label: 'Processing', value: statistics.processing, icon: PlayCircle, color: '#2563eb', tab: 'processing' },
            { label: 'Not Received', value: statistics.unassigned, icon: Bell, color: '#f59e0b', tab: 'unassigned' },
            { label: 'Overdue', value: statistics.overdue, icon: AlertCircle, color: '#ef4444', tab: 'overdue' },
            { label: 'Completed', value: statistics.completed, icon: CheckCircle, color: '#10b981', tab: 'completed' },
            { label: 'High Priority', value: statistics.highPriority, icon: Flag, color: '#f97316', tab: 'all' },
            { label: 'Total Tasks', value: statistics.total, icon: Target, color: '#8b5cf6', tab: 'all' },
            { label: 'Total Fees', value: `$${(statistics.totalFees / 1000).toFixed(0)}K`, icon: DollarSign, color: '#06b6d4', tab: 'all' },
            { label: 'Collection Rate', value: `${statistics.paidPercentage}%`, icon: TrendingUp, color: '#10b981', tab: 'all' }
          ].map((stat, i) => (
            <Card 
              key={i} 
              className="hover:shadow-md transition-all cursor-pointer border-l-4"
              style={{ borderLeftColor: stat.color }}
              onClick={() => setActiveTab(stat.tab as TaskStatus | 'all')}
            >
              <CardContent className="p-2">
                <div className="flex flex-col items-center text-center gap-1">
                  <div style={{ color: stat.color }}>
                    {React.createElement(stat.icon, { className: 'h-4 w-4' })}
                  </div>
                  <span className="text-base font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <p className="text-[10px] text-gray-600 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar - Dense */}
        <Card>
          <CardContent className="p-2">
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Search - Smaller */}
              <div className="col-span-3">
                <div className="relative">
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <InputWithCopy
                    label=""
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="pr-8 text-xs h-8"
                    copyable={false}
                    clearable={true}
                  />
                </div>
              </div>

              {/* Task Selection - New */}
              <div className="col-span-3">
                <Select value={selectedTaskId} onValueChange={handleTaskSelect}>
                  <SelectTrigger className="h-8 text-xs" disabled={isLoading}>
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select task..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.taskNumber} className="text-xs">
                        {task.taskNumber} - {task.title.substring(0, 30)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filters - Smaller */}
              <div className="col-span-2">
                <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as TaskPriority | 'all')}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {/* [New] Create categories dynamically */}
                    {Array.from(new Set(tasks.map(t => t.category))).map(category => (
                      category && <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons - Smaller */}
              <div className="col-span-2 flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs flex-1"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['myTasks'] })}
                  disabled={isRefetching}
                >
                  {isRefetching ? (
                    <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 ml-1" />
                  )}
                  Refresh
                </Button>
                <Button size="sm" className="h-8 text-xs flex-1">
                  <Download className="h-3 w-3 ml-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table - Dense */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableHead className="text-left text-[10px] p-2">Task</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Title</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Transaction</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Fees</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Status</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Progress</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Due Date</TableHead>
                    <TableHead className="text-left text-[10px] p-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8} className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center p-8 text-destructive">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-xs">
                          Error occurred while fetching tasks
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center p-8">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs text-gray-500">
                          No tasks match search criteria
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-orange-50 transition-colors">
                        <TableCell className="p-2">
                          <div className="flex flex-col gap-0.5">
                            <code className="text-[10px] text-blue-600 font-mono">
                              {task.taskNumber}
                            </code>
                            <Badge className={`${getPriorityColor(task.priority || 'medium')} text-[9px] px-1 py-0`}>
                              {getPriorityText(task.priority || 'medium')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-xs">
                              {task.title}
                            </p>
                            <p className="text-[9px] text-gray-500">
                              {task.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <code className="text-[10px] text-purple-600 font-mono">
                            {task.transactionNumber}
                          </code>
                        </TableCell>
                        <TableCell className="p-2">
                          {task.fees && (
                            <div className="flex flex-col gap-0.5">
                              <p className="text-xs font-semibold">
                                {formatCurrency(task.fees.total)}
                              </p>
                              <div className="flex items-center gap-1">
                                <Badge className={`${getPaymentStatusColor(task.fees.paymentStatus)} text-[9px] px-1 py-0`}>
                                  {task.fees.paymentPercentage}%
                                </Badge>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge className={`${getStatusColor(task.status)} text-[9px] px-1 py-0`}>
                            {getStatusText(task.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex flex-col gap-1">
                            <Progress value={task.progress} className="h-1.5 w-16" />
                            <span className="text-[9px] text-gray-600">{task.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-[10px] text-gray-600">
                              {task.dueDate ? format(new Date(task.dueDate), 'yyyy/MM/dd') : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskDialog(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary (unchanged) */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-600 mb-0.5">
                    Total Fees
                  </p>
                  <p className="text-sm font-bold text-blue-800">
                    {formatCurrency(statistics.totalFees)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-green-600 mb-0.5">
                    Collected
                  </p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(statistics.paidFees)}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-orange-600 mb-0.5">
                    Remaining
                  </p>
                  <p className="text-sm font-bold text-orange-600">
                    {formatCurrency(statistics.unpaidFees)}
                  </p>
                </div>
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- [Updated] Edit Task Dialog --- */}
      {selectedTask && (
        <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Update Task: {selectedTask.taskNumber}
              </DialogTitle>
              <DialogDescription>
                {selectedTask.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              
              {/* Display fields (for static information) */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Transaction Number</Label>
                  <p className="text-sm font-medium">{selectedTask.transactionNumber}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Priority</Label>
                  <Badge className={`${getPriorityColor(selectedTask.priority || 'medium')} text-xs`}>
                    {getPriorityText(selectedTask.priority || 'medium')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Due Date</Label>
                  <p className="text-sm font-medium">
                    {selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'yyyy/MM/dd') : 'N/A'}
                  </p>
                </div>
              </div>
              
              <Separator />

              {/* Edit fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-status" className="text-xs text-gray-600">Status</Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as TaskStatus)}>
                    <SelectTrigger id="task-status" className="h-9">
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-received">Not Received</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="task-progress" className="text-xs text-gray-600">
                    Progress ({newProgress}%)
                  </Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Slider
                      id="task-progress"
                      min={0}
                      max={100}
                      step={5}
                      value={[newProgress]}
                      onValueChange={(value) => setNewProgress(value[0])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {selectedTask.fees && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-xs mb-2 font-semibold">Fee Information</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <p className="font-semibold">{formatCurrency(selectedTask.fees.total)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Paid:</span>
                      <p className="font-semibold text-green-700">{formatCurrency(selectedTask.fees.paid)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining:</span>
                      <p className="font-semibold text-orange-600">
                        {formatCurrency(selectedTask.fees.total - selectedTask.fees.paid)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs text-gray-600">Description</Label>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md border">
                  {selectedTask.description || "No description."}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowTaskDialog(false)} variant="outline" size="sm">
                Close
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdateTask} 
                disabled={updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? (
                  <Loader2 className="h-3 w-3 ml-1 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 ml-1" />
                )}
                {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyTasks_Complete_999_Enhanced;