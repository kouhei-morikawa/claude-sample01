import { useState } from 'react'
import { Todo, Status, STATUS_LABELS, STATUS_LIST } from '../types/todo'

interface Props {
  todo: Todo
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
  onEdit: (todo: Todo) => void
}

function getDueDateClass(dueDate: string | null): string {
  if (!dueDate) return ''
  const today = new Date().toISOString().split('T')[0]
  if (dueDate < today) return 'overdue'
  const soon = new Date()
  soon.setDate(soon.getDate() + 3)
  if (dueDate <= soon.toISOString().split('T')[0]) return 'due-soon'
  return ''
}

export function TodoCard({ todo, onDelete, onStatusChange, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const dueDateClass = getDueDateClass(todo.dueDate)

  return (
    <div className="todo-card">
      <div className="card-header">
        <span className="card-title" onClick={() => onEdit(todo)}>{todo.title}</span>
        <button className="card-delete" onClick={() => onDelete(todo.id)} aria-label="削除">×</button>
      </div>
      {todo.description && (
        <p className="card-description">{todo.description}</p>
      )}
      <div className="card-footer">
        {todo.dueDate && (
          <span className={`card-due ${dueDateClass}`}>📅 {todo.dueDate}</span>
        )}
        <div className="card-status-wrapper">
          <button className="card-status-btn" onClick={() => setShowMenu(v => !v)}>
            {STATUS_LABELS[todo.status]} ▾
          </button>
          {showMenu && (
            <>
              <div className="status-menu-backdrop" onClick={() => setShowMenu(false)} />
              <div className="status-menu">
                {STATUS_LIST.filter(s => s !== todo.status).map(s => (
                  <button
                    key={s}
                    className="status-menu-item"
                    onClick={() => { onStatusChange(todo.id, s); setShowMenu(false) }}
                  >
                    {STATUS_LABELS[s]}へ移動
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
