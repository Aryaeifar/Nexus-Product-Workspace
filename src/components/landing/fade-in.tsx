"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

import { appleDuration, appleEase } from "@/lib/motion"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  inView?: boolean
}

export function FadeIn({
  children,
  className,
  delay = 0,
  inView = false,
}: RevealProps) {
  const reduced = useReducedMotion()
  const hidden = reduced ? undefined : { opacity: 0, y: 18 }
  const shown = { opacity: 1, y: 0 }
  const transition = {
    duration: appleDuration.tile,
    delay,
    ease: appleEase,
  }

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={shown}
        viewport={{ once: true, amount: 0.32, margin: "0px 0px -10% 0px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={shown}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

export function ProductReveal({
  children,
  className,
  delay = 0.12,
}: Omit<RevealProps, "inView">) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay, ease: appleEase }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.24, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        shown: {
          transition: {
            staggerChildren: reduced ? 0 : 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: appleDuration.tile, ease: appleEase },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
