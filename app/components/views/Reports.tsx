'use client';

import { motion } from 'framer-motion';
import { Task } from '@/lib/types';
import { Download, FileText, TrendingUp, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface ReportsProps {
  tasks: Task[];
}

type StatusFilter = 'all' | 'completed' | 'pending';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Reports({ tasks }: ReportsProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedTasks, setPaginatedTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter tasks based on status
  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : statusFilter === 'completed'
    ? tasks.filter(t => t.completed)
    : tasks.filter(t => !t.completed);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const totalTasks = tasks.length;

  // Fetch paginated tasks from API
  useEffect(() => {
    fetchPaginatedTasks();
  }, [currentPage, pageSize, statusFilter]);

  const fetchPaginatedTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks?page=${currentPage}&limit=${pageSize}`);
      const data = await response.json();
      
      if (response.ok && data.tasks) {
        // Apply status filter to paginated results
        const filtered = statusFilter === 'all' 
          ? data.tasks 
          : statusFilter === 'completed'
          ? data.tasks.filter((t: Task) => t.completed)
          : data.tasks.filter((t: Task) => !t.completed);
        
        setPaginatedTasks(filtered);
        setPagination(data.pagination || {
          page: currentPage,
          limit: pageSize,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize)
        });
      }
    } catch (error) {
      console.error('Error fetching paginated tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  const handleDownloadPDF = () => {
    // Create report content
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
      },
      tasks: filteredTasks.map(task => ({
        title: task.title,
        category: task.category,
        priority: task.priorityLevel,
        status: task.completed ? 'Completed' : 'Pending',
        dueDate: format(new Date(task.dueDate), 'MMM dd, yyyy'),
      })),
    };

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Baaz Task Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #6366f1; border-bottom: 3px solid #6366f1; padding-bottom: 10px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
          .summary-card { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; }
          .summary-card h3 { margin: 0; font-size: 32px; color: #6366f1; }
          .summary-card p { margin: 10px 0 0 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-weight: 600; color: #374151; }
          .status-completed { color: #10b981; font-weight: 600; }
          .status-pending { color: #f59e0b; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 Baaz Task Management Report</h1>
        <p><strong>Generated:</strong> ${format(new Date(), 'MMMM dd, yyyy HH:mm')}</p>
        
        <div class="summary">
          <div class="summary-card">
            <h3>${totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
          <div class="summary-card">
            <h3>${completedTasks}</h3>
            <p>Completed</p>
          </div>
          <div class="summary-card">
            <h3>${pendingTasks}</h3>
            <p>Pending</p>
          </div>
          <div class="summary-card">
            <h3>${reportData.summary.completionRate}%</h3>
            <p>Completion Rate</p>
          </div>
        </div>

        <h2>Task Details</h2>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.tasks.map(task => `
              <tr>
                <td>${task.title}</td>
                <td>${task.category}</td>
                <td>${task.priority}</td>
                <td>${task.dueDate}</td>
                <td class="status-${task.status.toLowerCase()}">${task.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Baaz Task Manager. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baaz-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-500 mt-1">Download and export your task reports</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg"
        >
          <Download className="w-5 h-5" />
          Download Report (HTML)
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <FileText className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900">{totalTasks}</h3>
          <p className="text-gray-500 text-sm mt-2">Total Tasks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <TrendingUp className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900">{completedTasks}</h3>
          <p className="text-gray-500 text-sm mt-2">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <Calendar className="w-8 h-8 text-amber-600 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900">{pendingTasks}</h3>
          <p className="text-gray-500 text-sm mt-2">Pending</p>
        </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600 rounded-xl p-6 text-white"
            >
          <div className="text-5xl font-bold mb-2">
            {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0}%
          </div>
          <p className="text-indigo-100 text-sm">Completion Rate</p>
        </motion.div>
      </div>

      {/* Report Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Report Preview</h3>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                All ({totalTasks})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Completed ({completedTasks})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Pending ({pendingTasks})
              </button>
            </div>
          </div>
        </div>
        
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Task</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Priority</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Due Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                  </tr>
                </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                      Loading tasks...
                    </div>
                  </td>
                </tr>
              ) : paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No tasks found for the selected filter
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{task.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      task.priorityLevel === 'P1' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      task.priorityLevel === 'P2' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>
                      {task.priorityLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      task.completed 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                          : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


