import { TodoItem, type TodoItemProps } from './TodoItem';

interface TodoListProps {
  todos: TodoItemProps[];
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '12px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
        }}
      >
        No todos
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '12px',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: '8px',
          color: 'var(--text-primary)',
        }}
      >
        Todos
      </div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </div>
  );
}
