import Link from 'next/link'

export default function PrivacidadPage() {
  return (
    <div style={{ backgroundColor: '#EBEBEB', minHeight: '100vh' }}>
      {/* Header simple */}
      <header style={{
        background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '1320px', margin: '0 auto', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Cruvalo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif' }}>Cruvalo</span>
          </Link>
          <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif' }}>
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          padding: '48px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <h1 style={{
            fontSize: '32px', fontWeight: 800, color: '#111',
            fontFamily: 'Georgia, serif', marginBottom: '8px',
          }}>
            Política de Privacidad
          </h1>
          <p style={{ fontSize: '14px', color: '#888', fontFamily: 'Inter, sans-serif', marginBottom: '40px' }}>
            Última actualización: abril de 2025
          </p>

          {[
            {
              title: '1. Información que recopilamos',
              content: 'Cruvalo recopila información mínima necesaria para el funcionamiento de la aplicación. Esto incluye equipos y jugadores favoritos que el usuario selecciona voluntariamente, preferencias de la aplicación como el tema visual, y datos de uso anónimos para mejorar la experiencia.',
            },
            {
              title: '2. Cómo usamos la información',
              content: 'La información recopilada se utiliza exclusivamente para personalizar la experiencia del usuario dentro de la aplicación, mostrar noticias y resultados relevantes según los equipos favoritos seleccionados, y mejorar el rendimiento y funcionalidades de la app.',
            },
            {
              title: '3. Publicidad',
              content: 'Cruvalo utiliza Google AdMob para mostrar anuncios. AdMob puede recopilar y usar datos para mostrar anuncios personalizados. Puedes consultar la política de privacidad de Google en https://policies.google.com/privacy. Los anuncios nos ayudan a mantener la aplicación gratuita para todos los usuarios.',
            },
            {
              title: '4. Datos de terceros',
              content: 'Los datos de partidos, clasificaciones y estadísticas son proporcionados por API-Football. Los datos de noticias son gestionados por Cruvalo a través de Supabase. No vendemos ni compartimos datos personales de los usuarios con terceros.',
            },
            {
              title: '5. Almacenamiento de datos',
              content: 'Los datos de preferencias del usuario se almacenan localmente en el dispositivo y en nuestros servidores de Supabase de forma segura. No almacenamos información sensible como contraseñas en texto plano.',
            },
            {
              title: '6. Derechos del usuario',
              content: 'El usuario puede en cualquier momento eliminar sus datos desde la sección de perfil de la aplicación, desactivar los anuncios personalizados desde la configuración de su dispositivo, y contactarnos para solicitar la eliminación completa de sus datos.',
            },
            {
              title: '7. Menores de edad',
              content: 'Cruvalo no está dirigida a menores de 13 años. No recopilamos conscientemente información personal de niños menores de 13 años. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos.',
            },
            {
              title: '8. Cambios en esta política',
              content: 'Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página con una fecha de actualización.',
            },
            {
              title: '9. Contacto',
              content: 'Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en: cruvalo.app@gmail.com',
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '18px', fontWeight: 700, color: '#111',
                fontFamily: 'Georgia, serif', marginBottom: '10px',
              }}>
                {section.title}
              </h2>
              <p style={{
                fontSize: '15px', color: '#555', lineHeight: 1.75,
                fontFamily: 'Inter, sans-serif',
              }}>
                {section.content}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: '40px', padding: '20px',
            backgroundColor: '#f9f9f9', borderRadius: '10px',
            border: '1px solid #eee',
          }}>
            <p style={{ fontSize: '13px', color: '#888', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
              © 2025 Cruvalo · Todos los derechos reservados
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
