'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Procesar el token del hash de la URL
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (error) {
            setError('El enlace ha expirado. Solicita uno nuevo.')
          } else {
            setReady(true)
          }
        })
      }
    } else {
      // Comprobar si ya hay sesión activa de recovery
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true)
        else setError('Enlace inválido. Solicita uno nuevo.')
      })
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Error al actualizar. Intenta de nuevo.')
    } else {
      setSuccess('¡Contraseña actualizada correctamente!')
      setTimeout(() => router.push('/'), 2000)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Cruvalo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif' }}>Cruvalo</span>
        </Link>

        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
            Nueva contraseña
          </h2>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
            Introduce tu nueva contraseña para acceder a Cruvalo.
          </p>

          {error && !ready && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              {error}
              <div style={{ marginTop: '8px' }}>
                <Link href="/auth/forgot" style={{ color: '#b91c1c', fontWeight: 600, textDecoration: 'underline' }}>
                  Solicitar nuevo enlace →
                </Link>
              </div>
            </div>
          )}

          {ready && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Nueva contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirmar contraseña</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••" required style={inputStyle} />
              </div>

              {error && (
                <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                  {success} Redirigiendo...
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #00A86B 0%, #00D688 100%)',
                color: 'black', border: 'none', borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, sans-serif',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(0,168,107,0.3)',
              }}>
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link href="/auth" style={{ fontSize: '13px', color: '#888', fontFamily: 'Inter, sans-serif' }}>
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#555', marginBottom: '6px', fontFamily: 'Inter, sans-serif',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #e5e5e5', borderRadius: '10px',
  fontSize: '14px', color: '#111', outline: 'none',
  fontFamily: 'Inter, sans-serif', backgroundColor: 'white',
}
