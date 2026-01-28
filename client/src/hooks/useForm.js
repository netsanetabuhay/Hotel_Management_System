import { useState, useCallback } from 'react';
import * as validators from '../utils/validators';

/**
 * Custom hook for form state management
 * Provides form state, validation, and submission handling
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  /**
   * Update form field value
   */
  const handleChange = useCallback((field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [errors]);

  /**
   * Handle field blur (touch)
   */
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    // Validate on blur if rule exists
    if (validationRules[field]) {
      const error = validateField(field, values[field]);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [field]: error,
        }));
      }
    }
  }, [validationRules, values]);

  /**
   * Validate single field
   */
  const validateField = useCallback((field, value) => {
    if (!validationRules[field]) return '';

    const rule = validationRules[field];
    
    // String validator function name
    if (typeof rule === 'string') {
      const validator = validators[rule];
      if (validator) {
        return validator(value, field);
      }
    }
    
    // Custom validation function
    if (typeof rule === 'function') {
      return rule(value, values);
    }
    
    // Object with validator and params
    if (typeof rule === 'object' && rule.validator) {
      const validator = validators[rule.validator];
      if (validator) {
        return validator(value, field, ...(rule.params || []));
      }
    }

    return '';
  }, [validationRules, values]);

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  /**
   * Set form values
   */
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  /**
   * Get field props for input components
   */
  const getFieldProps = useCallback((field) => ({
    name: field,
    value: values[field] || '',
    onChange: (e) => handleChange(field, e.target.value),
    onBlur: () => handleBlur(field),
    error: errors[field] || '',
    touched: touched[field] || false,
  }), [values, errors, touched, handleChange, handleBlur]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    
    // Actions
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    validateForm,
    
    // Helpers
    getFieldProps,
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    hasErrors: Object.keys(errors).length > 0,
  };
};

export default useForm;