import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FieldType = "input" | "textarea" | "checkbox" | "date";

export interface FieldInstance {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
    value?: string | boolean;
    helpText?: string;
}

interface FormState {
  fields: FieldInstance[];
  selectedFieldId: string | null;
}

const initialState: FormState = {
  fields: [],
  selectedFieldId: null,
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FieldInstance>) => {
      state.fields.push(action.payload);
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
    },
    updateLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) field.label = action.payload.label;
    },
    updateValue: (
      state,
      action: PayloadAction<{ id: string; value: string }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) field.value = action.payload.value;
    },
    updateFieldsOrder: (state, action: PayloadAction<FieldInstance[]>) => {
      state.fields = action.payload;
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    resetForm: (state) => {
      state.fields = [];
      state.selectedFieldId = null;
    },
  },
});

export const {
  addField,
  removeField,
  updateLabel,
  updateValue,
  updateFieldsOrder,
  selectField,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
