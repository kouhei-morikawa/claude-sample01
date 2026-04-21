import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTodos } from './hooks/useTodos'
import { AuthPage } from './components/AuthPage'
import { TodoForm } from './components/TodoForm'
import { StatusColumn } from './components/StatusColumn'
import { Todo, STATUS_LIST } from './types/todo'
import './App.css'

function Board({ userId, userName, onSignOut }: { userId: string; userName: string; onSignOut: () => void }) {
  const { todos, addTodo, updateTodo, deleteTodo, updateStatus } = useTodos(userId)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const handleEdit = (todo: Todo) => { setEditingTodo(todo); setShowForm(true) }
  const handleClose = () => { setShowForm(false); setEditingTodo(null) }
  const handleSubmit = (data: Omit<Todo, 'id' | 'userId' | 'createdAt'>) => {
    if (editingTodo) { updateTodo(editingTodo.id, data) } else { addTodo(data) }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">TODO</h1>
        <div className="header-right">
          <span className="user-name">{userName}</span>
          <button className="add-btn" onClick={() => setShowForm(true)}>+ タスクを追加</button>
          <button className="signout-btn" onClick={onSignOut}>サインアウト</button>
        </div>
      </header>
      <main className="board">
        {STATUS_LIST.map(status => (
          <StatusColumn
            key={status}
            status={status}
            todos={todos.filter(t => t.status === status)}
            onDelete={deleteTodo}
            onStatusChange={updateStatus}
            onEdit={handleEdit}
          />
        ))}
      </main>
      {showForm && (
        <TodoForm
          onSubmit={handleSubmit}
          onClose={handleClose}
          initial={editingTodo ?? undefined}
        />
      )}
    </div>
  )
}

function App() {
  const { user, error, signIn, signUp, signOut, clearError } = useAuth()

  if (!user) {
    return (
      <AuthPage
        onSignIn={signIn}
        onSignUp={signUp}
        error={error}
        clearError={clearError}
      />
    )
  }

  return <Board userId={user.id} userName={user.name} onSignOut={signOut} />
}

export default App
