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
  const context = useContext(CardContext)

  const cards = [
    {
      id: 1,
      title: "Data Structure and Algorithms",
      description: "By Ali Aryaeifar",
      buttonColor: "yellow-400",
    },
    {
      id: 2,
      title: "React",
      description: "Learning React fundamentals",
      buttonColor: "blue-400",
    },
    {
      id: 3,
      title: "Next.js",
      description: "Learning Next.js",
      buttonColor: "red-400",
    },
  ]

  const [loading, setLoading] = useState(false)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("Hellow world")
  //   }, 2000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [loading])

  const sayHello = useCallback(() => {
    console.log("hello world")
  }, [])

  return (
    <div className="p-4">
      <h1>Inbox</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Suspense fallback={<p>در حال بارگذاری...</p>}>
          <CardImage items={cards} />
        </Suspense>
      </div>
    </div>
  )
}
