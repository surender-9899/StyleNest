import { Pencil, Trash2, ImagePlus, X, Link2, Folder } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function Categories() {
  const [cats, setCats] = useState([])
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [removeExistingImage, setRemoveExistingImage] = useState(false)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [useUrlInput, setUseUrlInput] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  async function load() {
    try {
      const r = await api.get('/admin/categories')
      setCats(r.data.categories || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load categories.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  function resetForm() {
    setName('')
    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
    setExistingImageUrl('')
    setRemoveExistingImage(false)
    setUseUrlInput(false)
    setEditing(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.')
      return
    }

    setError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setRemoveExistingImage(false)
  }

  function handleStartEdit(c) {
    setEditing(c)
    setName(c.name)
    setExistingImageUrl(c.image || c.imageUrl || '')
    setImageFile(null)
    setImagePreview('')
    setImageUrl(c.image || c.imageUrl || '')
    setRemoveExistingImage(false)
    setUseUrlInput(false)
    setError('')
  }

  function handleClearImage() {
    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
    if (editing) {
      setRemoveExistingImage(true)
      setExistingImageUrl('')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function save(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())

      if (imageFile) {
        formData.append('image', imageFile)
      } else if (useUrlInput && imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim())
      } else if (removeExistingImage) {
        formData.append('removeImage', 'true')
      }

      if (editing) {
        await api.put(`/admin/categories/${editing._id}`, formData)
      } else {
        await api.post('/admin/categories', formData)
      }

      resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category.')
    } finally {
      setLoading(false)
    }
  }

  async function del(c) {
    if (!confirm(`Delete "${c.name}"? This action cannot be undone.`)) return
    try {
      await api.delete(`/admin/categories/${c._id}`)
      if (editing?._id === c._id) resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete category.')
    }
  }

  const activeImage = imagePreview || existingImageUrl

  return (
    <div>
      <p className="eyebrow">Catalogue structure</p>
      <h1 className="mt-2 text-3xl font-semibold">Categories</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Form Card */}
        <form onSubmit={save} className="card p-5 sm:p-6 self-start space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {editing ? 'Edit category' : 'Add new category'}
            </h2>
            {editing && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                Editing
              </span>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label className="label">Category Name *</label>
            <input
              className="field"
              required
              placeholder="e.g. Accessories, Shoes, Bags"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Cover Image</label>
              <button
                type="button"
                className="text-xs font-semibold text-neutral-500 hover:text-ink"
                onClick={() => setUseUrlInput(!useUrlInput)}
              >
                {useUrlInput ? 'Upload file instead' : 'Or paste URL'}
              </button>
            </div>

            {useUrlInput ? (
              <div className="mt-2">
                <div className="flex items-center rounded-xl border border-neutral-200 bg-white px-3 focus-within:border-ink">
                  <Link2 size={16} className="text-neutral-400 shrink-0" />
                  <input
                    type="url"
                    className="w-full bg-transparent px-2.5 py-2.5 text-sm outline-none"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      setImagePreview(e.target.value)
                      setRemoveExistingImage(false)
                    }}
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('')
                        setImagePreview('')
                      }}
                      className="text-neutral-400 hover:text-ink"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-neutral-400">
                  Direct web link for the featured category background image.
                </p>
              </div>
            ) : (
              <div className="mt-2">
                {activeImage ? (
                  <div className="relative group overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                    <img
                      src={activeImage}
                      alt="Category preview"
                      className="h-44 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow hover:bg-neutral-100"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                      {imageFile ? imageFile.name : 'Current Image'}
                    </span>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6 text-center hover:border-neutral-300 hover:bg-neutral-100/60 transition-colors">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm text-neutral-500">
                      <ImagePlus size={20} />
                    </div>
                    <span className="mt-2 text-sm font-semibold text-ink">
                      Choose category image
                    </span>
                    <span className="mt-1 text-xs text-neutral-400">
                      JPG, PNG, WebP up to 5 MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <Spinner className="h-4 w-4 border-white/40 border-t-white" />
              ) : editing ? (
                'Update category'
              ) : (
                'Add category'
              )}
            </button>
            {editing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Categories List Card */}
        <div className="card overflow-hidden">
          <div className="border-b border-neutral-100 p-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">All categories</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {cats.length} {cats.length === 1 ? 'category' : 'categories'} configured
              </p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {cats.map((c) => {
              const coverImg = c.image || c.imageUrl
              return (
                <div
                  key={c._id}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Category Thumbnail */}
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={c.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Folder size={18} className="text-neutral-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink truncate">
                          {c.name}
                        </p>
                        {coverImg ? (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            Has image
                          </span>
                        ) : (
                          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                            No image
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate">/{c.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      title="Edit category"
                      className="grid h-9 w-9 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100"
                      onClick={() => handleStartEdit(c)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      title="Delete category"
                      className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                      onClick={() => del(c)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}

            {!cats.length && (
              <div className="p-12 text-center">
                <Folder size={32} className="mx-auto text-neutral-300" />
                <p className="mt-3 text-sm font-semibold text-ink">No categories yet</p>
                <p className="mt-1 text-xs text-neutral-400">
                  Add your first category using the form on the left.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
