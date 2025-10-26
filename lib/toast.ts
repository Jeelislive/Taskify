import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Trash2, Plus } from 'lucide-react';

const toastConfig = {
  duration: 3000,
  style: {
    background: 'rgba(17, 24, 39, 0.95)',
    color: '#fff',
    border: '1px solid rgba(107, 114, 128, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    padding: '12px 16px',
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    icon: '✓',
    style: {
      ...toastConfig.style,
      border: '1px solid rgba(34, 197, 94, 0.3)',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    icon: '✕',
    style: {
      ...toastConfig.style,
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: 'ℹ',
    style: {
      ...toastConfig.style,
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: '⚠',
    style: {
      ...toastConfig.style,
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
  });
};

export const showTaskCreated = (count: number) => {
  showSuccessToast(`${count} task${count > 1 ? 's' : ''} created successfully! 🎉`);
};

export const showTaskCompleted = (title: string) => {
  showSuccessToast(`Task completed: "${title}" ✓`);
};

export const showTaskDeleted = (title: string) => {
  showInfoToast(`Task deleted: "${title}"`);
};

export const showTaskUpdated = () => {
  showSuccessToast('Task updated successfully!');
};

export const showBulkDeleteToast = (count: number) => {
  showInfoToast(`${count} completed task${count > 1 ? 's' : ''} cleared`);
};


