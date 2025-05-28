import React from "react";
import { toast } from "sonner";
import { FieldInstance } from "~/redux/slices/formSlice";
import { useAppDispatch, useAppSelector } from "~/redux/hook";
import { Button } from "../ui/button";

export default function FormPreview() {
  const dispatch = useAppDispatch();
  const fields = useAppSelector((state) => state.form.fields);

  const handleChange = (id: string, value: string | boolean) => {
    dispatch(updateFieldValue({ id, value }));
  };

  const validateField = (field: FieldInstance) => {
    if (!field.required) return true;

    if (field.type === "checkbox") {
      return field.value === true;
    }

    return !!field.value?.toString().trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = fields.filter((field) => !validateField(field));
    if (errors.length > 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const formData = fields.reduce((acc, field) => {
      acc[field.label] = field.value ?? "";
      return acc;
    }, {} as Record<string, string | boolean>);

    console.log("Submitted Data:", formData);
    toast.success("Form submitted successfully!");
  };

  const renderField = (field: FieldInstance) => {
    const commonStyles =
      "w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

    switch (field.type) {
      case "input":
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={field.value as string || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={commonStyles}
          />
        );
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            value={field.value as string || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={commonStyles}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">{field.label}</span>
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            value={field.value as string || ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={commonStyles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold text-center">Preview Form</h2>

      {fields.length === 0 && (
        <p className="text-center text-gray-500">No fields added yet.</p>
      )}

      {fields.map((field) => (
        <div key={field.id} className="space-y-1">
          {field.type !== "checkbox" && (
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {renderField(field)}
          {field.required && !validateField(field) && (
            <p className="text-xs text-red-500 mt-1">This field is required.</p>
          )}
        </div>
      ))}

      {fields.length > 0 && (
        <Button type="submit" className="w-full">
          Submit Form
        </Button>
      )}
    </form>
  );
}
function updateFieldValue(arg0: { id: string; value: string | boolean; }): any {
    throw new Error("Function not implemented.");
}

