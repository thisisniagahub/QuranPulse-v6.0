/**
 * Form Schemas - Zod Validation
 * 
 * QuranPulse v6.0 Form Validation Layer
 * Centralized validation schemas for all forms
 */

import { z } from 'zod';

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email diperlukan')
        .email('Format email tidak sah'),
    password: z
        .string()
        .min(1, 'Kata laluan diperlukan')
        .min(6, 'Kata laluan mestilah sekurang-kurangnya 6 aksara'),
});

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Nama diperlukan')
        .min(2, 'Nama mestilah sekurang-kurangnya 2 aksara'),
    email: z
        .string()
        .min(1, 'Email diperlukan')
        .email('Format email tidak sah'),
    password: z
        .string()
        .min(1, 'Kata laluan diperlukan')
        .min(8, 'Kata laluan mestilah sekurang-kurangnya 8 aksara')
        .regex(/[A-Z]/, 'Kata laluan mesti mengandungi huruf besar')
        .regex(/[0-9]/, 'Kata laluan mesti mengandungi nombor'),
    confirmPassword: z
        .string()
        .min(1, 'Pengesahan kata laluan diperlukan'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Kata laluan tidak sepadan',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email diperlukan')
        .email('Format email tidak sah'),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, 'Kata laluan diperlukan')
        .min(8, 'Kata laluan mestilah sekurang-kurangnya 8 aksara'),
    confirmPassword: z
        .string()
        .min(1, 'Pengesahan kata laluan diperlukan'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Kata laluan tidak sepadan',
    path: ['confirmPassword'],
});

// ============================================
// Profile Schemas
// ============================================

export const profileSchema = z.object({
    displayName: z
        .string()
        .min(2, 'Nama mestilah sekurang-kurangnya 2 aksara')
        .max(50, 'Nama tidak boleh melebihi 50 aksara'),
    bio: z
        .string()
        .max(200, 'Bio tidak boleh melebihi 200 aksara')
        .optional(),
    location: z
        .string()
        .max(100, 'Lokasi tidak boleh melebihi 100 aksara')
        .optional(),
    website: z
        .string()
        .url('Format URL tidak sah')
        .optional()
        .or(z.literal('')),
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'Kata laluan semasa diperlukan'),
    newPassword: z
        .string()
        .min(8, 'Kata laluan baharu mestilah sekurang-kurangnya 8 aksara')
        .regex(/[A-Z]/, 'Kata laluan mesti mengandungi huruf besar')
        .regex(/[0-9]/, 'Kata laluan mesti mengandungi nombor'),
    confirmNewPassword: z
        .string()
        .min(1, 'Pengesahan kata laluan diperlukan'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Kata laluan tidak sepadan',
    path: ['confirmNewPassword'],
});

// ============================================
// Iqra Schemas
// ============================================

export const lessonFeedbackSchema = z.object({
    rating: z
        .number()
        .min(1, 'Rating diperlukan')
        .max(5, 'Rating maksimum 5'),
    difficulty: z.enum(['easy', 'medium', 'hard'], {
        message: 'Sila pilih tahap kesukaran',
    }),
    feedback: z
        .string()
        .max(500, 'Maklum balas tidak boleh melebihi 500 aksara')
        .optional(),
    wouldRecommend: z.boolean().optional(),
});

export const quizAnswerSchema = z.object({
    questionId: z.string(),
    selectedAnswer: z.string().min(1, 'Sila pilih jawapan'),
    timeSpent: z.number().optional(),
});

// ============================================
// Type Exports
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type LessonFeedbackFormData = z.infer<typeof lessonFeedbackSchema>;
export type QuizAnswerFormData = z.infer<typeof quizAnswerSchema>;
