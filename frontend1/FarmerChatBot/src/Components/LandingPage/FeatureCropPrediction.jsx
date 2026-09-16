import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const textBlocks = [
  {
    title: 'Input your soil data',
    body: 'Enter Nitrogen, Phosphorus, Potassium levels along with pH, temperature, humidity, and rainfall — or choose a regional preset like "Bengal Delta Paddy" for instant calibration.',
  },
  {
    title: 'ML predicts the best crop',
    body: 'Our trained model cross-references your soil metrics against thousands of agronomic data points to recommend the crop with the highest predicted yield for your exact conditions.',
  },
  {
    title: 'Get yield & profit estimates',
    body: 'See projected yield in MT/hectare, estimated revenue per acre, and net margin — so you make informed decisions before sowing a single seed.',
  },
];

const fadeVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ── Text Block that fades in when scrolled into view ──
function ScrollTextBlock({ title, body, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <motion.div
      ref={ref}
      className="lp-feature-text-block"
      variants={fadeVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="lp-label" style={{ marginBottom: '0.75rem' }}>
        Step {index + 1}
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </motion.div>
  );
}

// ── Stylized Crop Prediction Mockup ──
function MockupPanel() {
  return (
    <div className="lp-mockup-card">
      <div className="lp-mockup-header">
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--lp-green)',
          }}
        />
        <span>Crop Recommendation Engine</span>
      </div>
      <div className="lp-mockup-body">
        <div className="lp-mockup-row">
          <span className="lp-mockup-row-label">Nitrogen (N)</span>
          <span className="lp-mockup-row-value" style={{ color: 'var(--lp-green)' }}>
            90 kg/ha
          </span>
        </div>
        <div className="lp-mockup-row">
          <span className="lp-mockup-row-label">Phosphorus (P)</span>
          <span className="lp-mockup-row-value" style={{ color: 'var(--lp-accent)' }}>
            42 kg/ha
          </span>
        </div>
        <div className="lp-mockup-row">
          <span className="lp-mockup-row-label">Potassium (K)</span>
          <span className="lp-mockup-row-value" style={{ color: '#64b5f6' }}>
            43 kg/ha
          </span>
        </div>
        <div className="lp-mockup-row">
          <span className="lp-mockup-row-label">pH</span>
          <span className="lp-mockup-row-value">6.5</span>
        </div>
        <div className="lp-mockup-row">
          <span className="lp-mockup-row-label">Temperature</span>
          <span className="lp-mockup-row-value">24.5°C</span>
        </div>
        <div className="lp-mockup-row">
          <span className="lp-mockup-row-label">Rainfall</span>
          <span className="lp-mockup-row-value">210 mm</span>
        </div>

        <div className="lp-mockup-result">
          <h4>Recommended Crop</h4>
          <p>🌾 Rice (Paddy)</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--lp-text-dim)',
            }}
          >
            <span>
              Yield: <strong style={{ color: 'var(--lp-text)' }}>4.8 MT/ha</strong>
            </span>
            <span>
              Margin: <strong style={{ color: 'var(--lp-accent)' }}>₹44,500/acre</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeatureCropPrediction() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      className="lp-section"
      style={{
        padding: '0 1.5rem',
        minHeight: 'auto',
      }}
      ref={sectionRef}
    >
      <div className="lp-container">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '1rem', paddingTop: '6rem' }}
        >
          <span className="lp-label">Feature · Crop Intelligence</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lp-headline"
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            marginBottom: '4rem',
          }}
        >
          Know your soil.{' '}
          <span style={{ color: 'var(--lp-green)' }}>Grow your best.</span>
        </motion.h2>

        {/* Sticky layout wrapper */}
        <div
          className="lp-feature-sticky-wrap"
          style={{
            display: 'flex',
            gap: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Sticky mockup panel (desktop only) */}
          <div className="lp-feature-sticky-panel">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <MockupPanel />
            </motion.div>
          </div>

          {/* Scrolling text column */}
          <div className="lp-feature-scroll-col">
            {textBlocks.map((block, i) => (
              <ScrollTextBlock
                key={i}
                index={i}
                title={block.title}
                body={block.body}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
