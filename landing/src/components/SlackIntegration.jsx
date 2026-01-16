import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

// Slack-style message component
function SlackMessage({ avatar, name, time, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: avatar.color }}
      >
        {avatar.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-xs text-muted">{time}</span>
        </div>
        <div className="text-muted text-sm mt-0.5">{children}</div>
      </div>
    </motion.div>
  );
}

// Alert card component
function AlertCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-red-600">Critical Alert</span>
            <span className="px-2 py-0.5 bg-red-100 rounded text-xs text-red-600">P1</span>
          </div>
          <p className="text-sm text-muted mt-1">
            Production API latency spike detected on <code className="text-red-600 bg-red-50 px-1 rounded border border-red-200">user-service</code>
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> 2 min ago
            </span>
            <span>Affected: 12,847 requests</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Analysis card component
function AnalysisCard({ delay = 0, onApplyFix }) {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
      onApplyFix?.();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="bg-violet-50 border border-violet-200 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-violet-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-violet-600">Lumniverse Analysis</span>
            <span className="px-2 py-0.5 bg-violet-100 rounded text-xs text-violet-600">AI</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted">Root cause: Connection pool exhausted on postgres-primary</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted">Impact: 47 downstream services affected</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted">Suggested fix: Increase max_connections from 100 to 200</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {!isApplied ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={isApplying}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Applying...
                    </>
                  ) : (
                    'Apply Fix'
                  )}
                </motion.button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-muted text-sm font-medium rounded-lg transition-colors">
                  View Details
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Fix applied successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Resolution card
function ResolutionCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="bg-green-50 border border-green-200 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-600">Incident Resolved</span>
            <span className="px-2 py-0.5 bg-green-100 rounded text-xs text-green-600">Auto</span>
          </div>
          <p className="text-sm text-muted mt-1">
            Database connection pool increased. All services recovered. MTTR: <span className="text-green-600 font-semibold">3m 42s</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function SlackIntegration() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [showResolution, setShowResolution] = useState(false);

  return (
    <section ref={sectionRef} className="py-24 bg-canvas/80">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted mb-6">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#E01E5A]">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.312z"/>
            </svg>
            Slack Integration
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Resolve incidents where you work
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Get alerts, analysis, and apply fixes directly from Slack
          </p>
        </motion.div>

        {/* Slack-style interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-lg">
            {/* Slack header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-muted">#</span>
                <span className="font-semibold text-foreground">incidents-prod</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-muted">3 online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-4">
              <SlackMessage
                avatar={{ initials: 'LV', color: '#7c3aed' }}
                name="Lumniverse"
                time="2:34 PM"
                delay={0.1}
              >
                <AlertCard delay={0.2} />
              </SlackMessage>

              <SlackMessage
                avatar={{ initials: 'JD', color: '#3b82f6' }}
                name="John Doe"
                time="2:35 PM"
                delay={0.3}
              >
                <p>Looking into this now. @lumniverse can you analyze?</p>
              </SlackMessage>

              <SlackMessage
                avatar={{ initials: 'LV', color: '#7c3aed' }}
                name="Lumniverse"
                time="2:35 PM"
                delay={0.4}
              >
                <AnalysisCard delay={0.5} onApplyFix={() => setShowResolution(true)} />
              </SlackMessage>

              {showResolution && (
                <SlackMessage
                  avatar={{ initials: 'LV', color: '#7c3aed' }}
                  name="Lumniverse"
                  time="2:38 PM"
                  delay={0}
                >
                  <ResolutionCard delay={0.1} />
                </SlackMessage>
              )}
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-border">
              <div className="bg-surface rounded-lg px-4 py-2 text-muted text-sm">
                Message #incidents-prod
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
