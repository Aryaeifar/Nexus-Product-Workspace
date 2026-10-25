"use client"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  Suspense
} from "react"
import { CardImage } from "@/components/cards/CardImage"
import { Card } from "@/components/ui/card"
import { CounterButton } from "@/components/buttons/CounterButton"
import { Button } from "@/components/ui/button"
type CardContextType = {
  buttonColor: string
}

export const CardContext = createContext<CardContextType | null>(null)

export default function Page() {
 

  

  return (
    <div className="p-4">
      <h1>Inbox</h1>

      
    </div>
  )
}
