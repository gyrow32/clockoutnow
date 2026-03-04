import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyClientAuth } from '@/lib/client-auth'

/**
 * DELETE /api/client/[slug]/images/[id] — auth required, delete single image
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params

  if (!verifyClientAuth(req, slug)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the image record (verify it belongs to this client)
  const { data: image, error: fetchError } = await supabaseAdmin
    .from('client_images')
    .select('id, storage_path')
    .eq('id', id)
    .eq('client_slug', slug)
    .single()

  if (fetchError || !image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  // Delete from storage
  const { error: storageError } = await supabaseAdmin.storage
    .from('client-images')
    .remove([image.storage_path])

  if (storageError) {
    console.error('Storage delete error:', storageError)
  }

  // Delete DB record
  const { error: dbError } = await supabaseAdmin
    .from('client_images')
    .delete()
    .eq('id', id)

  if (dbError) {
    console.error('DB delete error:', dbError)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
