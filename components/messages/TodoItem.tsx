import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircleIcon,
  ClockIcon,
  RadioIcon,
} from '@hugeicons/core-free-icons';

export interface TodoItemProps {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const statusConfig = {
  completed: {
    icon: CheckmarkCircleIcon,
    color: '#22c55e',
  },
  in_progress: {
    icon: ClockIcon,
    color: '#f59e0b',
  },
  pending: {
    icon: RadioIcon,
    color: 'var(--text-secondary)',
  },
};

const priorityConfig = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: undefined,
};

export function TodoItem({ content, status, priority }: TodoItemProps) {
  const { icon, color } = statusConfig[status];
  const priorityColor = priorityConfig[priority];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 0',
        gap: '8px',
      }}
    >
      <HugeiconsIcon icon={icon} size={16} color={color} strokeWidth={1.5} />
      <span
        style={{
          flex: 1,
          color: 'var(--text-primary)',
          fontSize: '13px',
          textDecoration: status === 'completed' ? 'line-through' : 'none',
          opacity: status === 'completed' ? 0.7 : 1,
        }}
      >
        {content}
      </span>
      {priorityColor && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: priorityColor,
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}
