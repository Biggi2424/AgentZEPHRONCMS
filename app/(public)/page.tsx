"use client";

import { useEffect, useRef } from "react";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-landing-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-landing-playfair",
});

export default function LandingPage() {
  const bootloaderRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("Neyraq-landing-body");
    return () => {
      document.body.classList.remove("Neyraq-landing-body");
      document.body.classList.remove("hero-text-visible");
    };
  }, []);

  useEffect(() => {
    const bootloader = bootloaderRef.current;
    const logEl = logRef.current;
    const bar = barRef.current;
    const video = videoRef.current;
    const container = pageRef.current;

    if (!bootloader || !logEl || !bar || !container) {
      return;
    }

    logEl.innerHTML = "";
    const lines = [
      "[BOOT] Starting Neyraq...",
      "[BOOT] Preparing components...",
      "[BOOT] Checking settings...",
      "[BOOT] Loading interface...",
      "[OK] Neyraq is ready.",
    ];

    let index = 0;
    const timers: number[] = [];

    const appendLine = (text: string) => {
      const line = document.createElement("div");
      line.className = "bootloader-log-line";
      line.textContent = text;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    };

    const finishBoot = () => {
      bootloader.classList.add("bootloader-hidden");
      if (video && typeof video.play === "function") {
        video.play().catch(() => {
          // Autoplay may be blocked; fallback to the current frame.
        });
      }
      window.setTimeout(() => {
        document.body.classList.add("hero-text-visible");
      }, 700);
    };

    const nextStep = () => {
      if (index < lines.length) {
        appendLine(lines[index]);
        bar.style.width = `${((index + 1) / lines.length) * 100}%`;
        index += 1;
        timers.push(window.setTimeout(nextStep, 850));
      } else {
        timers.push(window.setTimeout(finishBoot, 600));
      }
    };

    nextStep();

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(".hero, .section, .section-alt"),
    );
    let isScrolling = false;

    const scrollToSection = (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= sections.length) return;
      isScrolling = true;
      window.scrollTo({
        top: targetIndex * window.innerHeight,
        behavior: "smooth",
      });
      window.setTimeout(() => {
        isScrolling = false;
      }, 900);
    };

    const onWheel = (event: WheelEvent) => {
      if (isScrolling || sections.length === 0) return;
      const legacyDelta = (event as unknown as { wheelDelta?: number }).wheelDelta;
      const delta = typeof event.deltaY === "number" ? event.deltaY : legacyDelta ? -legacyDelta : 0;
      if (!delta) return;

      const direction = delta > 0 ? 1 : -1;
      const currentIndex = Math.round(window.scrollY / window.innerHeight);
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      if (targetIndex === currentIndex) return;

      event.preventDefault();
      scrollToSection(targetIndex);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isScrolling || sections.length === 0) return;
      const currentIndex = Math.round(window.scrollY / window.innerHeight);

      if (event.key === "PageDown" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        scrollToSection(Math.min(sections.length - 1, currentIndex + 1));
      } else if (event.key === "PageUp" || event.key === "ArrowUp") {
        event.preventDefault();
        scrollToSection(Math.max(0, currentIndex - 1));
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("hero-text-visible");
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className={`Neyraq-landing ${inter.variable} ${playfair.variable}`}
    >
      <div ref={bootloaderRef} className="bootloader">
        <div className="bootloader-logo">
          <div className="bootloader-logo-mark">
            <div className="bootloader-logo-dot" />
          </div>
          <span>STARTING Neyraq</span>
        </div>
        <div ref={logRef} className="bootloader-log" />
        <div className="bootloader-progress">
          <div ref={barRef} className="bootloader-progress-bar" />
        </div>
        <div className="bootloader-hint">Please wait - starting Neyraq...</div>
      </div>

      <div className="page">
        <section className="hero" id="top">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://videos.pexels.com/video-files/3130284/3130284-uhd_3840_2160_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-bg" />
          <div className="hero-grain" />
          <div className="hero-inner">
            <nav className="top-nav">
              <a className="nav-brand" href="#top">
                <span className="nav-brand-mark">
                  <span className="nav-brand-dot" />
                </span>
                <span className="nav-brand-text">
                  <span className="nav-brand-title">Neyraq</span>
                  <span className="nav-brand-sub">Control Room</span>
                </span>
              </a>
              <div className="nav-menu">
                <a className="nav-link" href="#watch">
                  <svg
                    aria-hidden="true"
                    className="nav-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3.2" />
                  </svg>
                  <span>Watch</span>
                </a>
                <a className="nav-link" href="#analyze">
                  <svg
                    aria-hidden="true"
                    className="nav-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 9.5A6 6 0 0 1 12 4a6 6 0 0 1 8 5.5c0 5.5-8 12-8 12s-8-6.5-8-12Z" />
                    <path d="M9.5 11a2.5 2.5 0 0 1 5 0" />
                  </svg>
                  <span>Analyze</span>
                </a>
                <a className="nav-link" href="#control">
                  <svg
                    aria-hidden="true"
                    className="nav-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 17.5 9 13l4 4 6.5-6.5" />
                    <path d="M3 6h18" />
                  </svg>
                  <span>Control</span>
                </a>
                <a className="nav-link" href="#contact">
                  <svg
                    aria-hidden="true"
                    className="nav-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <span>Contact</span>
                </a>
              </div>
            </nav>
            <div className="hero-center">
              <div className="hero-center-inner">
                <div className="hero-center-kicker">WATCH ANALYZE CONTROL</div>
                <div className="hero-center-title">Neyraq</div>
                <p className="hero-center-subtitle">Your powerful agent</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="watch">
          <div className="section-inner">
            <div className="section-center-block">
              <div className="section-kicker">WATCH</div>
              <div className="section-ornament" />
              <h2 className="section-title section-title-large">
                Always watching your Windows fleet.
              </h2>
              <p className="section-text section-lead">
                Neyraq never sleeps. It watches everything you allow - from a single laptop to the entire enterprise:
                CPU, RAM, disks, processes, services, network, logs, events. End-to-end instead of 20 tools:
                clients, servers, firewalls, printers, switches, cloud services in one view.
              </p>
              <div className="section-pills-row">
                <div className="section-pill">
                  <span className="section-pill-dot" />
                  Live device models
                </div>
                <div className="section-pill">
                  <span className="section-pill-dot" />
                  Anomaly-aware alerts
                </div>
                <div className="section-pill">
                  <span className="section-pill-dot" />
                  Context for every signal
                </div>
              </div>
              <div className="section-stack">
                <div className="section-card">
                  <div className="section-card-title">System awareness</div>
                  <p className="section-card-text">
                    CPU, RAM, disks, processes, services, network, logs, events — always as a live model per device.
                  </p>
                  <div className="section-card-meta">
                    <span className="badge-dot" /> 143 devices observed
                  </div>
                </div>
                <div className="section-card">
                  <div className="section-card-title">Signal clarity</div>
                  <p className="section-card-text">
                    Sees anomalies instead of spam: baseline-aware, learns your normal and surfaces only what matters.
                  </p>
                  <div className="section-card-meta">
                    <span className="badge-dot" /> 9 silent issues found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-alt" id="analyze">
          <div className="section-alt-inner">
            <div className="section-center-block">
              <div className="section-kicker">ANALYZE</div>
              <div className="section-ornament" />
              <h2 className="section-title section-title-large">
                Seeing is nothing without understanding.
              </h2>
              <p className="section-text section-lead">
                Neyraq turns raw signals into decisions: plain-English questions, deep diagnostics,
                recommendations with reasoning.
              </p>
              <div className="section-alt-cards">
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Natural language</div>
                  <p>
                    Just ask: Why is this server slow? Where are we vulnerable? What is wrong with this VPN user?
                  </p>
                  <ul className="nl-list">
                    <li>„Give me the root cause timeline.“</li>
                    <li>„Show anomalies per site.“</li>
                  </ul>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Root causes</div>
                  <p>
                    Correlates metrics, logs, topology, and history instead of guessing; from one PC to the whole network.
                  </p>
                  <div className="micro-bar">
                    <span style={{ width: "62%" }} />
                    <span style={{ width: "34%" }} />
                    <span style={{ width: "78%" }} />
                  </div>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Explainable</div>
                  <p>
                    Every recommendation comes with a why: observed pattern, context, trade-offs, and alternatives.
                  </p>
                  <div className="badge-line">
                    <span className="badge-dot" /> Impact, Risk, Confidence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="control">
          <div className="section-inner">
            <div className="section-center-block">
              <div className="section-kicker">CONTROL</div>
              <div className="section-ornament" />
              <h2 className="section-title section-title-large">
                From insights to action, with guardrails.
              </h2>
              <p className="section-text section-lead">
                Neyraq acts: open apps, set policies, roll out software, run scripts, fix configs - triggered by voice or text, always with feedback.
              </p>
              <div className="section-alt-cards">
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Execution</div>
                  <p>
                    From opening a browser to buy parts to patch waves across all laptops with auto-rollback.
                  </p>
                  <div className="badge-line">
                    <span className="badge-dot" /> Voice / Text / API
                  </div>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Guardrails</div>
                  <p>
                    No critical action without checks, nothing hidden, everything logged and explained; you approve or delegate.
                  </p>
                  <ul className="nl-list">
                    <li>Safeties on by default</li>
                    <li>Approval or delegate</li>
                  </ul>
                </div>
                <div className="section-alt-card">
                  <div className="section-alt-card-label">Feedback</div>
                  <p>
                    After every step: what happened, what changed, what is planned next.
                  </p>
                  <div className="micro-bar">
                    <span style={{ width: "48%" }} />
                    <span style={{ width: "86%" }} />
                    <span style={{ width: "34%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer" id="contact">
          <div className="footer-inner">
            <div>&copy; 2025 Agent Neyraq - Autonomous Windows Support Platform</div>
            <div style={{ display: "flex", gap: "12px" }}>
              <a href="#" className="link">
                Imprint
              </a>
              <a href="#" className="link">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        /* Neyraq palette locked for calm-control mood:
           Deep blacks (#000/#080/#050) for focus, soft green accent #22c55e + mint #bbf7d0 for "online/trust",
           grain + low-sat neutrals to avoid sterility and keep a quiet control-room feeling. */
        :global(.Neyraq-landing) {
          --bg: #050505;
          --bg-soft: #101010;
          --accent: #22c55e;
          --accent-soft: #bbf7d0;
          --text: #f5f5f5;
          --muted: #9ca3af;
          --max-width: 1080px;
          font-family: var(--font-landing-inter), system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        :global(body.Neyraq-landing-body) {
          background: linear-gradient(180deg, #000000 0%, #080808 40%, #050505 100%);
          color: var(--text);
          min-height: 100vh;
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }

        :global(.Neyraq-landing *) {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :global(.Neyraq-landing .page) {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        :global(.Neyraq-landing .hero) {
          position: relative;
          min-height: 100vh;
          height: 100vh;
          overflow: hidden;
          isolation: isolate;
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        :global(.Neyraq-landing .hero-bg) {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.96)
          );
          transform: scale(1.02);
          z-index: -2;
        }

        :global(.Neyraq-landing .hero-grain) {
          position: absolute;
          inset: -50px;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.22;
          mix-blend-mode: soft-light;
          z-index: -1;
          pointer-events: none;
        }

        :global(.Neyraq-landing .hero-inner) {
          position: relative;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 20px 20px 40px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-height: 100vh;
        }

        :global(.Neyraq-landing .top-nav) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid rgba(34, 197, 94, 0.26);
          background: linear-gradient(120deg, rgba(5, 12, 7, 0.78), rgba(5, 5, 5, 0.7));
          box-shadow:
            0 12px 38px rgba(0, 0, 0, 0.6),
            0 10px 30px rgba(34, 197, 94, 0.18);
          backdrop-filter: blur(10px);
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          width: min(1080px, calc(100% - 24px));
        }

        :global(.Neyraq-landing .nav-brand) {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text);
          letter-spacing: 0.08em;
        }

        :global(.Neyraq-landing .nav-brand-mark) {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 10%, rgba(34, 197, 94, 0.4), rgba(2, 6, 23, 0.9));
          box-shadow: inset 0 0 18px rgba(34, 197, 94, 0.18);
        }

        :global(.Neyraq-landing .nav-brand-dot) {
          width: 16px;
          height: 16px;
          border-radius: 8px;
          background: conic-gradient(from 220deg, #22c55e, #16a34a, #22c55e);
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.75);
        }

        :global(.Neyraq-landing .nav-brand-text) {
          display: flex;
          flex-direction: column;
          gap: 2px;
          line-height: 1.1;
        }

        :global(.Neyraq-landing .nav-brand-title) {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        :global(.Neyraq-landing .nav-brand-sub) {
          font-size: 11px;
          color: var(--muted);
        }

        :global(.Neyraq-landing .nav-menu) {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
          min-width: 0;
        }

        :global(.Neyraq-landing .nav-link) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.28);
          background: rgba(0, 0, 0, 0.7);
          color: #e5e7eb;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 10px 28px rgba(34, 197, 94, 0.14);
        }

        :global(.Neyraq-landing .nav-link:hover) {
          border-color: rgba(34, 197, 94, 0.5);
          color: var(--accent-soft);
          transform: translateY(-1px);
          box-shadow: 0 14px 36px rgba(34, 197, 94, 0.2);
        }

        :global(.Neyraq-landing .nav-icon) {
          width: 16px;
          height: 16px;
          color: var(--accent);
        }

        :global(.Neyraq-landing .nav-menu a[href="#watch"] .nav-icon) {
          color: #22c55e;
        }

        :global(.Neyraq-landing .nav-menu a[href="#analyze"] .nav-icon) {
          color: #38bdf8;
        }

        :global(.Neyraq-landing .nav-menu a[href="#control"] .nav-icon) {
          color: #f59e0b;
        }

        :global(.Neyraq-landing .nav-menu a[href="#contact"] .nav-icon) {
          color: #c084fc;
        }

        @media (max-width: 720px) {
          :global(.Neyraq-landing .top-nav) {
            flex-direction: column;
            align-items: flex-start;
          }

          :global(.Neyraq-landing .nav-menu) {
            width: 100%;
            justify-content: flex-start;
          }
        }

        :global(.Neyraq-landing .hero-video) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -3;
          filter: saturate(1.1) contrast(1.05);
        }

        :global(.Neyraq-landing .hero-center) {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 16px 60px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 1s ease, transform 1s ease;
        }

        :global(body.hero-text-visible .hero-center) {
          opacity: 1;
          transform: translateY(0);
        }

        :global(.Neyraq-landing .hero-center-inner) {
          max-width: 640px;
          margin: 0 auto;
        }

        :global(.Neyraq-landing .hero-center-kicker) {
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }

        :global(.Neyraq-landing .hero-center-title) {
          font-family: var(--font-landing-playfair), "Times New Roman", serif;
          font-size: clamp(34px, 6vw, 52px);
          letter-spacing: 0.38em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        :global(.Neyraq-landing .hero-center-subtitle) {
          font-size: 14px;
          color: var(--muted);
        }

        :global(.Neyraq-landing .section) {
          position: relative;
          background: radial-gradient(circle at center, #020b06 0, #020202 55%);
          padding: 60px 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
        }

        :global(.Neyraq-landing .section-alt) {
          position: relative;
          background: radial-gradient(circle at center, #020b06 0, #020202 55%);
          padding: 60px 20px 70px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
        }

        :global(.Neyraq-landing .section-inner) {
          max-width: var(--max-width);
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        :global(.Neyraq-landing .section-alt-inner) {
          max-width: var(--max-width);
          margin: 0 auto;
          border-radius: 28px;
          border: 1px solid rgba(34, 197, 94, 0.35);
          padding: 32px 22px 28px;
          background: radial-gradient(circle at top left, #020b06 0, #020202 60%);
          position: relative;
          z-index: 1;
        }

        @media (min-width: 720px) {
          :global(.Neyraq-landing .section-alt-inner) {
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
            gap: 28px;
          }
        }

        :global(.Neyraq-landing .section-center-block) {
          text-align: center;
          max-width: 640px;
          margin: 0 auto;
        }

        :global(.Neyraq-landing .section-kicker) {
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 12px;
        }

        :global(.Neyraq-landing .section-ornament) {
          width: 120px;
          height: 1px;
          margin: 0 auto 14px;
          background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.8), transparent);
          box-shadow: 0 0 24px rgba(34, 197, 94, 0.3);
          opacity: 0.8;
        }

        :global(.Neyraq-landing .section-title) {
          font-family: var(--font-landing-playfair), "Times New Roman", serif;
          font-size: 26px;
          margin-bottom: 12px;
        }

        :global(.Neyraq-landing .section-title-large) {
          font-size: clamp(24px, 4vw, 34px);
        }

        :global(.Neyraq-landing .section-text) {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }

        :global(.Neyraq-landing .section-lead) {
          margin-top: 10px;
        }

        :global(.Neyraq-landing .section-stack) {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        :global(.Neyraq-landing .section-card) {
          border-radius: 16px;
          border: 1px solid rgba(34, 197, 94, 0.35);
          background: linear-gradient(145deg, rgba(2, 8, 4, 0.95), rgba(5, 5, 5, 0.92));
          padding: 14px 16px;
          box-shadow: 0 14px 46px rgba(0, 0, 0, 0.55), 0 8px 24px rgba(34, 197, 94, 0.12);
        }

        :global(.Neyraq-landing .section-card-title) {
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-soft);
          margin-bottom: 8px;
        }

        :global(.Neyraq-landing .section-card-text) {
          font-size: 13px;
          line-height: 1.6;
          color: var(--muted);
          margin-bottom: 10px;
        }

        :global(.Neyraq-landing .section-card-meta) {
          font-size: 12px;
          color: #e5e7eb;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.24);
        }

        :global(.Neyraq-landing .section-pills-row) {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        :global(.Neyraq-landing .section-pill) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.5);
          background: rgba(0, 0, 0, 0.85);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-soft);
          box-shadow: 0 8px 30px rgba(34, 197, 94, 0.18);
          position: relative;
          overflow: hidden;
        }

        :global(.Neyraq-landing .section-pill-dot) {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.9);
        }

        :global(.Neyraq-landing .section-alt-cards) {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        :global(.Neyraq-landing .section-alt-card) {
          min-width: 180px;
          max-width: 260px;
          border-radius: 18px;
          border: 1px solid rgba(34, 197, 94, 0.4);
          background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), rgba(0, 0, 0, 0.98));
          padding: 14px 16px 16px;
          font-size: 12px;
          color: var(--muted);
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.6),
            0 12px 40px rgba(34, 197, 94, 0.18);
          position: relative;
          overflow: hidden;
        }

        :global(.Neyraq-landing .section-alt-card-label) {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 6px;
          color: var(--accent-soft);
        }

        :global(.Neyraq-landing .nl-list) {
          margin-top: 10px;
          display: grid;
          gap: 6px;
          color: #e5e7eb;
          font-size: 12px;
          text-align: left;
          padding-left: 14px;
          list-style: disc;
        }

        :global(.Neyraq-landing .badge-line) {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(34, 197, 94, 0.28);
          background: rgba(34, 197, 94, 0.06);
          color: #e5e7eb;
          font-size: 12px;
        }

        :global(.Neyraq-landing .micro-bar) {
          margin-top: 12px;
          display: grid;
          gap: 6px;
        }

        :global(.Neyraq-landing .micro-bar span) {
          display: block;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.8));
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.25);
        }

        :global(.Neyraq-landing .section::before),
        :global(.Neyraq-landing .section-alt::before) {
          content: "";
          position: absolute;
          inset: -40px;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.16;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }


        @keyframes floatPulse {
          0% {
            transform: translateY(0);
            box-shadow: 0 0 0 rgba(34, 197, 94, 0);
          }
          100% {
            transform: translateY(-6px);
            box-shadow: 0 0 26px rgba(34, 197, 94, 0.4);
          }
        }

        :global(.Neyraq-landing .section-pill:nth-child(1)),
        :global(.Neyraq-landing .section-alt-card:nth-child(1)) {
          animation: floatPulse 7s ease-in-out infinite alternate;
        }

        :global(.Neyraq-landing .section-pill:nth-child(2)),
        :global(.Neyraq-landing .section-alt-card:nth-child(2)) {
          animation: floatPulse 7s ease-in-out 0.9s infinite alternate;
        }

        :global(.Neyraq-landing .section-pill:nth-child(3)),
        :global(.Neyraq-landing .section-alt-card:nth-child(3)) {
          animation: floatPulse 7s ease-in-out 1.8s infinite alternate;
        }

        :global(.Neyraq-landing .footer) {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          background: #050505;
          font-size: 11px;
          color: var(--muted);
        }

        :global(.Neyraq-landing .footer-inner) {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
        }

        :global(.Neyraq-landing a.link) {
          color: var(--muted);
          text-decoration: none;
        }

        :global(.Neyraq-landing a.link:hover) {
          color: var(--text);
        }

        :global(.Neyraq-landing .bootloader) {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, #020b06 0, #000000 60%);
          color: #e5e7eb;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          font-size: 12px;
          line-height: 1.4;
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }

        :global(.Neyraq-landing .bootloader-hidden) {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        :global(.Neyraq-landing .bootloader-logo) {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 11px;
          color: #9ca3af;
        }

        :global(.Neyraq-landing .bootloader-logo-mark) {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 0%, #22c55e40, #020617f0);
        }

        :global(.Neyraq-landing .bootloader-logo-dot) {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: conic-gradient(from 210deg, #22c55e, #16a34a, #22c55e);
        }

        :global(.Neyraq-landing .bootloader-log) {
          width: 100%;
          max-width: 520px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.7);
          background: rgba(0, 0, 0, 0.96);
          box-shadow: 0 0 80px rgba(21, 128, 61, 0.9);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
          color: #bbf7d0;
          max-height: 180px;
          overflow: hidden;
        }

        :global(.Neyraq-landing .bootloader-log-line) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :global(.Neyraq-landing .bootloader-progress) {
          margin-top: 16px;
          width: 220px;
          height: 3px;
          border-radius: 999px;
          background: #011409;
          overflow: hidden;
        }

        :global(.Neyraq-landing .bootloader-progress-bar) {
          height: 100%;
          width: 0;
          background: linear-gradient(to right, #22c55e, #16a34a);
          transition: width 0.35s ease-out;
        }

        :global(.Neyraq-landing .bootloader-hint) {
          margin-top: 14px;
          font-size: 11px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}


