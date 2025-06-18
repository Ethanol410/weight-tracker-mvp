import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { dailyEntrySchema } from '@/lib/validations'
import { verifyAuthToken } from '@/lib/auth'

// GET - Récupérer une entrée spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Vérifier l'authentification via cookie
    const authResult = await verifyAuthToken(request)
    
    // Si authResult est une NextResponse, c'est une erreur d'auth
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const payload = authResult
    
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        id: id,
        userId: payload.userId
      }
    })
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Entrée non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ entry }, { status: 200 })
    
  } catch (error) {
    console.error('Get entry error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l\'entrée' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une entrée
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    
    // Vérifier que l'entrée existe et appartient à l'utilisateur
    const existingEntry = await prisma.dailyEntry.findFirst({
      where: {
        id: id,
        userId: payload.userId
      }
    })
    
    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entrée non trouvée' },
        { status: 404 }
      )
    }
    
    // Mettre à jour l'entrée
    const updatedEntry = await prisma.dailyEntry.update({
      where: { id: id },
      data: {
        date: new Date(validatedData.date),
        weight: validatedData.weight,
        fatigueLevel: validatedData.fatigueLevel,
        caloriesConsumed: validatedData.caloriesConsumed,
        steps: validatedData.steps,
      }
    })
    
    return NextResponse.json(
      { 
        message: 'Entrée mise à jour avec succès',
        entry: updatedEntry 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Update entry error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de l\'entrée' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une entrée
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Vérifier l'authentification via cookie
    const authResult = await verifyAuthToken(request)
    
    // Si authResult est une NextResponse, c'est une erreur d'auth
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const payload = authResult
    
    // Vérifier que l'entrée existe et appartient à l'utilisateur
    const existingEntry = await prisma.dailyEntry.findFirst({
      where: {
        id: id,
        userId: payload.userId
      }
    })
    
    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entrée non trouvée' },
        { status: 404 }
      )
    }
    
    // Supprimer l'entrée
    await prisma.dailyEntry.delete({
      where: { id: id }
    })
    
    return NextResponse.json(
      { message: 'Entrée supprimée avec succès' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Delete entry error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'entrée' },
      { status: 500 }
    )
  }
}
