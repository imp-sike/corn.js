import { useState } from './../corn.js/corn.js';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';

export default function App() {
    const [todos, setTodos] = useState(["Hello"]);

    const addTodo = (todo) => {
        setTodos([...todos, todo]);
    };

    const removeTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-4 ">Todo Application</h1>
            <AddTodo addTodo={addTodo} />
            <TodoList todos={todos} removeTodo={removeTodo} />
            <p className="mt-4 text-lg">Total Todos: {todos.length}</p>
        </div>
    );
}
