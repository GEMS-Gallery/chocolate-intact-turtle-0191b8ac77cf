import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const categories = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Shopping' },
  { id: 4, name: 'Health' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const addTask = async () => {
    if (newTask.trim() !== '') {
      setIsLoading(true);
      try {
        const taskId = await backend.addTask(newTask, BigInt(selectedCategory.id));
        setTasks([...tasks, { id: Number(taskId), text: newTask, category: selectedCategory.id }]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteTask = async (taskId) => {
    setIsLoading(true);
    try {
      await backend.deleteTask(BigInt(taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <h2 className="text-lg font-semibold p-4 border-b">Categories</h2>
        <ul>
          {categories.map(category => (
            <li
              key={category.id}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${selectedCategory.id === category.id ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Task List</h1>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {tasks
            .filter(task => task.category === selectedCategory.id)
            .map(task => (
              <li key={task.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow">
                <span>{task.text}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}