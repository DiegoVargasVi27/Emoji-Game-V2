interface HeaderProps {
  onStatsClick: () => void
  onMenuClick: () => void
}

export function Header({ onStatsClick, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 w-full bg-gray-900 border-b border-gray-700 p-4 z-40">
      <div className="relative flex items-center justify-center max-w-lg mx-auto">
        {/* Hamburger menu button - left */}
        <button
          className="absolute left-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer transition-colors"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-xl font-bold">Emoji Wordle</h1>

        {/* Stats button - right */}
        <button
          className="absolute right-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer transition-colors"
          onClick={onStatsClick}
          aria-label="View statistics"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
