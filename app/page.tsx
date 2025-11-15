'use client';

import { useState, useEffect } from 'react';

interface LifeMetric {
  id: string;
  category: string;
  name: string;
  value: number;
  unit: string;
  color: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  text: string;
  timestamp: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<LifeMetric[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const savedMetrics = localStorage.getItem('lifeMetrics');
    const savedTasks = localStorage.getItem('lifeTasks');
    const savedNotes = localStorage.getItem('lifeNotes');

    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
    else {
      const defaultMetrics: LifeMetric[] = [
        { id: '1', category: 'Health', name: 'Water (glasses)', value: 0, unit: '/8', color: 'bg-blue-500' },
        { id: '2', category: 'Health', name: 'Exercise (min)', value: 0, unit: '/30', color: 'bg-green-500' },
        { id: '3', category: 'Productivity', name: 'Deep Work (hrs)', value: 0, unit: '/4', color: 'bg-purple-500' },
        { id: '4', category: 'Wellness', name: 'Sleep (hrs)', value: 0, unit: '/8', color: 'bg-indigo-500' },
        { id: '5', category: 'Social', name: 'Connections', value: 0, unit: '/3', color: 'bg-pink-500' },
        { id: '6', category: 'Learning', name: 'Reading (pages)', value: 0, unit: '/20', color: 'bg-yellow-500' },
      ];
      setMetrics(defaultMetrics);
    }

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('lifeMetrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('lifeTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lifeNotes', JSON.stringify(notes));
  }, [notes]);

  const updateMetric = (id: string, delta: number) => {
    setMetrics(prev => prev.map(m =>
      m.id === id ? { ...m, value: Math.max(0, m.value + delta) } : m
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes(prev => [{ id: Date.now().toString(), text: newNote, timestamp: Date.now() }, ...prev]);
      setNewNote('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Life Dashboard</h1>
        <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{metric.category}</p>
                <h3 className="text-lg font-semibold text-gray-800">{metric.name}</h3>
              </div>
              <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">
                {metric.value}<span className="text-xl text-gray-400">{metric.unit}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateMetric(metric.id, -1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors"
                >
                  −
                </button>
                <button
                  onClick={() => updateMetric(metric.id, 1)}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Tasks</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Add
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No tasks yet. Add one above!</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Notes</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
              placeholder="Jot down a thought..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <button
              onClick={addNote}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Add
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No notes yet. Add one above!</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 group relative">
                  <p className="text-gray-700 pr-6">{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
