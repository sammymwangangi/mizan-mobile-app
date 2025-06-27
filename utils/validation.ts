// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Phone number validation
export const validatePhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) {
    return 'Phone number is required';
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (assuming international format)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};

// OTP validation
export const validateOTP = (otp: string): string | null => {
  if (!otp) {
    return 'OTP is required';
  }
  
  if (otp.length !== 6) {
    return 'OTP must be 6 digits';
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return 'OTP must contain only numbers';
  }
  
  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return 'Name can only contain letters and spaces';
  }
  
  return null;
};

// Generic required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  return null;
};

// Utility function to validate multiple fields at once
export const validateFields = (fields: { [key: string]: { value: string; validator: (value: string) => string | null } }): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(fields).forEach(fieldName => {
    const { value, validator } = fields[fieldName];
    const error = validator(value);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};
