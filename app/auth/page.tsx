'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
      }
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Cruvalo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>
            Cruvalo
          </span>
        </Link>

        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '36px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', backgroundColor: '#f5f5f5',
            borderRadius: '10px', padding: '4px', marginBottom: '28px',
          }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#111' : '#888',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre" required style={inputStyle} />
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required style={inputStyle} />
            </div>

            <div style={{ marginBottom: mode === 'login' ? '8px' : '24px' }}>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required style={inputStyle} />
            </div>

            {/* Olvidé contraseña — solo en login */}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <Link href="/auth/forgot" style={{
                  fontSize: '13px', color: '#00A86B',
                  fontFamily: 'Inter, sans-serif', fontWeight: 500,
                }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            {error && (
              <div style={{
                backgroundColor: '#fef2f2', color: '#b91c1c',
                padding: '10px 14px', borderRadius: '8px',
                fontSize: '13px', marginBottom: '16px',
                fontFamily: 'Inter, sans-serif',
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: '#f0fdf4', color: '#166534',
                padding: '10px 14px', borderRadius: '8px',
                fontSize: '13px', marginBottom: '16px',
                fontFamily: 'Inter, sans-serif',
              }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #00A86B 0%, #00D688 100%)',
              color: 'black', border: 'none', borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(0,168,107,0.3)',
            }}>
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e5e5' }} />
            <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'Inter, sans-serif' }}>o continúa con</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e5e5' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{
            width: '100%', padding: '12px', backgroundColor: 'white',
            border: '1px solid #e5e5e5', borderRadius: '10px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#333',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#f9f9f9'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'white'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '13px', color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Inter, sans-serif',
        }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>← Volver al inicio</Link>
        </p>
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
