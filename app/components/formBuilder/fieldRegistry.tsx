import React from "react";
import { z } from "zod";
import { Type, CheckSquare, List, Calendar } from "lucide-react";

export interface FieldType {
  type: string;
  label: string;
  icon: React.ReactNode;
  defaultValue: unknown;
  zodSchema: z.ZodTypeAny;
  fieldProps?: Record<string, unknown>;
}

export const fieldRegistry: FieldType[] = [
  {
    type: "text",
    label: "Text Input",
    icon: <Type className="w-5 h-5" />,
    defaultValue: "",
    zodSchema: z.string().min(1, "Required"),
    fieldProps: { placeholder: "Enter text..." },
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckSquare className="w-5 h-5" />,
    defaultValue: false,
    zodSchema: z.boolean(),
  },
  {
    type: "textarea",
    label: "Textarea",
    icon: <List className="w-5 h-5" />,
    defaultValue: "",
    zodSchema: z.string().min(1, "Required"),
    fieldProps: { placeholder: "Enter longer text..." },
  },
  {
    type: "date",
    label: "Date Picker",
    icon: <Calendar className="w-5 h-5" />,
    defaultValue: "",
    zodSchema: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    fieldProps: { type: "date" },
  },
];
