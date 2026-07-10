import ChatBot from "./components/Chat/ChatBot";
import { Bot, ExternalLink, MessageCircle } from "lucide-react";

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden px-4 py-6 sm:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-120 w-120 rounded-full bg-cyan-400/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-105 w-105 rounded-full bg-violet-500/25 blur-[140px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6">
        <nav className="glass-panel flex flex-col gap-3 rounded-[28px] border border-white/10 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/20 to-violet-500/20">
              <Bot className="size-5 text-cyan-200" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                WonderChat
              </p>
              <span className="text-lg font-semibold">Hamed Sadim</span>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-sm text-white/70 sm:flex">
            <a
              href="#"
              className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
            >
              Chat
            </a>
            <a
              href="#"
              className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
            >
              Features
            </a>
            <a
              href="#"
              className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
            >
              Contact
            </a>
            <a
              href="https://hamedsadim-portfolio.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-1.5 text-white transition hover:border-white/60 hover:bg-white/5"
            >
              Portfolio
            </a>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70 sm:hidden">
            <span className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              Chat &amp; AI assistent
            </span>
            <a
              href="https://hamedsadim-portfolio.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-3 py-1 text-white transition hover:border-white/60"
            >
              Portfolio
            </a>
          </div>
        </nav>

        <ChatBot />

        <footer className="glass-panel mt-auto rounded-[24px] border border-white/10 px-4 py-4 text-sm text-white/70 sm:flex sm:items-center sm:justify-between">
          <p>
            Gemaakt door{" "}
            <span className="font-semibold text-white">Hamed Sadim</span>
          </p>
          <div className="mt-2 flex items-center gap-4 sm:mt-0">
            <a
              className="inline-flex items-center gap-2 text-white/80 underline-offset-4 hover:text-white hover:underline"
              href="https://hamedsadim-portfolio.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              hamedsadim-portfolio.vercel.app
            </a>
            <a
              href="https://github.com/HamedSadim1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              aria-label="GitHub"
            >
              <ExternalLink className="size-3.5" />
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
