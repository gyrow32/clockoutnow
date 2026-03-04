import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyClientAuth } from '@/lib/client-auth'

/**
 * GET /api/client/[slug]/images — public, returns images ordered by display_order
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const { data, error } = await supabase
    .from('client_images')
    .select('id, filename, url, alt_text, display_order')
    .eq('client_slug', slug)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching client images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }

  return NextResponse.json({ images: data })
}

/**
 * POST /api/client/[slug]/images — auth required, upload image
 * Accepts multipart form: file + alt_text
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!verifyClientAuth(req, slug)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const altText = (formData.get('alt_text') as string) || ''

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
      { status: 400 }
    )
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .substring(0, 50)
  const storagePath = `${slug}/${timestamp}-${safeName}.${ext}`

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabaseAdmin.storage
    .from('client-images')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('client-images')
    .getPublicUrl(storagePath)

  // Get next display_order
  const { data: maxOrder } = await supabaseAdmin
    .from('client_images')
    .select('display_order')
    .eq('client_slug', slug)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrder?.display_order ?? -1) + 1

  // Insert DB record
  const { data: record, error: dbError } = await supabaseAdmin
    .from('client_images')
    .insert({
      client_slug: slug,
      filename: file.name,
      storage_path: storagePath,
      url: urlData.publicUrl,
      alt_text: altText,
      display_order: nextOrder,
    })
    .select()
    .single()

  if (dbError) {
    console.error('DB insert error:', dbError)
    // Clean up uploaded file
    await supabaseAdmin.storage.from('client-images').remove([storagePath])
    return NextResponse.json({ error: 'Failed to save image record' }, { status: 500 })
  }

  return NextResponse.json({ image: record }, { status: 201 })
}
