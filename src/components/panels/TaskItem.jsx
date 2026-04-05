import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, CheckCircle2, Circle } from 'lucide-react';

export const TaskItem = ({ task, isPriority, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 py-2 px-1 rounded-lg hover:bg-white/5 transition-colors ${
        isPriority ? 'border-l-2 border-white/60 bg-white/5 pl-2 shadow-[inset_1px_0_0_rgba(255,255,255,0.1)]' : 'border-l-2 border-transparent pl-2'
      } ${task.done ? 'opacity-50' : 'opacity-100'}`}
    >
      <button 
        {...attributes} 
        {...listeners} 
        className="text-white/30 hover:text-white/70 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0 -ml-1"
      >
        <GripVertical size={15} />
      </button>

      <button onClick={() => onToggle(task.id)} className="text-white/70 hover:text-white shrink-0 p-1">
        {task.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      <span className={`flex-1 text-sm px-1 py-1 ${isPriority && !task.done ? 'text-white font-medium' : 'text-white/80'} ${task.done ? 'line-through' : ''}`}>
        {task.text}
      </span>

      <button 
        onClick={() => onDelete(task.id)}
        className="text-white/40 hover:text-white bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all p-1.5 shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
};
