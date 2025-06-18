import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

// Daily entry validation schema
export const dailyEntrySchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Date invalide'),
  weight: z.number().min(30, 'Le poids doit être d\'au moins 30kg').max(300, 'Le poids ne peut pas dépasser 300kg'),
  fatigueLevel: z.number().min(1, 'Le niveau de fatigue doit être entre 1 et 10').max(10, 'Le niveau de fatigue doit être entre 1 et 10'),
  caloriesConsumed: z.number().min(0, 'Les calories ne peuvent pas être négatives').max(10000, 'Les calories ne peuvent pas dépasser 10000'),
  steps: z.number().min(0, 'Le nombre de pas ne peut pas être négatif').max(100000, 'Le nombre de pas ne peut pas dépasser 100000'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type DailyEntryInput = z.infer<typeof dailyEntrySchema>
