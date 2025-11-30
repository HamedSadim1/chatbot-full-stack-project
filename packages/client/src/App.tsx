import ChatBot from "./components/Chat/ChatBot";

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[480px] w-[480px] rounded-full bg-cyan-400/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-violet-500/25 blur-[140px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <nav className="glass-panel flex flex-col gap-3 rounded-[28px] border border-white/10 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              WonderChat
            </p>
            <span className="text-xl font-semibold">Hamed Sadim</span>
          </div>
          <div className="hidden items-center gap-4 text-sm text-white/70 sm:flex">
            <a href="#" className="transition hover:text-white">
              Chat
            </a>
            <a href="#" className="transition hover:text-white">
              Features
            </a>
            <a href="#" className="transition hover:text-white">
              Contact
            </a>
            <a
              href="https://hamedsadim-portfolio.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-1.5 text-white transition hover:border-white/60"
            >
              Portfolio
            </a>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70 sm:hidden">
            <span>Chat &amp; AI assistent</span>
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
          <a
            className="mt-2 inline-flex items-center gap-2 text-white/80 underline-offset-4 hover:text-white hover:underline sm:mt-0"
            href="https://hamedsadim-portfolio.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            hamedsadim-portfolio.vercel.app
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
