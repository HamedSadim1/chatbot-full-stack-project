import { ChatBot } from "./components/chat";
import { BotAvatar, ExternalLink } from "./components/ui";
import { ExternalLink as ExternalLinkIcon, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE } from "./lib/constants";
import { NL } from "./lib/locales/nl";

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden px-4 py-6 sm:py-12">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vw] rounded-full bg-brand-primary/8 blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[60vh] w-[60vw] rounded-full bg-brand-primary/5 blur-[100px]" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6">
        <nav className="glass-panel glass-blur flex flex-col gap-3 rounded-28 border border-glass-border px-5 py-4 text-text-primary sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="flex items-center gap-3">
            <BotAvatar size="sm" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-muted">
                {SITE.name}
              </p>
              <span className="text-lg font-semibold">{SITE.author}</span>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-sm text-text-secondary sm:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 transition hover:bg-glass-bg-active hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
            <ExternalLink
              href={SITE.portfolioUrl}
              className="rounded-full border border-glass-border px-4 py-1.5 text-text-primary transition hover:border-brand-primary/50 hover:bg-glass-bg-active"
            >
              {NL.app.portfolioLabel}
            </ExternalLink>
          </div>
          <div className="flex items-center justify-between text-sm text-text-secondary sm:hidden">
            <span className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              {NL.app.tagline}
            </span>
            <ExternalLink
              href={SITE.portfolioUrl}
              className="rounded-full border border-glass-border px-3 py-1 text-text-primary transition hover:border-brand-primary/50"
            >
              {NL.app.portfolioLabel}
            </ExternalLink>
          </div>
        </nav>

        <ChatBot />

        <footer className="glass-panel glass-blur mt-auto rounded-3xl border border-glass-border px-4 py-4 text-sm text-text-secondary sm:flex sm:items-center sm:justify-between">
          <p>
            {NL.app.madeBy}{" "}
            <span className="font-semibold text-text-primary">
              {SITE.author}
            </span>
          </p>
          <div className="mt-2 flex items-center gap-4 sm:mt-0">
            <ExternalLink
              className="inline-flex items-center gap-2 text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
              href={SITE.portfolioUrl}
            >
              {SITE.portfolioUrl.replace("https://", "")}
            </ExternalLink>
            <ExternalLink
              href={SITE.githubUrl}
              className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-glass-bg px-3 py-1.5 text-xs text-text-secondary transition hover:border-brand-primary/50 hover:bg-glass-bg-active hover:text-text-primary"
              aria-label={NL.app.githubLabel}
            >
              <ExternalLinkIcon className="size-3.5" />
              {NL.app.githubLabel}
            </ExternalLink>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
