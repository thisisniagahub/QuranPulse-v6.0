import { validateEmail, validatePassword, validateName, sanitizeInput } from '../../../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email cannot be empty');
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
    });

    it('should reject weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 8 characters');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('lowercase123');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('uppercase letter');
    });
  });

  describe('validateName', () => {
    it('should validate valid name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
    });

    it('should reject short name', () => {
      const result = validateName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 2 characters');
    });

    it('should reject name with special characters', () => {
      const result = validateName('John@Doe');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('letters, spaces, hyphens, and apostrophes');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const result = sanitizeInput('<script>alert("xss")</script>');
      expect(result).toBe('alert("xss")');
    });

    it('should remove javascript protocol', () => {
      const result = sanitizeInput('javascript:alert("xss")');
      expect(result).toBe('alert("xss")');
    });

    it('should handle empty input', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });
  });
});