import { useState } from "react";
import { useDroppable, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import {
  removeField,
  updateFieldsOrder,
  updateLabel,
} from "~/redux/slices/formSlice";
import { FieldType, fieldRegistry } from "./fieldRegistry";
import { Edit2, GripVertical, X } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";



type FieldInstance = {
  id: string;
  type: keyof typeof fieldRegistry;
  label: string;
};

const SortableItem = ({
  field,
  onDelete,
  onLabelChange,
}: {
  field: FieldInstance;
  onDelete: (id: string) => void;
  onLabelChange: (id: string, newLabel: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(field.label);

  const IconComponent = fieldRegistry[field.type]?.icon;

  const handleLabelSubmit = () => {
    setIsEditing(false);
    if (label.trim() !== "") {
      onLabelChange(field.id, label.trim());
    } else {
      setLabel(field.label); // revert
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between gap-4 p-4 border-muted bg-background shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        {IconComponent && (
          <IconComponent className="w-5 h-5 text-muted-foreground shrink-0" />
        )}

        {isEditing ? (
          <Input
            // autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLabelSubmit();
              if (e.key === "Escape") {
                setIsEditing(false);
                setLabel(field.label);
              }
            }}
            className="text-sm"
          />
        ) : (
          <div className="flex items-center gap-2 truncate">
            <span className="truncate font-medium">{label}</span>
            <span className="text-muted-foreground text-xs">({field.type})</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isEditing && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                aria-label="Edit label"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Are you sure you want to delete this field?")) {
                  onDelete(field.id);
                }
              }}
              aria-label="Delete field"
            >
              <X className="w-4 h-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
              </Tooltip>
              <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Drag Field"
            >
              <GripVertical className="w-4 h-4 text-destructive" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </div>
    </Card>
  );
};

const Canvas = () => {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  const formFields = useAppSelector((state) => state.form.fields);
  const dispatch = useAppDispatch();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = formFields.findIndex((f) => f.id === active.id);
      const newIndex = formFields.findIndex((f) => f.id === over.id);
      dispatch(updateFieldsOrder(arrayMove(formFields, oldIndex, newIndex)));
    }
  };

  const handleDelete = (id: string) => dispatch(removeField(id));
  const handleLabelChange = (id: string, newLabel: string) =>
    dispatch(updateLabel({ id, label: newLabel }));

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        className="flex flex-col gap-3 p-6 border-2 border-dashed border-muted rounded-xl bg-muted/30 min-h-[400px]"
      >
        {formFields.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center mt-10">
            🧩 Drop fields here to build your form
          </p>
        ) : (
          <SortableContext
            items={formFields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {formFields.map((field) => (
              <SortableItem
                key={field.id}
                field={field}
                onDelete={handleDelete}
                onLabelChange={handleLabelChange}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </DndContext>
  );
};

export default Canvas;
