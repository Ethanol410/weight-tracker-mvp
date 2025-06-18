import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { dailyEntrySchema } from '@/lib/validations'
import { verifyAuthToken } from '@/lib/auth'

// GET - Récupérer toutes les entrées de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification via cookie
    const authResult = await verifyAuthToken(request)
    
    // Si authResult est une NextResponse, c'est une erreur d'auth
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const payload = authResult
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Récupérer les entrées de l'utilisateur
    const entries = await prisma.dailyEntry.findMany({
      where: { userId: payload.userId },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    })
    
    return NextResponse.json({ entries }, { status: 200 })
    
  } catch (error) {
    console.error('Get entries error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des entrées' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle entrée
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via cookie
    const authResult = await verifyAuthToken(request)
    
    // Si authResult est une NextResponse, c'est une erreur d'auth
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const payload = authResult
    
    const body = await request.json()
    
    // Validation with Zod
    const validatedData = dailyEntrySchema.parse(body)
      // Vérifier si une entrée existe déjà pour cette date
    const existingEntry = await prisma.dailyEntry.findFirst({
      where: {
        userId: payload.userId,
        date: new Date(validatedData.date)
      }
    })
    
    if (existingEntry) {
      return NextResponse.json(
        { error: 'Une entrée existe déjà pour cette date. Utilisez PUT pour la modifier.' },
        { status: 400 }
      )
    }
    
    // Créer l'entrée
    const entry = await prisma.dailyEntry.create({
      data: {
        userId: payload.userId,
        date: new Date(validatedData.date),
        weight: validatedData.weight,
        fatigueLevel: validatedData.fatigueLevel,
        caloriesConsumed: validatedData.caloriesConsumed,
        steps: validatedData.steps,
      }
    })
    
    return NextResponse.json(
      { 
        message: 'Entrée créée avec succès',
        entry 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Create entry error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de l\'entrée' },
      { status: 500 }
    )
  }
}
