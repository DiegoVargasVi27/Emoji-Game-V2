import { useState } from 'react'

const STORAGE_KEY = 'emoji-wordle-player-name'

function readFromStorage(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function writeToStorage(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, name)
  } catch {
    // Silently ignore — Safari private mode blocks localStorage
  }
}

export function usePlayerName(): [string, (name: string) => void] {
  const [name, setNameState] = useState<string>(() => readFromStorage())

  function setName(newName: string): void {
    writeToStorage(newName)
    setNameState(newName)
  }

  return [name, setName]
}
