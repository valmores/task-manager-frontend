'use client';

import { useState, useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { RoomVisibility } from '@/types/internal-notes';

export interface FormState {
  name: string;
  visibility: RoomVisibility;
  project: number | null;
  touched: {
    name: boolean;
    visibility: boolean;
    project: boolean;
  };
}

export const INITIAL_FORM_STATE: FormState = {
  name: '',
  visibility: RoomVisibility.INTERNAL,
  project: null,
  touched: {
    name: false,
    visibility: false,
    project: false,
  },
};

export const useRoomCreateForm = (onSubmit?: (data: {
  name: string;
  visibility: RoomVisibility;
  project?: number | null;
}) => void | Promise<void>) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);

  /**
   * Validate form
   */
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!form.name.trim()) {
      errors.name = 'Room name is required';
    } else if (form.name.trim().length < 3) {
      errors.name = 'Room name must be at least 3 characters';
    } else if (form.name.trim().length > 100) {
      errors.name = 'Room name must be at most 100 characters';
    }

    // Project validation for PROJECT_SPECIFIC
    if (form.visibility === RoomVisibility.PROJECT_SPECIFIC) {
      if (!form.project) {
        errors.project = 'Project is required for project-specific rooms';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [form]);

  const { isValid, errors } = validateForm();

  /**
   * Handle field change
   */
  const handleChange = (field: keyof Omit<FormState, 'touched'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
  ) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));
  };

  /**
   * Handle field blur
   */
  const handleBlur = (field: keyof FormState['touched']) => () => {
    setForm((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));
  };

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
  }, []);

  /**
   * Handle submit
   */
  const handleSubmit = async () => {
    const { isValid } = validateForm();

    if (!isValid) {
      return;
    }

    try {
      await onSubmit?.({
        name: form.name.trim(),
        visibility: form.visibility,
        project: form.visibility === RoomVisibility.PROJECT_SPECIFIC ? form.project : null,
      });

      // Reset form on success
      resetForm();
    } catch (err) {
      console.error('Error creating room in hook:', err);
      throw err; // Propagate to component if needed
    }
  };

  return {
    form,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    showProjectField: form.visibility === RoomVisibility.PROJECT_SPECIFIC,
  };
};
