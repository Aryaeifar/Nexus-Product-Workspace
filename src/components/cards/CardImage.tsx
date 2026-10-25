"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CounterButton } from "../buttons/CounterButton"
type CardItem = {
  id: number
  title: string
  description: string
}

type CardImageProps = {
  items: CardItem[]
}

export function CardImage({ items }: CardImageProps) {
  const [counter, setCounter] = useState(0)
  return (
    <>
      {items.map((item) => (
        <Card
          key={item.title}
          className="relative mx-auto w-full max-w-sm pt-0"
        >
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />

          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />

          <CardHeader>
            <CardAction>
              <Badge variant="secondary">Featured</Badge>
            </CardAction>

            <CardTitle>{item.title}</CardTitle>

            <CardDescription>{item.description}</CardDescription>
          </CardHeader>

          <CardFooter className="flex gap-3">
            {/* Counter: {counter} */}
            {/* <div className="flex gap-3">
              <Button onClick={() => setCounter(counter - 1)}>Decrease</Button>

              <Button onClick={() => setCounter(counter + 1)}>Increase</Button>
            </div> */}
            <div>
              <CounterButton />
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}
