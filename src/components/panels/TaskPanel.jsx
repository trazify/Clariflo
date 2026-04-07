import React, { useState } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import { X, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TaskItem } from './TaskItem';

export const TaskPanel = () => {
  const { activePanel, setActivePanel, tasks, addTask, toggleTask, deleteTask, reorderTasks, incrementTasksCompleted } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const isOpen = activePanel === 'tasks';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) { addTask(inputValue.trim()); setInputValue(''); }
  };

  const handleToggle = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    toggleTask(id);
    if (!task.done) {
      incrementTasksCompleted();
      const remaining = tasks.filter(t => !t.done && t.id !== id);
      if (remaining.length === 0 && tasks.length > 0) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 }, colors: ['#7c3aed', '#a78bfa', '#fcd34d', '#34d399'] });
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const priorityTaskId = tasks.find(t => !t.done)?.id;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      <div className="fixed bottom-16 left-5 z-50 w-[320px] anim-slide-up">
        <div className="glass-panel p-5 flex flex-col gap-2 max-h-[400px]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-white/80 tracking-widest uppercase">Tasks</h2>
            <button onClick={() => setActivePanel(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/35 hover:text-white transition-all cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1 flex-1">
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-white/20 text-sm">No tasks yet</div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {tasks.map(task => (
                    <TaskItem key={task.id} task={task} isPriority={task.id === priorityTaskId} onToggle={handleToggle} onDelete={deleteTask} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div className="relative mt-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a task..."
              className="w-full bg-white/5 text-white placeholder-white/20 border border-white/8 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-white/20 transition-colors pr-10"
            />
            {inputValue.trim() && (
              <button
                onClick={() => { addTask(inputValue.trim()); setInputValue(''); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
