import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

type ButtonProps = {
  isLoading?: Boolean
}

export function CounterButton({ isLoading = false }: ButtonProps) {
  const [counter, setCounter] = useState(0)
  const [loading, setLoading] = useState(false)

  return (
    <Button
      variant="secondary"
      disabled={loading}
      onClick={() => setCounter(counter + 1)}
      className={'bg-yellow-400'}
    >
      رنگ این دکمه: زرد
      {isLoading ? (
        <>
          <Spinner data-icon="inline-start" />
        </>
      ) : (
        <>Click Me {counter}</>
      )}
    </Button>
  )
}
