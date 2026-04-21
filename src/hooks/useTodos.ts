import { useState, useEffect, useCallback } from 'react'
import { Todo, Status } from '../types/todo'

const STORAGE_KEY = 'todos'

function loadAllTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useTodos(userId: string) {
  const [allTodos, setAllTodos] = useState<Todo[]>(loadAllTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTodos))
  }, [allTodos])

  const todos = allTodos.filter(t => t.userId === userId)

  const addTodo = useCallback((data: Omit<Todo, 'id' | 'userId' | 'createdAt'>) => {
    setAllTodos(prev => [
      { ...data, id: crypto.randomUUID(), userId, createdAt: Date.now() },
      ...prev,
    ])
  }, [userId])

  const updateTodo = useCallback((id: string, data: Partial<Omit<Todo, 'id' | 'userId' | 'createdAt'>>) => {
    setAllTodos(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setAllTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateStatus = useCallback((id: string, status: Status) => {
    setAllTodos(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }, [])

  return { todos, addTodo, updateTodo, deleteTodo, updateStatus }
}
