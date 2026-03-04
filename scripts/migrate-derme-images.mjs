/**
 * One-time migration: upload existing Derme gallery images to Supabase Storage
 * and insert client_images DB records.
 *
 * Usage:
 *   node scripts/migrate-derme-images.mjs
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * (reads from .env.local automatically)
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.+?)\s*$/)
    if (match) process.env[match[1]] = match[2]
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

const CLIENT_SLUG = 'derme-family-remodeling'
const IMAGE_DIR = path.join(__dirname, '..', 'public', 'preview-images', CLIENT_SLUG)
const BUCKET = 'client-images'

// Images in exact gallery order with alt text (matches the HTML)
const galleryImages = [
  { file: 'custom-cabinetry.jpg', alt: 'Custom built-in shelving and closet system' },
  { file: 'bathroom-tile.jpg', alt: 'White wavy tile shower with mosaic floor and glass door' },
  { file: 'crown-molding.jpg', alt: 'Detailed dark crown molding trim work' },
  { file: 'exterior-porch.jpg', alt: 'Exterior dark tile porch and deck work' },
  { file: 'fireplace-mantel.jpg', alt: 'Custom white fireplace mantel with wood ceiling detail' },
  { file: 'stone-fireplace-2.jpg', alt: 'Stone fireplace with mounted TV and dark wood mantel' },
  { file: 'custom-bar-2.jpg', alt: 'Custom bar with green cabinets and wine fridge' },
  { file: 'shiplap-fireplace-2.jpg', alt: 'Teal shiplap fireplace with floating shelves' },
  { file: 'kitchen-island-2.jpg', alt: 'Kitchen island with teal fluted panel detail' },
  { file: 'outdoor-pavilion-2.jpg', alt: 'Custom outdoor pavilion with white columns' },
  { file: 'stone-fireplace.jpg', alt: 'Stone fireplace detail' },
  { file: 'custom-bar.jpg', alt: 'Custom bar build' },
  { file: 'shiplap-fireplace.jpg', alt: 'Shiplap fireplace build' },
  { file: 'kitchen-island.jpg', alt: 'Kitchen island build' },
  { file: 'outdoor-pavilion.jpg', alt: 'Outdoor pavilion build' },
  { file: 'icloud-1.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-2.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-3.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-4.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-5.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-6.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-7.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-8.jpeg', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-9.png', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-10.png', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-11.png', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-12.png', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-13.png', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-14.png', alt: 'Portfolio work by Derme Family Remodeling' },
  { file: 'icloud-15.png', alt: 'Portfolio work by Derme Family Remodeling' },
]

const MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

async function migrate() {
  console.log(`Migrating ${galleryImages.length} images to Supabase...\n`)

  let success = 0
  let skipped = 0

  for (let i = 0; i < galleryImages.length; i++) {
    const { file, alt } = galleryImages[i]
    const filePath = path.join(IMAGE_DIR, file)
    const storagePath = `${CLIENT_SLUG}/${file}`
    const ext = file.split('.').pop().toLowerCase()
    const contentType = MIME_TYPES[ext] || 'image/jpeg'

    // Check if already uploaded
    const { data: existing } = await supabase
      .from('client_images')
      .select('id')
      .eq('client_slug', CLIENT_SLUG)
      .eq('filename', file)
      .limit(1)

    if (existing && existing.length > 0) {
      console.log(`  [${i + 1}/30] SKIP ${file} (already exists)`)
      skipped++
      continue
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath)

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType, upsert: true })

    if (uploadError) {
      console.error(`  [${i + 1}/30] FAIL ${file}: ${uploadError.message}`)
      continue
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath)

    // Insert DB record
    const { error: dbError } = await supabase
      .from('client_images')
      .insert({
        client_slug: CLIENT_SLUG,
        filename: file,
        storage_path: storagePath,
        url: urlData.publicUrl,
        alt_text: alt,
        display_order: i,
      })

    if (dbError) {
      console.error(`  [${i + 1}/30] DB FAIL ${file}: ${dbError.message}`)
      continue
    }

    console.log(`  [${i + 1}/30] OK ${file}`)
    success++
  }

  console.log(`\nDone: ${success} uploaded, ${skipped} skipped, ${galleryImages.length - success - skipped} failed`)
}

migrate().catch(console.error)
