import { useState, FormEvent } from 'react'
import { Todo, Status, STATUS_LABELS, STATUS_LIST } from '../types/todo'

interface Props {
  onSubmit: (data: Omit<Todo, 'id' | 'createdAt'>) => void
  onClose: () => void
  initial?: Todo
}

export function TodoForm({ onSubmit, onClose, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [status, setStatus] = useState<Status>(initial?.status ?? 'todo')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      status,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{initial ? 'タスクを編集' : 'タスクを追加'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">タイトル <span className="required">*</span></label>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="タスクのタイトル"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">詳細内容</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="タスクの詳細を入力..."
              rows={4}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">期限</label>
              <input
                className="form-input"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">ステータス</label>
              <select
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value as Status)}
              >
                {STATUS_LIST.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn-submit" disabled={!title.trim()}>
              {initial ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
