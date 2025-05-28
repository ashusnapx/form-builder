import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import Canvas from "~/components/formBuilder/Canvas";
import { Sidebar } from "~/components/formBuilder/Sidebar";
import { useAppDispatch } from "~/redux/hook";
import { addField } from "~/redux/slices/formSlice";
import { useState } from "react";
import { fieldRegistry } from "~/components/formBuilder/fieldRegistry";
import FormPreview from "~/components/formBuilder/FormPreview";

export default function Step2a() {
  const dispatch = useAppDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === "canvas") {
      const fieldType = active.id;
      const field = {
        type: fieldType,
        id: crypto.randomUUID(),
        label: "Untitled",
      };
      dispatch(addField(field));
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id.toString());
};

  // Find dragged field info to render in DragOverlay
  const activeField = fieldRegistry.find((f) => f.type === activeId);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex h-screen relative">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-950">
          <h1 className="text-xl font-bold mb-4">Form Builder Canvas</h1>
                 <div className="flex gap-8">
  <Canvas />
  <FormPreview />
</div>
                  
        </main>

        {/* DragOverlay renders dragged item on top of everything */}
        <DragOverlay>
          {activeField ? (
            <div
              className="flex items-center gap-2 p-2 rounded border border-blue-500 bg-white dark:bg-gray-900 shadow-lg cursor-grab select-none"
              style={{ width: 200 }}
            >
              {activeField.icon}
              <span className="text-sm font-medium">{activeField.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
