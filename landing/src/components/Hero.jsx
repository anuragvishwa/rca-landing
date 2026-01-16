import { Link } from "react-router-dom";
import { Terminal } from "./Terminal";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-canvas mb-8">
          <span className="w-2 h-4 bg-secondary animate-blink rounded-sm" />
          <span className="font-mono text-xs text-muted">AI Agent Live</span>
        </div>

        {/* Headline - Serif */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-6 leading-[1.1]">
          AI for Production Infrastructure
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Analyze and fix root causes in minutes, not hours.
          <br className="hidden sm:block" />
          Intelligent incident response for modern engineering teams.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="https://cal.com/anuragvishwa/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-background px-8 py-3 rounded-md font-mono text-sm font-medium hover:bg-secondary/90 transition-colors"
          >
            Book Demo
          </a>
          <Link
            to="/video"
            className="border border-border px-8 py-3 rounded-md font-mono text-sm text-foreground hover:bg-canvas transition-colors"
          >
            Watch Video
          </Link>
        </div>

        {/* Integration Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["Kubernetes", "Prometheus", "Grafana", "GitHub", "Slack"].map(
            (item) => (
              <span
                key={item}
                className="px-3 py-1 rounded-full border border-border bg-canvas font-mono text-xs text-muted"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* Terminal Demo */}
      <div className="relative max-w-6xl mx-auto mt-16 flex justify-center px-4">
        <Terminal />
      </div>
    </section>
  );
}
