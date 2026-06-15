'use client'

import React from 'react'

interface LoaderProps {
  fullScreen?: boolean
}

export default function Loader({ fullScreen = true }: LoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#08070a] text-fg'
          : 'flex flex-col items-center justify-center p-8 w-full min-h-[200px]'
      }
    >
      <div className="relative flex items-center justify-center w-[200px] h-[200px]">
        {/* SVG Gegga filter */}
        <svg className="gegga-svg absolute w-0 h-0">
          <defs>
            <filter id="gegga">
              <feGaussianBlur in="SourceGraphic" stdDeviation={7} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                result="inreGegga"
              />
              <feComposite in="SourceGraphic" in2="inreGegga" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* Shadow/Skugga SVG */}
        <svg className="skugga-svg absolute top-[3px] left-[3px] opacity-30 blur-[5px]" width={200} height={200} viewBox="0 0 200 200">
          <path
            className="halvan-anim"
            d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64"
          />
          <circle className="strecken-anim" cx={100} cy={100} r={64} />
        </svg>

        {/* Main Snurra SVG */}
        <svg className="snurra-svg relative z-10" width={200} height={200} viewBox="0 0 200 200">
          <defs>
            <linearGradient id="linjärGradient">
              <stop className="stopp1" offset={0} />
              <stop className="stopp2" offset={1} />
            </linearGradient>
            <linearGradient
              y2={160}
              x2={160}
              y1={40}
              x1={40}
              gradientUnits="userSpaceOnUse"
              id="gradient"
              href="#linjärGradient"
            />
          </defs>
          <path
            className="halvan-anim"
            d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64"
          />
          <circle className="strecken-anim" cx={100} cy={100} r={64} />
        </svg>
      </div>

    </div>
  )
}
