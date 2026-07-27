import { useEffect, useRef } from 'react'

const FADE_DURATION = 0.5

function reverseSrc(src: string) {
  return src.replace(/(\.[^./]+)$/, '-reverse$1')
}

export default function VideoBackground({ src }: { src: string }) {
  const forwardRef = useRef<HTMLVideoElement>(null)
  const reverseRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<number>()
  const activeRef = useRef<'forward' | 'reverse'>('forward')

  useEffect(() => {
    const forward = forwardRef.current
    const reverse = reverseRef.current
    if (!forward || !reverse) return

    const swap = () => {
      const from = activeRef.current === 'forward' ? forward : reverse
      const to = activeRef.current === 'forward' ? reverse : forward
      activeRef.current = activeRef.current === 'forward' ? 'reverse' : 'forward'
      from.pause()
      to.currentTime = 0
      to.style.opacity = '1'
      from.style.opacity = '0'
      to.play()
    }
    forward.addEventListener('ended', swap)
    reverse.addEventListener('ended', swap)

    const tick = () => {
      const video = activeRef.current === 'forward' ? forward : reverse
      if (video.currentTime < FADE_DURATION && video === forward && activeRef.current === 'forward') {
        video.style.opacity = String(video.currentTime / FADE_DURATION)
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      forward.removeEventListener('ended', swap)
      reverse.removeEventListener('ended', swap)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0" style={{ top: '300px' }}>
      <video
        ref={forwardRef}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0, objectPosition: 'center 80%', transition: 'opacity 0.05s linear' }}
      />
      <video
        ref={reverseRef}
        src={reverseSrc(src)}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0, objectPosition: 'center 80%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  )
}
