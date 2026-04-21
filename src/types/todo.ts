export type Status = 'todo' | 'in_progress' | 'done'

export const STATUS_LABELS: Record<Status, string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了',
}

export const STATUS_LIST: Status[] = ['todo', 'in_progress', 'done']

export interface Todo {
  id: string
  userId: string
  title: string
  description: string
  dueDate: string | null
  status: Status
  createdAt: number
}
