import { useState, useCallback } from "react";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

type Validator<T> = (values: T) => FieldErrors<T>;

interface UseFormStateReturn<T> {
  values: T;
  errors: FieldErrors<T>;
  isSubmitting: boolean;
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: keyof T, message: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  setSubmitting: (value: boolean) => void;
  validate: (validator: Validator<T>) => boolean;
  reset: () => void;
}

export function useFormState<T extends Record<string, any>>(
  initialState: T,
): UseFormStateReturn<T> {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const setError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setSubmitting = useCallback((value: boolean) => {
    setIsSubmitting(value);
  }, []);

  const validate = useCallback(
    (validator: Validator<T>): boolean => {
      const validationErrors = validator(values);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    },
    [values],
  );

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setIsSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    setField,
    setError,
    clearError,
    clearAllErrors,
    setSubmitting,
    validate,
    reset,
  };
}
