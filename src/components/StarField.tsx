'use client'

import { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'
import { type TimelineSegment, animate, timeline } from 'motion'

type Star = [x: number, y: number, dim?: boolean, blur?: boolean]

function createRandom(seed: number) {
  return function random() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0

    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function generateStars(seed: number, count: number) {
  let random = createRandom(seed)

  return Array.from({ length: count }, () => {
    let x = Math.round(random() * 881)
    let y = Math.round(random() * 211)
    let dim = random() > 0.28
    let blur = random() > 0.62

    return [x, y, dim, blur] satisfies Star
  })
}

function generateConstellations(seed: number, count: number) {
  let random = createRandom(seed + 173)

  return Array.from({ length: count }, () => {
    let pointCount = Math.floor(random() * 3) + 4
    let originX = 80 + random() * 720
    let originY = 34 + random() * 138
    let points = Array.from({ length: pointCount }, (_, pointIndex) => {
      let angle = random() * Math.PI * 2 + pointIndex * 0.5
      let distance = 24 + random() * 56
      let x = Math.round(Math.min(Math.max(originX + Math.cos(angle) * distance, 8), 873))
      let y = Math.round(Math.min(Math.max(originY + Math.sin(angle) * distance, 8), 203))

      return [x, y] satisfies Star
    })

    if (random() > 0.55) {
      points.push(points[1])
    }

    return points
  })
}

function generateAriesConstellations(seed: number, count: number) {
  let random = createRandom(seed + 401)

  return Array.from({ length: count }, () => {
    let originX = 110 + random() * 640
    let originY = 34 + random() * 142
    let scale = 0.65 + random() * 0.55
    let direction = random() > 0.5 ? 1 : -1
    let tilt = (random() - 0.5) * 20
    let ariesShape = [
      [0, 0],
      [34, -24],
      [73, -16],
      [112, 10],
      [148, 4],
    ]

    return ariesShape.map(([x, y]) => {
      let tiltedX = x * direction - y * Math.sin((tilt * Math.PI) / 180)
      let tiltedY = y + x * Math.sin((tilt * Math.PI) / 180) * 0.35

      return [
        Math.round(Math.min(Math.max(originX + tiltedX * scale, 8), 873)),
        Math.round(Math.min(Math.max(originY + tiltedY * scale, 8), 203)),
      ] satisfies Star
    })
  })
}

function Star({
  blurId,
  point: [cx, cy, dim, blur],
}: {
  blurId: string
  point: Star
}) {
  let groupRef = useRef<React.ElementRef<'g'>>(null)
  let ref = useRef<React.ElementRef<'circle'>>(null)

  useEffect(() => {
    if (!groupRef.current || !ref.current) {
      return
    }

    let delay = Math.random() * 2

    let animations = [
      animate(groupRef.current, { opacity: 1 }, { duration: 4, delay }),
      animate(
        ref.current,
        {
          opacity: dim ? [0.2, 0.5] : [1, 0.6],
          scale: dim ? [1, 1.2] : [1.2, 1],
        },
        {
          delay,
          duration: Math.random() * 2 + 2,
          direction: 'alternate',
          repeat: Infinity,
        },
      ),
    ]

    return () => {
      for (let animation of animations) {
        animation.cancel()
      }
    }
  }, [dim])

  return (
    <g ref={groupRef} className="opacity-0">
      <circle
        ref={ref}
        cx={cx}
        cy={cy}
        r={1}
        style={{
          transformOrigin: `${cx / 16}rem ${cy / 16}rem`,
          opacity: dim ? 0.2 : 1,
          transform: `scale(${dim ? 1 : 1.2})`,
        }}
        filter={blur ? `url(#${blurId})` : undefined}
      />
    </g>
  )
}

function Constellation({
  points,
  blurId,
}: {
  points: Array<Star>
  blurId: string
}) {
  let ref = useRef<React.ElementRef<'path'>>(null)
  let uniquePoints = points.filter(
    (point, pointIndex) =>
      points.findIndex((p) => String(p) === String(point)) === pointIndex,
  )
  let isFilled = uniquePoints.length !== points.length

  useEffect(() => {
    if (!ref.current) {
      return
    }

    let sequence: Array<TimelineSegment> = [
      [
        ref.current,
        { strokeDashoffset: 0, visibility: 'visible' },
        { duration: 5, delay: Math.random() * 3 + 2 },
      ],
    ]

    if (isFilled) {
      sequence.push([
        ref.current,
        { fill: 'rgb(255 255 255 / 0.02)' },
        { duration: 1 },
      ])
    }

    let animation = timeline(sequence)

    return () => {
      animation.cancel()
    }
  }, [isFilled])

  return (
    <>
      <path
        ref={ref}
        stroke="white"
        strokeOpacity="0.2"
        strokeDasharray={1}
        strokeDashoffset={1}
        pathLength={1}
        fill="transparent"
        d={`M ${points.join('L')}`}
        className="invisible"
      />
      {uniquePoints.map((point, pointIndex) => (
        <Star key={pointIndex} point={point} blurId={blurId} />
      ))}
    </>
  )
}

export function StarField({
  className,
  seed = 1,
  starCount = 96,
  constellationCount = 3,
  ariesCount = 0,
  tiny = false,
  animated = true,
}: {
  className?: string
  seed?: number
  starCount?: number
  constellationCount?: number
  ariesCount?: number
  tiny?: boolean
  animated?: boolean
}) {
  let blurId = useId()
  let stars = generateStars(seed, starCount)
  let constellations = [
    ...generateConstellations(seed, constellationCount),
    ...generateAriesConstellations(seed, ariesCount),
  ]

  return (
    <svg
      viewBox="0 0 881 211"
      fill="white"
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute w-220.25 origin-top-right rotate-30 overflow-visible opacity-70',
        className,
      )}
    >
      <defs>
        <filter id={blurId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation=".5" />
        </filter>
      </defs>
      {constellations.map((points, constellationIndex) => (
        <Constellation
          key={constellationIndex}
          points={points}
          blurId={blurId}
        />
      ))}
      {stars.map((point, pointIndex) => (
        <g
          key={pointIndex}
          style={{
            transform: tiny ? 'scale(0.7)' : undefined,
            transformOrigin: `${point[0] / 16}rem ${point[1] / 16}rem`,
          }}
        >
          {animated ? (
            <Star point={point} blurId={blurId} />
          ) : (
            <circle
              cx={point[0]}
              cy={point[1]}
              r={1}
              opacity={point[2] ? 0.28 : 0.75}
              filter={point[3] ? `url(#${blurId})` : undefined}
            />
          )}
        </g>
      ))}
    </svg>
  )
}
