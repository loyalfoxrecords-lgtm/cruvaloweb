'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  summary: string
  content: string
  image_url: string
  source: string
  league: string
  team: string
  author: string
  published_at: string
  is_featured: boolean
  is_published: boolean
}

const emptyArticle = {
  title: '',
  summary: '',
  content: '',
  image_url: '',
  source: 'Cruvalo',
  league: 'La Liga',
  team: '',
  author: '',
  is_featured: false,
  is_published: false,
}

const leagues = ['La Liga', 'Premier', 'Champions', 'Bundesliga', 'Serie A', 'Ligue 1', 'Selecciones', 'Otro']

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [form, setForm] = useState(emptyArticle)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState<'list' | 'new'>('list')

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setArticles(data)
  }

  async function saveArticle() {
    setLoading(true)
    setMessage('')

    if (!form.title.trim()) {
      setMessage('❌ El título es obligatorio')
      setLoading(false)
      return
    }

    const payload = {
      ...form,
      published_at: new Date().toISOString(),
    }

    let error
    if (editingId) {
      const res = await supabase.from('articles').update(payload).eq('id', editingId)
      error = res.error
    } else {
      const res = await supabase.from('articles').insert(payload)
      error = res.error
    }

    if (error) {
      setMessage(`❌ Error: ${error.message}`)
    } else {
      setMessage(editingId ? '✅ Noticia actualizada' : '✅ Noticia publicada')
      setForm(emptyArticle)
      setEditingId(null)
      setTab('list')
      fetchArticles()
    }
    setLoading(false)
  }

  async function deleteArticle(id: string) {
    if (!confirm('¿Eliminar esta noticia?')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
  }

  async function togglePublished(article: Article) {
    await supabase
      .from('articles')
      .update({ is_published: !article.is_published })
      .eq('id', article.id)
    fetchArticles()
  }

  function editArticle(article: Article) {
    setForm({
      title: article.title,
      summary: article.summary || '',
      content: article.content || '',
      image_url: article.image_url || '',
      source: article.source || 'Cruvalo',
      league: article.league || 'La Liga',
      team: article.team || '',
      author: article.author || '',
      is_featured: article.is_featured,
      is_published: article.is_published,
    })
    setEditingId(article.id)
    setTab('new')
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            backgroundColor: 'var(--primary)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'black', fontWeight: 800, fontSize: '16px',
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
            Cruvalo Admin
          </span>
        </div>
        <Link href="/" style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          ← Ver web
        </Link>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => { setTab('list'); setEditingId(null); setForm(emptyArticle) }}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: tab === 'list' ? 'var(--primary)' : 'var(--bg-card)',
              color: tab === 'list' ? 'black' : 'var(--text-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: tab === 'list' ? 'var(--primary)' : 'var(--border)',
            }}
          >
            📋 Noticias ({articles.length})
          </button>
          <button
            onClick={() => setTab('new')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: tab === 'new' ? 'var(--primary)' : 'var(--bg-card)',
              color: tab === 'new' ? 'black' : 'var(--text-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: tab === 'new' ? 'var(--primary)' : 'var(--border)',
            }}
          >
            ✏️ {editingId ? 'Editar noticia' : 'Nueva noticia'}
          </button>
        </div>

        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
            color: message.includes('✅') ? '#166534' : '#991b1b',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            {message}
          </div>
        )}

        {/* Lista de noticias */}
        {tab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {articles.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No hay noticias aún</p>
                <button
                  onClick={() => setTab('new')}
                  style={btnPrimary}
                >
                  + Crear primera noticia
                </button>
              </div>
            ) : (
              articles.map(article => (
                <div key={article.id} style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                }}>
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 700,
                        color: 'var(--primary)', letterSpacing: '0.5px',
                      }}>
                        {article.league?.toUpperCase()}
                      </span>
                      {article.is_featured && (
                        <span style={{
                          fontSize: '10px', backgroundColor: '#fef3c7',
                          color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontWeight: 600,
                        }}>DESTACADA</span>
                      )}
                    </div>
                    <p style={{
                      fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {article.title}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {article.source} · {new Date(article.published_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => togglePublished(article)}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', border: 'none',
                        cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        backgroundColor: article.is_published ? '#dcfce7' : '#f1f5f9',
                        color: article.is_published ? '#166534' : 'var(--text-muted)',
                      }}
                    >
                      {article.is_published ? '✓ Publicada' : 'Borrador'}
                    </button>
                    <button onClick={() => editArticle(article)} style={btnSecondary}>✏️</button>
                    <button onClick={() => deleteArticle(article.id)} style={{ ...btnSecondary, color: 'var(--live-red)' }}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Formulario nueva noticia */}
        {tab === 'new' && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--text-primary)' }}>
              {editingId ? 'Editar noticia' : 'Nueva noticia'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Título */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Título *</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Título de la noticia"
                  style={inputStyle}
                />
              </div>

              {/* Resumen */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Resumen</label>
                <textarea
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  placeholder="Breve resumen de la noticia..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Contenido */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Contenido completo</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Escribe el artículo completo aquí..."
                  rows={10}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* URL imagen */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>URL de imagen</label>
                <input
                  value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  style={inputStyle}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    style={{ marginTop: '8px', width: '200px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                  />
                )}
              </div>

              {/* Liga */}
              <div>
                <label style={labelStyle}>Liga</label>
                <select
                  value={form.league}
                  onChange={e => setForm({ ...form, league: e.target.value })}
                  style={inputStyle}
                >
                  {leagues.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Equipo */}
              <div>
                <label style={labelStyle}>Equipo</label>
                <input
                  value={form.team}
                  onChange={e => setForm({ ...form, team: e.target.value })}
                  placeholder="Real Madrid, Barcelona..."
                  style={inputStyle}
                />
              </div>

              {/* Fuente */}
              <div>
                <label style={labelStyle}>Fuente</label>
                <input
                  value={form.source}
                  onChange={e => setForm({ ...form, source: e.target.value })}
                  placeholder="Marca, AS, Cruvalo..."
                  style={inputStyle}
                />
              </div>

              {/* Autor */}
              <div>
                <label style={labelStyle}>Autor</label>
                <input
                  value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                  placeholder="Nombre del autor"
                  style={inputStyle}
                />
              </div>

              {/* Opciones */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  ⭐ Noticia destacada
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={e => setForm({ ...form, is_published: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  🌐 Publicar ahora
                </label>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={saveArticle}
                disabled={loading}
                style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Guardando...' : editingId ? '💾 Actualizar' : '🚀 Publicar noticia'}
              </button>
              <button
                onClick={() => { setTab('list'); setEditingId(null); setForm(emptyArticle) }}
                style={btnSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  letterSpacing: '0.3px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'sans-serif',
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 24px',
  backgroundColor: 'var(--primary)',
  color: 'black',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 700,
}

const btnSecondary: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: 'var(--bg-card-light)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
}
