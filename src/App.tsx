import { useState, useEffect, useRef } from 'react'
import Navbar from './components/layout/Navbar/Navbar'
import FullPageContainer from './components/layout/FullPageContainer'
import { useIsMobile } from './components/layout/useIsMobile'
import './App.scss'

// Section definitions for navigation and layout
const sections = [
  { id: 'home', name: 'Home' },
  { id: 'aboutme', name: 'About me' },
  { id: 'workexperience', name: 'Work experience' },
  { id: 'projects', name: 'Projects' },
  { id: 'education', name: 'Education' },
  { id: 'courses', name: 'Courses' },
  { id: 'contact', name: 'Contact' },
]

function App() {
  const [currentSection, setCurrentSection] = useState(0)
  const isMobile = useIsMobile()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isMobile) return
    let cancelled = false
    function setupObserverWhenReady() {
      // Map: section id -> observed element
      const idToElement = sections.map(s => {
        if (s.id === 'home') {
          const section = document.getElementById('home')
          return { id: s.id, el: section ? section.querySelector('img') : null }
        } else {
          const section = document.getElementById(s.id)
          return { id: s.id, el: section ? section.querySelector('h2, h1') : null }
        }
      }).filter(pair => pair.el)
      if (idToElement.length !== sections.length) {
        rafRef.current = requestAnimationFrame(setupObserverWhenReady)
        return
      }
      if (cancelled) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new window.IntersectionObserver(
        entries => {
          // Find the entry that appears first in the viewport (lowest boundingClientRect.top >= 0)
          let topMostEntry: IntersectionObserverEntry | null = null
          let minTop = Infinity
          
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const rect = entry.boundingClientRect
              // Only consider elements that are fully visible from the top
              if (rect.top >= -50 && rect.top < minTop) {
                minTop = rect.top
                topMostEntry = entry
              }
            }
          })
          
          if (topMostEntry) {
            const foundIdx = idToElement.findIndex(pair => pair.el === topMostEntry!.target)
            if (foundIdx !== -1) {
              setCurrentSection(foundIdx)
            }
          }
        },
        {
          root: null,
          rootMargin: '-90px 0px -70% 0px', // navbar offset + ensure title is prominently visible
          threshold: 0,
        }
      )
      idToElement.forEach(pair => {
        if (pair.el) observerRef.current!.observe(pair.el)
      })
    }
    setupObserverWhenReady()
    return () => {
      cancelled = true
      if (observerRef.current) observerRef.current.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar
        current={currentSection}
        setCurrent={setCurrentSection}
        sections={sections}
      />
      <FullPageContainer
        current={currentSection}
        setCurrent={setCurrentSection}
        sections={sections}
      />
    </>
  )
}

export default App