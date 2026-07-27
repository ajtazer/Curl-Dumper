import { useEffect, useRef } from 'react'

const FADE_DURATION = 0.5

export default function VideoBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<number>()
  const directionRef = useRef<'forward' | 'reverse'>('forward')
  const lastTimestampRef = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tick = (timestamp: number) => {
      const { currentTime, duration } = video

      if (duration && !Number.isNaN(duration)) {
        if (currentTime < FADE_DURATION) {
          video.style.opacity = String(currentTime / FADE_DURATION)
        } else {
          video.style.opacity = '1'
        }

        if (directionRef.current === 'forward') {
          if (currentTime >= duration - 0.05) {
            directionRef.current = 'reverse'
            lastTimestampRef.current = timestamp
            video.pause()
          }
        } else {
          if (lastTimestampRef.current !== null) {
            const dt = (timestamp - lastTimestampRef.current) / 1000
            video.currentTime = Math.max(0, currentTime - dt)
          }
          lastTimestampRef.current = timestamp

          if (video.currentTime <= 0) {
            directionRef.current = 'forward'
            lastTimestampRef.current = null
            video.play()
          }
        }
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div className="absolute" style={{ top: '300px', inset: 'auto 0 0 0' }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
        style={{ opacity: 0, transition: 'opacity 0.05s linear' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  )
}
