export function Preloader() {
  return (
    <div aria-hidden="true" className="preloader">
      <div className="relative grid size-36 place-items-center">
        <svg viewBox="0 0 120 120" className="preloader-ring absolute inset-0">
          <circle cx="60" cy="60" r="56" />
        </svg>
        <svg viewBox="0 0 32 32" className="preloader-logo size-14">
          <path d="M4 30V15C4 8.4 9.4 3 16 3s12 5.4 12 12v15H4Z" className="fill-accent-500" />
          <path d="M11 30v-9a5 5 0 0 1 10 0v9h-10Z" className="fill-sand-100" />
        </svg>
      </div>
      <span className="preloader-count absolute bottom-10 font-display text-sm font-semibold tracking-[0.2em] text-muted" />
    </div>
  )
}
