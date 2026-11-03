import { useState } from 'react'
import VideoBackground from './components/VideoBackground'

// No scheme on purpose: keeps the commands short (curl/wget default to http).
const UPLOAD_CMD = 'curl -T yourfile.txt dump.bihari.xyz'
const DOWNLOAD_CMD = 'wget dump.bihari.xyz/files/filename.txt'

// navigator.clipboard is undefined outside secure contexts (e.g. plain http://),
// so fall back to a hidden textarea + execCommand there.
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
}

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!(await copyText(text))) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className={`rounded-full bg-black/75 px-12 py-4 text-base text-white backdrop-blur-sm transition-transform hover:scale-[1.03] ${className}`}
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
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-black px-6 py-4 shadow-xl">
        <code className="overflow-x-auto whitespace-nowrap text-base text-white sm:text-lg">
          {cmd}
        </code>
        <button
          onClick={async () => {
            if (!(await copyText(cmd))) return
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

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <span className="font-serif text-3xl tracking-tight text-black">
          dump.bihari.xyz
        </span>
        <a
          href="https://github.com/ajtazer/Curl-Dumper"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-black/75 px-6 py-2.5 text-sm text-white backdrop-blur-sm transition-transform hover:scale-[1.03]"
        >
          GitHub
        </a>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center px-6 pb-6 pt-4 text-center">
        <h1
          className="max-w-7xl animate-fade-rise font-serif text-4xl font-normal text-black sm:text-6xl md:text-7xl"
          style={{ lineHeight: 0.95, letterSpacing: '-2.46px' }}
        >
          No signup, <span className="italic text-muted">no nonsense,</span> just curl.
        </h1>

        <p className="mt-4 max-w-2xl animate-fade-rise-delay text-sm leading-relaxed text-muted sm:text-base">
          One Worker, one bucket, zero friction. Push files with curl, pull them with
          wget — everything vanishes after 24 hours so nothing lingers you didn't
          mean to keep.
        </p>

        <div className="mt-6 animate-fade-rise-delay-2">
          <CopyButton text={UPLOAD_CMD} />
        </div>
      </section>

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 pb-8">
        <CodeRow label="Upload" cmd={UPLOAD_CMD} />
        <CodeRow label="Download" cmd={DOWNLOAD_CMD} />
      </section>
    </div>
  )
}
