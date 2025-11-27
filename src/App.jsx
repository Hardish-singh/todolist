import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar.jsx'
import { v4 as uuidv4 } from 'uuid';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  X,
  Filter,
  Archive
} from 'lucide-react';
import './App.css'

function App() {
  const saveToLS = (p) => {
    localStorage.setItem("todos", JSON.stringify(p));
  }

  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [deletedTodos, setDeletedTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)

  useEffect(() => {
    let check = localStorage.getItem("todos");
    if (check) {
      try {
        let savedTodos = JSON.parse(check);
        setTodos(savedTodos);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        localStorage.removeItem("todos");
      }
    }
  }, []);

  const handleToggle = () => {
    setShowFinished(!showFinished)
  }

  const handleAdd = () => {
    if (todo.trim() === "") {
      return;
    }

    if (isEditing && currentEditId) {
      // Edit existing todo
      const updatedTodos = todos.map(item => 
        item.id === currentEditId 
          ? { ...item, todo, isCompleted: false }
          : item
      )
      setTodos(updatedTodos)
      saveToLS(updatedTodos)
      setIsEditing(false)
      setCurrentEditId(null)
    } else {
      // Add new todo
      const newTodo = { id: uuidv4(), todo, isCompleted: false }
      const updatedTodos = [...todos, newTodo]
      setTodos(updatedTodos)
      saveToLS(updatedTodos)
    }
    
    setTodo('')
  }

  const handleEdit = (id) => {
    const find = todos.find(item => item.id === id)
    setTodo(find.todo)
    setIsEditing(true)
    setCurrentEditId(id)
  }

  const handleDelete = (id) => {
    const todoToDelete = todos.find(item => item.id === id)
    const remainingTodos = todos.filter(item => item.id !== id)
    setTodos(remainingTodos)
    saveToLS(remainingTodos)
    setDeletedTodos(prev => [...prev, { ...todoToDelete, deletedAt: new Date().toISOString() }])
  }

  const handleRestore = (id) => {
    const todoToRestore = deletedTodos.find(item => item.id === id)
    const remainingDeletedTodos = deletedTodos.filter(item => item.id !== id)
    
    setTodos(prev => [...prev, { ...todoToRestore, isCompleted: false }])
    saveToLS([...todos, { ...todoToRestore, isCompleted: false }])
    setDeletedTodos(remainingDeletedTodos)
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckbox = (id) => {
    const updatedTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    )
    setTodos(updatedTodos)
    saveToLS(updatedTodos)
  }

  const handlePermanentDelete = (id) => {
    const remainingDeletedTodos = deletedTodos.filter(item => item.id !== id)
    setDeletedTodos(remainingDeletedTodos)
  }

  const clearAllDeleted = () => {
    setDeletedTodos([])
  }

  const completedCount = todos.filter(todo => todo.isCompleted).length
  const activeCount = todos.length - completedCount

  return (
    <>
      <Navbar />
      
      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Stay Consistent!
            </h1>
            <p className="text-gray-600 text-lg">Organize your tasks and boost productivity</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">{todos.length}</div>
              <div className="text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>

          {/* Add/Edit Todo Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isEditing ? 'Edit Todo' : 'Add New Todo'}
                </label>
                <input
                  onChange={handleChange}
                  value={todo}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  type="text"
                  placeholder="What needs to be done?"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setCurrentEditId(null)
                      setTodo('')
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full md:w-auto justify-center"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleAdd}
                  disabled={todo.trim() === ""}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 w-full md:w-auto justify-center ${
                    todo.trim() === "" 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  <Plus size={18} />
                  {isEditing ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Filter size={20} className="text-gray-600" />
              <button
                onClick={handleToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                  showFinished 
                    ? 'bg-purple-100 border-purple-300 text-purple-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-700'
                }`}
              >
                <Check size={16} />
                Show Completed
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          {/* Todos List */}
          <div className="space-y-3 mb-12">
            {todos.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-purple-100">
                <div className="text-gray-400 text-lg">No tasks yet. Add one above!</div>
              </div>
            ) : (
              todos.map((item) => (
                (showFinished || !item.isCompleted) && (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl p-4 shadow-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                      item.isCompleted 
                        ? 'border-l-green-500 bg-green-50' 
                        : 'border-l-purple-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => handleCheckbox(item.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {item.isCompleted && <Check size={14} />}
                        </button>
                        <div className={`flex-1 ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.todo}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {/* Deleted Todos Section */}
          {deletedTodos.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Archive size={24} className="text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Recently Deleted</h3>
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm">
                    {deletedTodos.length}
                  </span>
                </div>
                <button
                  onClick={clearAllDeleted}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-3">
                {deletedTodos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200"
                  >
                    <div className="text-gray-700 line-through">{item.todo}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <RotateCcw size={16} />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Permanently Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App