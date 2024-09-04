const TodoList = ({ todos, removeTodo }) => {
    return (
        <ul className="list-disc list-inside w-full max-w-md bg-white shadow-md rounded-lg">
            {todos.map((todo, index) => (
                <li key={index} className="flex justify-between items-center p-3 border-b border-gray-200">
                    <span>{todo}</span>
                    <button
                        onClick={() => removeTodo(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
