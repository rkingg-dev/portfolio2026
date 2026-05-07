import clsx from 'clsx'

export function GhostMark({
  className,
}: {
  className?: string
}) {
  return (
    <span
      className={clsx(
        'relative grid h-10 w-10 rotate-[-8deg] place-items-center',
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-full w-full rotate-[8deg] drop-shadow-[0_0_20px_rgba(255,255,255,0.16)]"
      >
        <path
          d="M16 54V25.5C16 14.6 22.7 7 32 7s16 7.6 16 18.5V54l-4.6-3.4L38.8 54l-4.6-3.4L29.6 54 25 50.6 20.4 54 16 50.6Z"
          fill="#d8cec8"
        />
        <path
          d="M21.5 29.2c3.1-2.5 7.4-2.9 11-.9l-1.2 5.2c-3.4-1-6.8-.7-10.1.9l.3-5.2Zm15.9-.9c3.7-2 8-1.6 11.1.9l.3 5.2c-3.3-1.6-6.7-1.9-10.1-.9l-1.3-5.2Z"
          fill="#050505"
        />
        <path
          d="M34 30.6c1.5-.5 3.1-.5 4.6 0"
          stroke="#050505"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M31 41.5c2.2 1.1 4.6 1.1 6.8 0"
          stroke="#7d716c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props}>
      <GhostMark />
      <span className="font-display text-xl/8 font-light tracking-[0.08em] text-white [font-variant-caps:all-small-caps]">
        rkingg//
      </span>
    </div>
  )
}
