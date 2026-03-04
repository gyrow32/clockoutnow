'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

interface GalleryImage {
  id: string
  filename: string
  url: string
  alt_text: string
  display_order: number
}

export default function PortalPage() {
  const { slug } = useParams<{ slug: string }>()
  const [authorized, setAuthorized] = useState(false)
  const [authKey, setAuthKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [authError, setAuthError] = useState(false)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [altText, setAltText] = useState('')
  const [orderChanged, setOrderChanged] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${authKey}` }),
    [authKey]
  )

  // Verify key
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    const key = keyInput.trim()
    if (!key) return

    try {
      const res = await fetch(`/api/client/${slug}/verify`, {
        headers: { Authorization: `Bearer ${key}` },
      })
      if (res.ok) {
        setAuthKey(key)
        setAuthorized(true)
        setAuthError(false)
      } else {
        setAuthError(true)
      }
    } catch {
      setAuthError(true)
    }
  }

  // Fetch images
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/client/${slug}/images`)
      if (res.ok) {
        const data = await res.json()
        setImages(data.images || [])
      }
    } catch (err) {
      console.error('Failed to fetch images:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (authorized) fetchImages()
  }, [authorized, fetchImages])

  // Upload
  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('alt_text', altText)

      const res = await fetch(`/api/client/${slug}/images`, {
        method: 'POST',
        headers: headers(),
        body: form,
      })

      if (res.ok) {
        setAltText('')
        if (fileRef.current) fileRef.current.value = ''
        await fetchImages()
      } else {
        const err = await res.json()
        alert(err.error || 'Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Delete
  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm(`Delete "${image.filename}"?`)) return

    try {
      const res = await fetch(`/api/client/${slug}/images/${image.id}`, {
        method: 'DELETE',
        headers: headers(),
      })
      if (res.ok) {
        await fetchImages()
      } else {
        alert('Delete failed')
      }
    } catch {
      alert('Delete failed')
    }
  }

  // Reorder
  const moveImage = (index: number, direction: -1 | 1) => {
    const newImages = [...images]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= newImages.length) return
    ;[newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]]
    setImages(newImages)
    setOrderChanged(true)
  }

  const saveOrder = async () => {
    setSavingOrder(true)
    try {
      const order = images.map((img, i) => ({ id: img.id, display_order: i }))
      const res = await fetch(`/api/client/${slug}/images/reorder`, {
        method: 'PATCH',
        headers: { ...headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      })
      if (res.ok) {
        setOrderChanged(false)
        await fetchImages()
      } else {
        alert('Failed to save order')
      }
    } catch {
      alert('Failed to save order')
    } finally {
      setSavingOrder(false)
    }
  }

  // --- Auth Lock Screen ---
  if (!authorized) {
    return (
      <div style={styles.lockScreen}>
        <div style={styles.lockCard}>
          <h1 style={styles.lockTitle}>Image Portal</h1>
          <p style={styles.lockSub}>
            Enter your access key to manage gallery images.
          </p>
          <form onSubmit={handleUnlock} style={styles.lockForm}>
            <input
              type="password"
              placeholder="Access key"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value)
                setAuthError(false)
              }}
              style={{
                ...styles.input,
                ...(authError ? { borderColor: '#ef4444' } : {}),
              }}
            />
            {authError && (
              <p style={styles.errorText}>Invalid key. Please try again.</p>
            )}
            <button type="submit" style={styles.btnPrimary}>
              Unlock
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- Dashboard ---
  const displayName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{displayName}</h1>
        <span style={styles.headerSub}>Image Portal</span>
      </header>

      {/* Upload Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Upload Image</h2>
        <div style={styles.uploadRow}>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={styles.fileInput}
          />
          <input
            type="text"
            placeholder="Alt text (describe the image)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            style={{ ...styles.input, flex: 1 }}
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              ...styles.btnPrimary,
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Gallery ({images.length} image{images.length !== 1 ? 's' : ''})
          </h2>
          {orderChanged && (
            <button
              onClick={saveOrder}
              disabled={savingOrder}
              style={{
                ...styles.btnPrimary,
                background: '#16a34a',
                opacity: savingOrder ? 0.6 : 1,
              }}
            >
              {savingOrder ? 'Saving...' : 'Save Order'}
            </button>
          )}
        </div>

        {loading ? (
          <p style={styles.loadingText}>Loading images...</p>
        ) : images.length === 0 ? (
          <p style={styles.emptyText}>
            No images yet. Upload your first image above.
          </p>
        ) : (
          <div style={styles.grid}>
            {images.map((img, i) => (
              <div key={img.id} style={styles.card}>
                <div style={styles.imgWrap}>
                  <img
                    src={img.url}
                    alt={img.alt_text}
                    style={styles.img}
                    loading="lazy"
                  />
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.cardFilename} title={img.filename}>
                    {img.filename}
                  </p>
                  <p style={styles.cardAlt}>{img.alt_text || '(no alt text)'}</p>
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      style={{
                        ...styles.btnSmall,
                        opacity: i === 0 ? 0.3 : 1,
                      }}
                      title="Move up"
                    >
                      &#9650;
                    </button>
                    <button
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      style={{
                        ...styles.btnSmall,
                        opacity: i === images.length - 1 ? 0.3 : 1,
                      }}
                      title="Move down"
                    >
                      &#9660;
                    </button>
                    <button
                      onClick={() => handleDelete(img)}
                      style={{ ...styles.btnSmall, color: '#ef4444' }}
                      title="Delete"
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// --- Inline styles (no extra deps) ---
const styles: Record<string, React.CSSProperties> = {
  lockScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  lockCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '2.5rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  lockTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.5rem',
    color: '#1e293b',
  },
  lockSub: {
    color: '#64748b',
    fontSize: '0.95rem',
    margin: '0 0 1.5rem',
  },
  lockForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.85rem',
    margin: 0,
  },
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: '#1e293b',
    color: '#fff',
    padding: '1.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0,
  },
  headerSub: {
    fontSize: '0.85rem',
    opacity: 0.7,
  },
  section: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1.5rem 2rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  },
  uploadRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '0.75rem',
  },
  input: {
    padding: '0.6rem 0.9rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  fileInput: {
    fontSize: '0.9rem',
  },
  btnPrimary: {
    background: '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSmall: {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '0.25rem 0.5rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    lineHeight: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
  },
  imgWrap: {
    width: '100%',
    height: '160px',
    overflow: 'hidden',
    background: '#f1f5f9',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '0.75rem',
  },
  cardFilename: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#334155',
    margin: '0 0 0.25rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardAlt: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    margin: '0 0 0.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardActions: {
    display: 'flex',
    gap: '0.35rem',
  },
  loadingText: {
    color: '#64748b',
    textAlign: 'center',
    padding: '3rem 0',
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    padding: '3rem 0',
  },
}
