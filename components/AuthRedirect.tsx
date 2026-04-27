'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery') && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type = params.get('type')
      
      if (type === 'recovery' && accessToken) {
        router.replace(`/auth/reset?access_token=${accessToken}&refresh_token=${refreshToken || ''}`)
      }
    }
  }, [])

  return null
}