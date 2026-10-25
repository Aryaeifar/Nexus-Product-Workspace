"use client"

import { createContext, useContext } from "react"

type CardContextType = {
  buttonColor: string
}

export const CardContext = createContext<CardContextType | null>(null)

export function useCardContext() {
  const context = useContext(CardContext)

  if (!context) {
    throw new Error("useCardContext must be used inside CardContext.Provider")
  }

  return context
}