import { useState } from 'react'
import VideoBackground from './components/VideoBackground'

const UPLOAD_CMD = 'curl -T yourfile.txt https://dump.bihari.xyz'
const DOWNLOAD_CMD = 'wget https://dump.bihari.xyz/files/filename.txt'

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className={`rounded-full bg-black px-14 py-5 text-base text-white transition-transform hover:scale-[1.03] ${className}`}
    >
      {copied ? 'Copied!' : 'Copy curl command'}
    </button>
  )
}

function CodeRow({ label, cmd }: { label: string; cmd: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="w-full max-w-2xl">
      <p className="mb-3 font-serif text-2xl text-black">{label}</p>
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-black px-6 py-5 shadow-xl">
        <code className="overflow-x-auto whitespace-nowrap text-base text-white sm:text-lg">
          {cmd}
        </code>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(cmd)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            copied ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <VideoBackground src="/videos/hero.mp4" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <span className="font-serif text-3xl tracking-tight text-black">
          dump.bihari.xyz
        </span>
        <a
          href="https://github.com/ajtazer/Curl-Dumper"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-black px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03]"
        >
          GitHub
        </a>
      </nav>

      <section
        className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1
          className="max-w-7xl animate-fade-rise font-serif text-5xl font-normal text-black sm:text-7xl md:text-8xl"
          style={{ lineHeight: 0.95, letterSpacing: '-2.46px' }}
        >
          No signup, <span className="italic text-muted">no nonsense,</span> just curl.
        </h1>

        <p className="mt-8 max-w-2xl animate-fade-rise-delay text-base leading-relaxed text-muted sm:text-lg">
          One Worker, one bucket, zero friction. Push files with curl, pull them with
          wget — everything vanishes after 24 hours so nothing lingers you didn't
          mean to keep.
        </p>

        <div className="mt-12 animate-fade-rise-delay-2">
          <CopyButton text={UPLOAD_CMD} />
        </div>
      </section>

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 pb-32">
        <h2 className="font-serif text-3xl text-black sm:text-4xl">How it works</h2>
        <CodeRow label="Upload" cmd={UPLOAD_CMD} />
        <CodeRow label="Download" cmd={DOWNLOAD_CMD} />
      </section>
    </div>
  )
}
