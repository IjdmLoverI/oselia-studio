'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#faf7f2',
          color: '#1d1d1b',
        }}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>
            Щось пішло не так · Something went wrong
          </h1>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 24px',
              borderRadius: 999,
              border: 0,
              background: '#b4531f',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Спробувати ще раз · Try again
          </button>
        </div>
      </body>
    </html>
  )
}
