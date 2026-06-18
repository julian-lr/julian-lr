import { useEffect } from 'react'
import styles from './Navbar.module.scss'
import useTheme from '../../../hooks/useTheme'

interface NavbarProps {
  current: number;
  setCurrent: (idx: number) => void;
  sections: { id: string; name: string }[];
}

// SVG icon for sun (light mode)
function SunIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <g stroke="currentColor">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  )
}

// SVG icon for moon (dark mode)
function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="currentColor" />
    </svg>
  )
}

// Utility: focus the first heading in a section by id
function focusSectionHeading(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (section) {
    // Special case: Home section, focus profile image
    if (sectionId === 'home') {
      const profileImg = section.querySelector('img');
      if (profileImg && typeof (profileImg as HTMLElement).focus === 'function') {
        (profileImg as HTMLElement).setAttribute('tabindex', '-1');
        (profileImg as HTMLElement).focus();
        (profileImg as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    // Try to find a heading inside the section
    const heading = section.querySelector('h2, h1');
    if (heading && typeof (heading as HTMLElement).focus === 'function') {
      (heading as HTMLElement).setAttribute('tabindex', '-1');
      (heading as HTMLElement).focus();
      (heading as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function Navbar({ current, setCurrent, sections }: NavbarProps) {
  // Track if the mobile menu is open
  const [open, setOpen] = useState(false)
  // Use centralized theme hook (reads system, persists preference)
  const { theme, setTheme } = useTheme()

  // Handle link click: set current section, close mobile menu
  const handleClick = (idx: number) => {
    setCurrent(idx);
    setOpen(false);
    // On mobile, scroll/focus to section heading
    if (window.innerWidth <= 599) {
      setTimeout(() => {
        focusSectionHeading(sections[idx].id);
      }, 0);
    }
  }

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <nav className={styles.navbar}>
      {/* Navbar content: logo, burger, desktop links, theme toggle */}
      <div className={styles.navbarContent}>
        <span className={styles.logo}>JLR</span>
        {/* Burger menu button for mobile */}
        <button
          className={open ? styles.burger + ' ' + styles.burgerOpen : styles.burger}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerBar}></span>
          <span className={styles.burgerBar}></span>
          <span className={styles.burgerBar}></span>
        </button>
        {/* Desktop menu: links and dividers, theme toggle at end */}
        <div className={styles.linksDesktop}>
          {sections.map((link, idx) => (
            <>
              {/* Nav link */}
              <span
                key={link.id}
                className={
                  styles.link +
                  (current === idx ? ' ' + styles.active : '')
                }
                onClick={() => handleClick(idx)}
                onMouseDown={e => e.preventDefault()}
              >
                <span className={styles.linkText}>{link.name}</span>
              </span>
              {/* Divider between links, not after last */}
              {idx < sections.length - 1 && (
                <span key={'divider-' + idx} className={styles.divider}>|</span>
              )}
            </>
          ))}
          {/* Theme toggle button (SVG icon) */}
          <button
            className={styles.themeToggle}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
      {/* Mobile menu: links stacked, theme toggle centered below */}
      <div className={open ? styles.linksMobileOpen : styles.linksMobile}>
        {sections.map((link, idx) => (
          <span
            key={link.id}
            className={
              styles.link +
              (current === idx ? ' ' + styles.active : '')
            }
            onClick={() => handleClick(idx)}
            onMouseDown={e => e.preventDefault()}
          >
            <span className={styles.linkText}>{link.name}</span>
          </span>
        ))}
        {/* Theme toggle centered in mobile menu */}
        <button
          className={styles.themeToggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={toggleTheme}
          type="button"
        >
          {theme === 'light' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
