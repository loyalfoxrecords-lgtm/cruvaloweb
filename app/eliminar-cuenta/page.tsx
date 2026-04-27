export default function EliminarCuentaPage() {
  return (
    <div style={{ backgroundColor: '#EBEBEB', minHeight: '100vh' }}>
      <header style={{
        background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto', height: '64px',
          display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif' }}>Cruvalo</span>
        </div>
      </header>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '48px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Georgia, serif', marginBottom: '24px' }}>
            Eliminar cuenta
          </h1>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.7, marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
            Para solicitar la eliminación de tu cuenta y todos los datos asociados en Cruvalo, envía un correo a:
          </p>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#00A86B', marginBottom: '24px' }}>
            cruvalo.app@gmail.com
          </p>
          <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
            Indica en el correo tu dirección de email registrada. Procesaremos tu solicitud en un plazo máximo de 30 días. Se eliminarán todos tus datos incluyendo cuenta, equipos favoritos y preferencias.
          </p>
        </div>
      </main>
    </div>
  )
}