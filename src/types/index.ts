export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface DailyEntry {
  id: string
  userId: string
  date: Date
  weight: number
  fatigueLevel: number
  caloriesConsumed: number
  steps: number
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  userId: string
  email: string
  name: string
}
