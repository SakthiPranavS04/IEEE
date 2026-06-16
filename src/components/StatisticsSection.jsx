import React, { useState, useEffect, useRef } from 'react';

// Sub-component for animated counter trigger
const CountUpItem = ({ target }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const targetVal = parseInt(target, 10) || 0;
    if (targetVal === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 1200; // Animation speed in ms
          const increment = Math.max(Math.ceil(targetVal / (duration / 20)), 1);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= targetVal) {
              setCount(targetVal);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 20);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target]);

  const suffix = typeof target === 'string' && target.includes('+') ? '+' : (typeof target === 'number' || !target.toString().endsWith('+') ? '+' : '');

  return (
    <span ref={elementRef} className="stat-number colored">
      {count}{suffix}
    </span>
  );
};

const StatisticsSection = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <section className="container">
      <div className="stats-section scroll-reveal zoom-in">
        <div className="stats-grid">
          <div className="stat-item">
            <CountUpItem target={statistics.members} />
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat-item">
            <CountUpItem target={statistics.events} />
            <span className="stat-label">Events Hosted</span>
          </div>
          <div className="stat-item">
            <CountUpItem target={statistics.awards} />
            <span className="stat-label">Awards Won</span>
          </div>
          <div className="stat-item">
            <CountUpItem target={statistics.projects} />
            <span className="stat-label">Projects Guided</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
