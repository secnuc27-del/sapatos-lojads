'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface AnimatedTabsProps {
  tabs: { label: string; href: string }[]
}

export function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  const pathname = usePathname()
  
  // Find current active tab based on path
  const getActiveTab = () => {
    const active = tabs.find(t => 
      t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
    )
    return active ? active.label : tabs[0].label
  }

  const [activeTab, setActiveTab] = useState(getActiveTab())
  const containerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname])

  useEffect(() => {
    const container = containerRef.current

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement

        // Clip relative to the parent container
        const clipLeft = offsetLeft
        const clipRight = offsetLeft + offsetWidth

        container.style.clipPath = `inset(0px ${Number(
          100 - (clipRight / container.offsetWidth) * 100
        ).toFixed()}% 0px ${Number(
          (clipLeft / container.offsetWidth) * 100
        ).toFixed()}% round 9999px)`
      }
    }
  }, [activeTab, pathname])

  return (
    <div className="relative bg-fg/5 border border-border2/30 mx-auto flex w-fit items-center rounded-full p-1">
      {/* Active Layer (Clipped overlay) */}
      <div
        ref={containerRef}
        className="absolute inset-y-1 left-1 right-1 z-10 overflow-hidden [clip-path:inset(0px_75%_0px_0px_round_9999px)] transition-all duration-300 ease-out pointer-events-none"
      >
        <div className="flex bg-gold text-[#08070a] rounded-full py-1.5 px-3">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className="flex h-8 items-center px-4 text-xs uppercase font-bold tracking-widest whitespace-nowrap"
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Layer (Base clickable tabs) */}
      <div className="flex py-1.5 px-3">
        {tabs.map(({ label, href }, index) => {
          const isActive = activeTab === label

          return (
            <Link
              key={index}
              href={href}
              ref={isActive ? (activeTabRef as any) : null}
              className="flex h-8 items-center cursor-pointer px-4 text-xs uppercase font-bold text-fg/40 hover:text-fg/70 transition-colors tracking-widest whitespace-nowrap"
            >
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
