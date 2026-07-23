import { useEffect, useRef } from 'react'

const FADE_DURATION = 0.5

export default function VideoBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tick = () => {
      const { currentTime, duration } = video
      if (duration && !Number.isNaN(duration)) {
        let opacity = 1
        if (currentTime < FADE_DURATION) {
          opacity = currentTime / FADE_DURATION
        } else if (currentTime > duration - FADE_DURATION) {
          opacity = Math.max(0, (duration - currentTime) / FADE_DURATION)
        }
        video.style.opacity = String(opacity)
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    const handleEnded = () => {
      video.style.opacity = '0'
      window.setTimeout(() => {
        video.currentTime = 0
        video.play()
      }, 100)
    }
    video.addEventListener('ended', handleEnded)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      video.removeEventListener('ended', handleEnded)
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
