interface ActionRowProps {
  onDelete: () => void
  onSubmit: () => void
  canSubmit: boolean
}

export function ActionRow({ onDelete, onSubmit, canSubmit }: ActionRowProps) {
  return (
    <div className="flex justify-between gap-2 px-1">
      <button
        className="min-h-[44px] px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium cursor-pointer transition-colors select-none"
        onClick={onDelete}
        aria-label="Delete last emoji"
        type="button"
      >
        &#9003;
      </button>
      <button
        className="min-h-[44px] px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed select-none"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Submit guess"
        type="button"
      >
        Enter
      </button>
    </div>
  )
}
