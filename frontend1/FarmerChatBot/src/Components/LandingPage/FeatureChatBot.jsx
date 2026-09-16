import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const farmerQuestion = 'माझ्या टोमॅटोच्या पानांवर तपकिरी डाग आहेत, काय करावे?';
const aiResponse =
  'हा Early Blight (Alternaria solani) आहे.\n\n✅ उपाय:\n• Mancozeb 75% WP — 2g प्रति लिटर पाण्यात मिसळून फवारणी करा.\n• नीम तेल (Azadirachtin) — 3ml/L सेंद्रिय पर्याय.\n• खालची पिवळी पाने काढून नष्ट करा.';

// ── Typewriter Hook ──
function useTypewriter(text, speed = 35, startTyping = false) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayed('');
      setIsDone(false);
      return;
    }

    let i = 0;
    setDisplayed('');
    setIsDone(false);

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, startTyping]);

  return { displayed, isDone };
}

export default function FeatureChatBot() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-120px' });
  const prefersReduced = useReducedMotion();

  // Phase control: question → pause → answer
  const [phase, setPhase] = useState('idle'); // idle | question | pause | answer

  const {
    displayed: questionText,
    isDone: questionDone,
  } = useTypewriter(farmerQuestion, prefersReduced ? 0 : 30, phase === 'question' || phase === 'pause' || phase === 'answer');

  const {
    displayed: answerText,
    isDone: answerDone,
  } = useTypewriter(aiResponse, prefersReduced ? 0 : 20, phase === 'answer');

  // Start sequence when in view
  useEffect(() => {
    if (isInView && phase === 'idle') {
      const timer = setTimeout(() => setPhase('question'), 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, phase]);

  // Transition from question → pause → answer
  useEffect(() => {
    if (questionDone && phase === 'question') {
      const timer = setTimeout(() => setPhase('pause'), 200);
      return () => clearTimeout(timer);
    }
  }, [questionDone, phase]);

  useEffect(() => {
    if (phase === 'pause') {
      const timer = setTimeout(() => setPhase('answer'), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <section className="lp-section" ref={sectionRef}>
      <div className="lp-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '1rem' }}
        >
          <span className="lp-label">Feature · Kisan AI</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lp-headline"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            marginBottom: '0.75rem',
          }}
        >
          Ask anything.{' '}
          <span style={{ color: 'var(--lp-green)' }}>In your language.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lp-subhead"
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          Kisan AI understands Marathi, Hindi, Kannada, Telugu, Gujarati, and English — 
          and gives precise, farmer-friendly answers with voice support.
        </motion.p>

        {/* Chat mockup */}
        <motion.div
          className="lp-chat-window"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="lp-chat-header">
            <div className="lp-chat-dot" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              Kisan AI
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--lp-text-muted)',
                marginLeft: 'auto',
              }}
            >
              मराठी • Marathi
            </span>
          </div>

          {/* Chat body */}
          <div className="lp-chat-body" style={{ minHeight: '280px' }}>
            {/* Farmer question */}
            {phase !== 'idle' && (
              <div className="lp-chat-msg lp-chat-msg--user">
                {questionText}
                {phase === 'question' && !questionDone && (
                  <span className="lp-chat-cursor" />
                )}
              </div>
            )}

            {/* Typing indicator */}
            {phase === 'pause' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                }}
              >
                <div className="lp-chat-dot" style={{ width: '6px', height: '6px' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--lp-text-muted)' }}>
                  AI is thinking…
                </span>
              </div>
            )}

            {/* AI response */}
            {phase === 'answer' && (
              <div className="lp-chat-msg lp-chat-msg--ai" style={{ whiteSpace: 'pre-wrap' }}>
                {answerText}
                {!answerDone && <span className="lp-chat-cursor" />}
              </div>
            )}
          </div>

          {/* Input bar (static) */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--lp-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--lp-border)',
                fontSize: '0.85rem',
                color: 'var(--lp-text-muted)',
              }}
            >
              तुमचा प्रश्न विचारा...
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--lp-green-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}
            >
              🎤
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
