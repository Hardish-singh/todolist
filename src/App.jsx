import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar.jsx'
import { v4 as uuidv4 } from 'uuid';
uuidv4(); 
import './App.css'
function App() {
const saveToLS=(p)=>{
  localStorage.setItem("todos",JSON.stringify(p));
}


const [todo,setTodo]=useState('')
const [todos,setTodos]=useState([])
const [restore,DeletedTodos]=useState([])

useEffect(()=>{
    let check=localStorage.getItem("todos")
    if(check)
    {
      let savedTodos=JSON.parse(check)
      setTodos(savedTodos);
    }
},[])


  const handleAdd= ()=>{
      if(todo.trim()==="")
      {
        alert("todo cant be empty");
        return;
      }
      const yet=(pr)=>[...pr,{id:uuidv4(), todo , isCompleted:false}]
      setTodos(yet);
      setTodo('');
      saveToLS(yet)
  }
  const handleEdit= (e,id)=>{
      let find = todos.find(item=>item.id ===id)
      setTodo(find.todo)

      let remaining = todos.filter(item=>item.id!== id)
      setTodos(remaining)
      saveToLS(remaining)
  }
  const handleDelete= (e,id)=>{
    const todocheck = todos.find(item=>item.id===id)
      const check= todos.filter(item=> item.id!==id)
      setTodos(check);
      saveToLS(check)
      DeletedTodos((prev)=>[...prev,todocheck])
  }
  const handleRestore = (id) => {
    const todoToRestore = restore.find((item) => item.id === id);
    const remainingDeletedTodos = restore.filter((item) => item.id !== id);
  
    setTodos((prev) => [...prev, todoToRestore]);
    saveToLS([...todos, todoToRestore]);
  
    DeletedTodos(remainingDeletedTodos); // Remove from deleted todos
  };
  
  const handleChange= (e)=>{
       setTodo(e.target.value);
  }
  const handleCheckbox= (e)=>{
       const id= e.target.name;
       const index=todos.findIndex(item=>item.id===id);
       
       const newTodo=[...todos];
       newTodo[index].isCompleted=!newTodo[index].isCompleted
       setTodos(newTodo);
       saveToLS(newTodo)
  }
  const handleDel= (e,id)=>{
      const check= todos.filter(item=> item.id!==id)
      DeletedTodos(check);
      saveToLS(check)
    }
  return (
    <>
      <Navbar/>
      <div className="container bg-violet-500 max-w-full min-h-[80vh] mx-auto p-4 rounded-2xl sm:max-w-[90vw] md:max-w-[70vw]">
  <div className="head font-bold text-xl text-center mb-4 sm:text-2xl md:text-3xl">Stay Consistent!</div>
  <div className="todoWork flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center">
    <input
      onChange={handleChange}
      value={todo}
      className="w-full p-2 text-sm rounded-md border border-gray-300 sm:w-4/5 md:w-3/5"
      type="text"
      placeholder="Add a todo"
    />
    <button
      onClick={handleAdd}
      className="bg-cyan-400 w-full h-10 rounded-lg text-white hover:bg-sky-500 sm:w-1/4 md:w-20 md:h-12"
   disabled={todo.trim()===""} >
      Add
    </button>
  </div>

  <div className="random font-semibold mt-10 text-lg">Your Todos:</div>
  {todos.map((items) => (
    <div
      key={items.id}
      className="containerTodo  flex flex-col  sm:flex-row justify-between  w-full sm:w-4/5 md:w-2/3 mt-3 gap-4"
    >
      <div className="todos flex items-center gap-2 w-full sm:w-auto">
        <input
          onChange={handleCheckbox}
          name={items.id}
          checked={items.isCompleted}
          type="checkbox"
          className="h-5 w-5"
        />
        <div className={`todo font-serif ${items.isCompleted ? "line-through text-gray-500" : ""}`}>
          {items.todo}
        </div>
      </div>
      <div className="buttons  flex  gap-2">
        <button
          onClick={(e) => {
            handleEdit(e, items.id);
          }}
          className="bg-cyan-400 w-20 h-8 rounded-lg text-white hover:bg-sky-500"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            handleDelete(e, items.id);
          }}
          className="bg-cyan-400 w-20 h-8 rounded-lg text-white hover:bg-sky-500"
        >
          Delete
        </button>
      </div>
    </div>
  ))}

  <div className="deletedTodos mt-5">
    <div className="font-semibold text-lg">Recently Deleted:</div>
    {restore.length === 0 ? (
      <div className="text-gray-500 text-sm">No deleted todos.</div>
    ) : (
      restore.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-4/5 md:w-2/3 mt-3 gap-4"
        >
          <div className="todo font-serif">{item.todo}</div>
          <div className="but flex gap-2">

          <button
            onClick={() => handleRestore(item.id)}
            className="bg-green-400 w-20 h-8 rounded-lg text-white hover:bg-green-500"
            >
            Restore
          </button>
          <button
            onClick={() => handleDel(item.id)}
            className="bg-green-400 w-20 h-8 rounded-lg text-white hover:bg-green-500"
            >
            ☠️
          </button>
            </div>
        </div>
      ))
    )}
  </div>
</div>

    </>
  )
}

export default App
