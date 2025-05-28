import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { fieldRegistry, FieldType } from "./fieldRegistry";

/* eslint-disable react/prop-types */
const DraggableField: React.FC<{ field: FieldType }> = React.memo(({ field }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: field.type,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="flex items-center gap-2 p-2 mb-2 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 select-none"
      role="button"
      tabIndex={0}
      aria-grabbed={isDragging}
    >
      {field.icon}
      <span className="text-sm font-medium">{field.label}</span>
    </div>
  );
});

DraggableField.displayName = "DraggableField";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 p-4 border-r border-gray-300 dark:border-gray-700 h-full overflow-y-auto bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">Add Fields</h2>
      {fieldRegistry.map((field) => (
        <DraggableField key={field.type} field={field} />
      ))}
    </aside>
  );
};
