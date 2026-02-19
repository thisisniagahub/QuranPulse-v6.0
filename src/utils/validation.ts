// Input validation utilities for QuranPulse v6.0

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password cannot be empty' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long (max 128 characters)' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }

  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} is too long (max 50 characters)` };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true };
};

// General text input validation
export const validateTextInput = (
  text: string, 
  fieldName: string = 'Text',
  minLength: number = 1,
  maxLength: number = 1000,
  allowEmpty: boolean = false
): ValidationResult => {
  if (!allowEmpty && (!text || text.trim().length === 0)) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (text.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters long` };
  }

  if (text.length > maxLength) {
    return { isValid: false, error: `${fieldName} is too long (max ${maxLength} characters)` };
  }

  return { isValid: true };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags completely
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Validate Arabic text (for Quran verses, etc.)
export const validateArabicText = (text: string, fieldName: string = 'Arabic text'): ValidationResult => {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  // Basic check for Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!arabicRegex.test(text)) {
    return { isValid: false, error: `${fieldName} must contain Arabic characters` };
  }

  if (text.length > 2000) {
    return { isValid: false, error: `${fieldName} is too long (max 2000 characters)` };
  }

  return { isValid: true };
};

// Validate phone number (Malaysian format)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number cannot be empty' };
  }

  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Malaysian phone number regex (starts with 01, followed by 8-11 digits)
  const phoneRegex = /^01[0-9]{8,11}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid Malaysian phone number (01xxxxxxxx)' };
  }

  return { isValid: true };
};

// Validate product data
export const validateProduct = (product: any): ValidationResult => {
  if (!product.title || product.title.trim().length === 0) {
    return { isValid: false, error: 'Product title is required' };
  }

  if (product.title.length > 200) {
    return { isValid: false, error: 'Product title is too long (max 200 characters)' };
  }

  if (!product.price || product.price < 0) {
    return { isValid: false, error: 'Product price must be a positive number' };
  }

  if (product.price > 999999) {
    return { isValid: false, error: 'Product price is too high' };
  }

  if (!product.category || !['BOOK', 'CLOTHING', 'DONATION', 'SERVICE'].includes(product.category)) {
    return { isValid: false, error: 'Please select a valid product category' };
  }

  if (product.stock < 0) {
    return { isValid: false, error: 'Stock cannot be negative' };
  }

  return { isValid: true };
};

// Check for malicious patterns in user input
export const checkMaliciousPatterns = (input: string): ValidationResult => {
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(input)) {
      return { 
        isValid: false, 
        error: 'Invalid input detected. Please remove any scripts or malicious content.' 
      };
    }
  }

  return { isValid: true };
};

// Comprehensive input validator
export const validateUserInput = (
  input: string, 
  fieldName: string = 'Input',
  options: {
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
    isEmail?: boolean;
    isPassword?: boolean;
    isArabic?: boolean;
    isPhone?: boolean;
  } = {}
): ValidationResult => {
  // First check for malicious patterns
  const maliciousCheck = checkMaliciousPatterns(input);
  if (!maliciousCheck.isValid) {
    return maliciousCheck;
  }

  // Then apply specific validation based on type
  if (options.isEmail) {
    return validateEmail(input);
  }

  if (options.isPassword) {
    return validatePassword(input);
  }

  if (options.isArabic) {
    return validateArabicText(input, fieldName);
  }

  if (options.isPhone) {
    return validatePhoneNumber(input);
  }

  // Default text validation
  return validateTextInput(
    input, 
    fieldName, 
    options.minLength, 
    options.maxLength, 
    options.allowEmpty
  );
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

// String sanitization
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return sanitizeInput(input);
};