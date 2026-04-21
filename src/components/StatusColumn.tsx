import { Todo, Status, STATUS_LABELS } from '../types/todo'
import { TodoCard } from './TodoCard'

interface Props {
  status: Status
  todos: Todo[]
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
  onEdit: (todo: Todo) => void
}

const STATUS_COLORS: Record<Status, string> = {
  todo: '#94a3b8',
  in_progress: '#f59e0b',
  done: '#10b981',
}

export function StatusColumn({ status, todos, onDelete, onStatusChange, onEdit }: Props) {
  return (
    <div className="status-column">
      <div className="column-header" style={{ borderTopColor: STATUS_COLORS[status] }}>
        <span className="column-title">{STATUS_LABELS[status]}</span>
        <span className="column-count">{todos.length}</span>
      </div>
      <div className="column-body">
        {todos.length === 0 ? (
          <p className="column-empty">タスクなし</p>
        ) : (
          todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}
