import React, { useRef, useEffect } from 'react';
import Home from '../../pages/Home/Home';
import AboutMe from '../../pages/AboutMe/AboutMe';
import Projects from '../../pages/Projects/Projects';
import WorkExperience from '../../pages/WorkExperience/WorkExperience';
import Education from '../../pages/Education/Education';
import Courses from '../../pages/Courses/Courses';
import Contact from '../../pages/Contact/Contact';
import { useIsMobileOrTablet } from './useIsMobileOrTablet';
import styles from './FullPageContainer.module.scss';

// Maps section IDs to their corresponding components
const sectionComponents: Record<string, React.ReactNode> = {
  home: <Home key="home" />,
  aboutme: <AboutMe key="aboutme" />,
  workexperience: <WorkExperience key="workexperience" />,
  projects: <Projects key="projects" />,
  education: <Education key="education" />,
  courses: <Courses key="courses" />,
  contact: <Contact key="contact" />,
};

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// Matches the CSS transition duration, shortened when the user prefers reduced motion
function getTransitionLockMs() {
  if (typeof window === 'undefined' || !window.matchMedia) return 700;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 700;
}

interface FullPageContainerProps {
  current: number;
  setCurrent: (idx: number) => void;
  sections: { id: string; name: string }[];
}

const FullPageContainer: React.FC<FullPageContainerProps> = ({ current, setCurrent, sections }) => {
  const isMobileOrTablet = useIsMobileOrTablet();
  const isTransitioning = useRef(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Only enable navigation handlers on desktop
  useEffect(() => {
    if (isMobileOrTablet) return;
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning.current) return;
      const section = sectionRefs.current[current];
      if (!section) return;
      const atTop = section.scrollTop === 0;
      const atBottom = section.scrollHeight - section.scrollTop === section.clientHeight;
      if (e.deltaY > 0 && atBottom && current < sections.length - 1) {
        isTransitioning.current = true;
        setCurrent(clamp(current + 1, 0, sections.length - 1));
        e.preventDefault();
      } else if (e.deltaY < 0 && atTop && current > 0) {
        isTransitioning.current = true;
        setCurrent(clamp(current - 1, 0, sections.length - 1));
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [current, setCurrent, sections.length, isMobileOrTablet]);

  useEffect(() => {
    if (isMobileOrTablet) return;
    let startY = 0;
    let endY = 0;
    let startScroll = 0;
    let isSwiping = false;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      const section = sectionRefs.current[current];
      startScroll = section ? section.scrollTop : 0;
      isSwiping = true;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;
      const section = sectionRefs.current[current];
      if (!section) return;
      const atTop = section.scrollTop === 0;
      if (atTop && e.touches[0].clientY - startY > 10) {
        e.preventDefault();
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping) return;
      endY = e.changedTouches[0].clientY;
      const deltaY = endY - startY;
      const section = sectionRefs.current[current];
      if (!section || isTransitioning.current) return;
      const atTop = section.scrollTop === 0;
      const atBottom = section.scrollHeight - section.scrollTop === section.clientHeight;
      const noScroll = section.scrollHeight === section.clientHeight;
      if (deltaY > 40 && (atTop || noScroll) && startScroll === 0 && current > 0) {
        isTransitioning.current = true;
        setCurrent(clamp(current - 1, 0, sections.length - 1));
      } else if (deltaY < -40 && (atBottom || noScroll) && current < sections.length - 1) {
        isTransitioning.current = true;
        setCurrent(clamp(current + 1, 0, sections.length - 1));
      }
      isSwiping = false;
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [current, setCurrent, sections.length, isMobileOrTablet]);

  useEffect(() => {
    if (isMobileOrTablet) return;
    const handleKey = (e: KeyboardEvent) => {
      if (isTransitioning.current) return;
      const section = sectionRefs.current[current];
      if (!section) return;
      const atTop = section.scrollTop === 0;
      const atBottom = section.scrollHeight - section.scrollTop === section.clientHeight;
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && atBottom && current < sections.length - 1) {
        isTransitioning.current = true;
        setCurrent(clamp(current + 1, 0, sections.length - 1));
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && atTop && current > 0) {
        isTransitioning.current = true;
        setCurrent(clamp(current - 1, 0, sections.length - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, setCurrent, sections.length, isMobileOrTablet]);

  useEffect(() => {
    if (isMobileOrTablet) return;
    const timeout = setTimeout(() => {
      isTransitioning.current = false;
    }, getTransitionLockMs());
    return () => clearTimeout(timeout);
  }, [current, isMobileOrTablet]);

  // Reset scroll to top when section changes (desktop only)
  useEffect(() => {
    if (isMobileOrTablet) return;
    const section = sectionRefs.current[current];
    if (section) {
      section.scrollTop = 0;
    }
  }, [current, isMobileOrTablet]);

  if (isMobileOrTablet) {
    // Stacked layout for mobile: all sections, normal scroll
    return (
      <main id="main-content">
        {sections.map(section => (
          <section key={section.id} id={section.id} className={styles.section} aria-label={section.name}>
            {sectionComponents[section.id]}
          </section>
        ))}
      </main>
    );
  }

  return (
    <main id="main-content" className={styles.fullPageContainer}>
      <div
        className={styles.fullPageWrapper}
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {sections.map((section, idx) => (
          <section
            className={styles.section}
            key={section.id}
            id={section.id}
            aria-label={section.name}
            inert={idx !== current}
            ref={el => { sectionRefs.current[idx] = el; }}
          >
            {sectionComponents[section.id]}
          </section>
        ))}
      </div>
    </main>
  );
};

export default FullPageContainer;
