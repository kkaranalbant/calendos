/**
 * Validation utilities for form inputs
 */

export const validation = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * - Minimum 8 characters
   * - At least one letter
   * - At least one number
   */
  password: (password: string): boolean => {
    if (password.length < 8) {
      return false;
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  },

  /**
   * Validate Turkish phone number
   * Accepts formats: 05xx xxx xx xx, 5xx xxx xx xx, +905xx xxx xx xx
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^(\+90|0)?5\d{9}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone);
  },

  /**
   * Validate required field
   */
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  /**
   * Validate minimum length
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

/**
 * Error messages for validation
 */
export const validationMessages = {
  email: {
    invalid: 'Geçerli bir e-posta adresi girin',
    required: 'E-posta adresi gerekli',
  },
  password: {
    invalid: 'Şifre en az 8 karakter, bir harf ve bir rakam içermelidir',
    required: 'Şifre gerekli',
    mismatch: 'Şifreler eşleşmiyor',
  },
  phone: {
    invalid: 'Geçerli bir telefon numarası girin (örn: 05xx xxx xx xx)',
    required: 'Telefon numarası gerekli',
  },
  name: {
    required: 'İsim gerekli',
    minLength: 'İsim en az 2 karakter olmalı',
  },
  required: 'Bu alan gerekli',
};

/**
 * Get validation error message
 */
export const getValidationError = (
  field: string,
  value: string,
  rules: {
    required?: boolean;
    email?: boolean;
    password?: boolean;
    phone?: boolean;
    minLength?: number;
    maxLength?: number;
  }
): string | null => {
  if (rules.required && !validation.required(value)) {
    return validationMessages.required;
  }

  if (rules.email && value && !validation.email(value)) {
    return validationMessages.email.invalid;
  }

  if (rules.password && value && !validation.password(value)) {
    return validationMessages.password.invalid;
  }

  if (rules.phone && value && !validation.phone(value)) {
    return validationMessages.phone.invalid;
  }

  if (rules.minLength && value && !validation.minLength(value, rules.minLength)) {
    return `En az ${rules.minLength} karakter olmalı`;
  }

  if (rules.maxLength && value && !validation.maxLength(value, rules.maxLength)) {
    return `En fazla ${rules.maxLength} karakter olmalı`;
  }

  return null;
};

// Named exports for convenience (used by EditProfileScreen and AddressFormScreen)
export const validateEmail = validation.email;
export const validatePhone = validation.phone;
export const validatePassword = validation.password;
