import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Custom hook to initialize GSAP ScrollTrigger animations and smooth card hover transitions.
 * Automatically refreshes triggers and binds hover listeners when dependencies change.
 */
export function useGsapScrollTrigger(dependencies: any[] = []) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // GSAP context for safe React cleanup
    const ctx = gsap.context(() => {
      // 1. General Section Reveals (smooth scroll fade-up)
      const sections = document.querySelectorAll('.gsap-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // 3. Reveal Elements (fade in with gentle elevation)
      const revealElements = document.querySelectorAll('.gsap-reveal');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // 4. Staggered Groups (e.g., cards grid, gallery items, quick selections)
      const staggerContainers = document.querySelectorAll('.gsap-stagger-container');
      staggerContainers.forEach((container) => {
        const items = container.querySelectorAll('.gsap-stagger-item');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            {
              opacity: 0,
              y: 40,
              scale: 0.96,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.09,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          );
        }
      });

      // 5. Card Fade-ins (smooth scroll fade-in for individual cards)
      const cards = document.querySelectorAll('.gsap-card-reveal');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // 6. Smooth GSAP Hover Transitions on all interactive cards
      const interactiveCards = document.querySelectorAll<HTMLElement>('.gsap-card-interactive');
      interactiveCards.forEach((card) => {
        let bounds: DOMRect;

        const onMouseEnter = () => {
          bounds = card.getBoundingClientRect();
          gsap.to(card, {
            scale: 1.025,
            y: -5,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(197, 160, 89, 0.2)',
            duration: 0.4,
            ease: 'power2.out',
          });
        };

        const onMouseMove = (e: MouseEvent) => {
          if (!bounds) bounds = card.getBoundingClientRect();
          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;
          const xPct = (mouseX / bounds.width - 0.5) * 2;
          const yPct = (mouseY / bounds.height - 0.5) * 2;

          gsap.to(card, {
            rotateY: xPct * 4.5,
            rotateX: -yPct * 4.5,
            duration: 0.35,
            ease: 'power1.out',
            transformPerspective: 1000,
          });
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            duration: 0.55,
            ease: 'power3.out',
          });
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
      });
    }, containerRef);

    // Refresh ScrollTrigger after DOM has settled
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, dependencies);

  return containerRef;
}

/**
 * Custom hook to attach smooth GSAP 3D hover & spring transitions to a specific card ref
 */
export function useGsapCardHover<T extends HTMLElement = HTMLDivElement>() {
  const cardRef = useRef<T | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let bounds: DOMRect;

    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      gsap.to(card, {
        scale: 1.025,
        y: -5,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(197, 160, 89, 0.2)',
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      gsap.to(card, {
        rotateY: xPct * 4.5,
        rotateX: -yPct * 4.5,
        duration: 0.35,
        ease: 'power1.out',
        transformPerspective: 1000,
      });
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        duration: 0.55,
        ease: 'power3.out',
      });
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      gsap.killTweensOf(card);
    };
  }, []);

  return cardRef;
}
