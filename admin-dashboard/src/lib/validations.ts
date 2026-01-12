import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  subscription_tier: z.enum(['FREE', 'PREMIUM', 'FAMILY', 'LIFETIME']).default('FREE'),
  is_active: z.boolean().optional(),
});

export const UserUpdateSchema = UserSchema.partial();

export const BannerSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  image_url: z.string().url(),
  link_url: z.string().url().nullable().optional(),
  active: z.boolean().default(true),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});

export const BannerUpdateSchema = BannerSchema.partial();

export const KnowledgeBaseSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  source: z.string().min(3),
  category: z.enum(['general', 'fiqh', 'tajweed', 'seerah', 'other']),
});

export const KnowledgeBaseUpdateSchema = KnowledgeBaseSchema.partial();

export const IqraLessonSchema = z.object({
  volume: z.number().int().min(1).max(6),
  page: z.number().int().min(1),
  line: z.number().int().min(1),
  arabic_text: z.string().min(1),
  transliteration: z.string().min(1),
  audio_url: z.string().url().nullable().optional(),
  status: z.enum(['pending', 'validated', 'live', 'rejected']).default('pending'),
});

export const IqraLessonUpdateSchema = IqraLessonSchema.partial();
