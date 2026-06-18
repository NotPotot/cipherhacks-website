import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from 'react-countdown';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import {
  HeartIcon,
  CodeBracketIcon,
  XMarkIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  KeyIcon,
  RocketLaunchIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import InstagramIcon from './components/InstagramIcon';
import PdfViewer from './components/PdfViewer';
import Footer from './components/Footer';
import FaqPopup from './components/FaqPopup';
import VulnerableSearch from './components/VulnerableSearch';
import { MirageProvider } from '@mirageshield/mirage/react';
import {
  EVENT_DATE,
  generateTerminalText,
  NAV_ITEMS,
  NAV_ACTION_BUTTONS,
  FEATURES,
  HERO_ITEMS,
  WHAT_TO_EXPECT,
  FAQ_ITEMS,
  SPONSOR_TIERS,
  DONATORS,
  HCB_TRANSPARENCY_URL,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  TEAM_MEMBERS,
  COMMANDS,
  type SponsorInfo,
  ASCII_ART,
} from './constants';

// Set this to a Date object for a real countdown, or null for TBD
const targetDate: Date | null = EVENT_DATE; // Example: new Date('2024-08-10T09:00:00')

interface TerminalProps {
  onStateChange: (state: 'open' | 'minimized' | 'closed') => void;
}

const Terminal: React.FC<TerminalProps> = ({ onStateChange }) => {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const terminalText = useMemo(() => generateTerminalText(), []);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(terminalText.slice(0, index));
      index++;
      if (index > terminalText.length) {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [terminalText]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const args = cmd.trim().split(' ');
    const commandName = args[0].toLowerCase();
    const command = COMMANDS.find(c => c.name === commandName);

    if (!command) {
      return `Command not found: ${commandName}. Type "help" for available commands.`;
    }

    return await command.action(args.slice(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [
      ...history,
      `hacker@cipherhacks:/home/hacker/cipherhacks$ ${input}`,
      await handleCommand(input)
    ].filter(Boolean);
    setHistory(newHistory);
    setCommandHistory(prev => [input, ...prev]);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Reset history when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      setHistory([
        ASCII_ART.logo,
        'Welcome to CipherHacks CLI! Type "help" to see available commands.',
        'Current user: hacker@cipherhacks',
        ''
      ]);
      setCommandHistory([]);
      setHistoryIndex(-1);
      setInput('');
    }
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-2 bg-atom-bg bg-opacity-50">
          <h2 className="text-atom-blue font-mono text-lg">hacker@cipherhacks: ~</h2>
          <motion.button
            aria-label="Close fullscreen terminal"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsFullscreen(false);
              setHistory([]);
            }}
            className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
          />
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono">
          {history.map((line, i) => (
            <pre 
              key={i} 
              className="text-atom-green whitespace-pre-wrap mb-2"
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-atom-blue">hacker@cipherhacks:~$</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-atom-green font-mono"
              autoFocus
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </motion.div>
    );
  }

  if (isMinimized) {
    return (
      <motion.button
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        onClick={() => {
          setIsMinimized(false);
          onStateChange('open');
        }}
        className="bg-black bg-opacity-80 p-3 rounded-lg font-mono text-sm w-full max-w-2xl mx-auto flex items-center justify-between hover:bg-opacity-90 transition-all duration-300 border border-atom-blue border-opacity-20 hover:border-opacity-50"
      >
        <div className="flex items-center space-x-2">
          <CodeBracketIcon className="h-5 w-5 text-atom-blue" />
          <span className="text-atom-blue">Terminal (Click to expand)</span>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onStateChange('closed');
              setIsMinimized(false);
            }}
            aria-label="Close terminal"
            className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
          />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-black bg-opacity-80 p-4 rounded-lg font-mono text-sm md:text-base w-full max-w-2xl mx-auto border border-atom-blue border-opacity-20"
    >
      <div className="flex items-center mb-2 space-x-2">
        <motion.button
          aria-label="Close terminal"
          whileHover={!isMobile ? { scale: 1.1 } : {}}
          whileTap={!isMobile ? { scale: 0.9 } : {}}
          onClick={() => {
            onStateChange('closed');
            setIsMinimized(false);
          }}
          className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
          disabled={isMobile}
        />
        {!isMobile && (
          <>
            <motion.button
              aria-label="Minimize terminal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsMinimized(true);
                onStateChange('minimized');
              }}
              className="h-5 w-5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"
            />
            <motion.button
              aria-label="Maximize terminal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFullscreen(true)}
              className="h-5 w-5 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"
            />
          </>
        )}
      </div>
      <pre className="text-atom-green whitespace-pre-wrap">{text}</pre>
    </motion.div>
  );
};

// Carousel speed constants
const CAROUSEL_SPEED = {
  NORMAL: 135, // pixels per second when not hovered
  HOVERED: 45, // pixels per second when hovered
};

// Add this component near other component definitions
const SponsorCarousel: React.FC<{
  sponsors: SponsorInfo[];
  tier: string;
  onSponsorClick: (sponsor: SponsorInfo) => void;
  isPopupOpen?: boolean;
}> = ({ sponsors, tier, onSponsorClick, isPopupOpen = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [isDragThresholdMet, setIsDragThresholdMet] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(CAROUSEL_SPEED.NORMAL);

  // Only animate when carousel is visible in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Constants
  const DRAG_THRESHOLD = 10; // pixels - minimum movement to start dragging

  // Calculate dimensions
  const baseWidth = tier === 'DIAMOND' ? 320 : tier === 'GOLD' ? 280 : 240;
  const gap = 16;
  const itemWidth = baseWidth + gap;
  const singleSetWidth = itemWidth * sponsors.length;
  const isInfinite = sponsors.length > 3;
  
  // Create triple set for infinite scroll only when there are enough items
  const displaySponsors = isInfinite
    ? [...sponsors, ...sponsors, ...sponsors]
    : sponsors;
  
  // When not infinite, we simply center the items without fixed width

  // Initialize position to middle set
  useEffect(() => {
    if (isInfinite && currentX === 0) {
      setCurrentX(-singleSetWidth);
    }
  }, [isInfinite, singleSetWidth, currentX]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    // Wraps the position to keep it within the infinite scroll bounds
    const wrapPosition = (newX: number) => {
      if (!isInfinite) return newX;
      if (newX <= -singleSetWidth * 2) {
        return newX + singleSetWidth;
      } else if (newX >= 0) {
        return newX - singleSetWidth;
      }
      return newX;
    };

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Determine target speed
    const targetSpeed = (isPopupOpen || isHovered) ? CAROUSEL_SPEED.HOVERED : CAROUSEL_SPEED.NORMAL;

    // Smoothly interpolate speed
    speedRef.current += (targetSpeed - speedRef.current) * 0.05; // Smoothing factor

    // Only animate if not dragging and we have multiple sponsors
    if (!isDragging && isInfinite) {
      const movement = (speedRef.current * deltaTime) / 1000;
      
      setCurrentX(prevX => wrapPosition(prevX - movement));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isDragging, isHovered, isPopupOpen, isInfinite, singleSetWidth]);

  // Start animation only when visible
  useEffect(() => {
    if (isInfinite && isVisible) {
      lastTimeRef.current = 0; // Reset timing when becoming visible
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isInfinite, isVisible]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInfinite) return;
    
    setDragStartX(e.clientX);
    setIsDragThresholdMet(false);
    
    // Don't set isDragging immediately - wait for threshold
  };

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStartX) return;
    
    // Wraps the position to keep it within the infinite scroll bounds
    const wrapPosition = (newX: number) => {
      if (!isInfinite) return newX;
      if (newX <= -singleSetWidth * 2) {
        return newX + singleSetWidth;
      } else if (newX >= 0) {
        return newX - singleSetWidth;
      }
      return newX;
    };
    
    const deltaX = Math.abs(e.clientX - dragStartX);
    
    // Only start dragging if we've moved beyond the threshold
    if (!isDragThresholdMet && deltaX > DRAG_THRESHOLD) {
      setIsDragging(true);
      setIsDragThresholdMet(true);
      
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
    }
    
    // Only update position if we're actually dragging
    if (isDragThresholdMet && isDragging) {
      const actualDeltaX = e.clientX - dragStartX;
      
      setCurrentX(prevX => wrapPosition(prevX + actualDeltaX * 0.8)); // Damping factor for smoother feel
      
      setDragStartX(e.clientX);
    }
  }, [isDragging, isDragThresholdMet, dragStartX, singleSetWidth, isInfinite, DRAG_THRESHOLD]);

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsDragThresholdMet(false);
    setDragStartX(0);
    
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (dragStartX) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [dragStartX, handleMouseMove, handleMouseUp]);

  // Handle card click
  const handleCardClick = (sponsor: SponsorInfo, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only trigger click if we haven't started dragging
    if (!isDragThresholdMet && !isDragging) {
      onSponsorClick(sponsor);
    }
  };

  // Handle card hover
  const handleCardHover = (isHovering: boolean) => {
    setIsHovered(isHovering);
  };

  if (sponsors.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center text-atom-fg-muted py-3 px-3 bg-black bg-opacity-30 rounded-lg border border-atom-blue border-opacity-20">
        No sponsors in this tier yet. Check back soon!
      </div>
    );
  }

  return (
    <div 
      className="relative mx-auto overflow-hidden select-none bg-black bg-opacity-30 rounded-lg border border-atom-blue border-opacity-20 p-1 w-fit max-w-full"
    >
      <div
        ref={containerRef}
        className={`flex gap-4 ${isInfinite ? 'px-4' : 'px-0'} py-2 ${isInfinite ? 'flex-nowrap' : 'flex-wrap justify-center'}`}
        style={{
          transform: isInfinite ? `translateX(${currentX}px)` : 'none',
          cursor: isDragging ? 'grabbing' : (isInfinite ? 'grab' : 'default'),
          width: isInfinite ? itemWidth * displaySponsors.length : 'auto',
          justifyContent: isInfinite ? undefined : 'center'
        }}
        onMouseDown={handleMouseDown}
      >
        {displaySponsors.map((sponsor, i) => (
          <motion.button
            key={`${sponsor.name}-${i}`}
            aria-label={`View details for ${sponsor.name}`}
            className={`
              ${isInfinite ? 'flex-shrink-0' : 'flex-shrink'} flex items-center justify-center p-4
              bg-black bg-opacity-50 rounded-lg
              border-2 border-atom-fg border-opacity-10
              cursor-pointer transition-all duration-300
              hover:border-atom-blue hover:border-opacity-50
              hover:scale-105 hover:-translate-y-2
              user-select-none text-left
              ${sponsor.specialStyle ? sponsor.specialStyle : ''}
            `}
            style={{
              width: baseWidth,
              aspectRatio: tier === 'DIAMOND' ? '16/9' : tier === 'GOLD' ? '4/3' : '3/2',
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              maxWidth: isInfinite ? undefined : 'min(100%, 90vw)'
            }}
            onClick={(e) => handleCardClick(sponsor, e)}
            onMouseEnter={() => handleCardHover(true)}
            onMouseLeave={() => handleCardHover(false)}
          >
            {sponsor.logo ? (
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="max-w-full max-h-full object-contain filter brightness-75 hover:brightness-100 transition-all duration-300"
                  draggable={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-atom-blue text-lg font-semibold text-center px-2">${sponsor.name}</span>`;
                    }
                  }}
                />
              </div>
            ) : (
              <span className="text-atom-blue text-lg font-semibold text-center px-2 leading-tight pointer-events-none">
                {sponsor.name}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      
      {isInfinite && (
        <>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-atom-bg to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-atom-bg to-transparent pointer-events-none" />
        </>
      )}
    </div>
  );
};

const SponsorPopup: React.FC<{
  sponsor: SponsorInfo;
  onClose: () => void;
}> = ({ sponsor, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onAnimationComplete={(definition) => {
        if (definition === "exit") {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
           <motion.div
       className="bg-atom-bg rounded-xl p-6 max-w-md w-full shadow-2xl border-2 border-atom-blue"
       onClick={e => e.stopPropagation()}
       layoutId={`sponsor-${sponsor.name}`}
     >
       <div className="flex justify-between items-start mb-4">
         <h3 className="text-2xl font-bold text-atom-blue">{sponsor.name}</h3>
         <button
           onClick={onClose}
           aria-label="Close sponsor details"
           className="text-atom-fg hover:text-atom-red transition-colors"
         >
           <XMarkIcon className="h-6 w-6" />
         </button>
       </div>
       {sponsor.logo && (
         <div className="mb-4 flex justify-center">
           <img
             src={sponsor.logo}
             alt={`${sponsor.name} logo`}
             className="max-w-32 max-h-20 object-contain"
             onError={(e) => {
               const target = e.target as HTMLImageElement;
               target.style.display = 'none';
               const parent = target.parentElement;
               if (parent) {
                 parent.innerHTML = `<span class="text-atom-blue text-lg font-semibold text-center px-2">${sponsor.name}</span>`;
               }
             }}
           />
         </div>
       )}
       <p className="text-atom-fg-muted mb-4">{sponsor.description}</p>
       {sponsor.popupUrl && (
         <a
           href={sponsor.popupUrl}
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center space-x-2 text-atom-purple hover:underline"
         >
           <span>{sponsor.popupUrlText || 'Visit Website'}</span>
           <GlobeAltIcon className="h-5 w-5" />
         </a>
       )}
     </motion.div>
    </motion.div>
  );
};

const getDefaultIcon = (gender: 'male' | 'female' | 'other') => {
  switch (gender) {
    case 'male':
      return (
        <svg className="h-12 w-12 text-atom-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'female':
      return (
        <svg className="h-12 w-12 text-atom-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <circle cx="12" cy="4" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className="h-12 w-12 text-atom-green" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2M12 20v2" />
        </svg>
      );
  }
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorInfo | null>(null);
  const [terminalState, setTerminalState] = useState<'open' | 'minimized' | 'closed'>('open');
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isActionsMenuHovered, setIsActionsMenuHovered] = useState(false);
  const [isFaqPopupVisible, setIsFaqPopupVisible] = useState(false);
  const [faqPopupDismissed, setFaqPopupDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isActionsMenuOpen && !target.closest('.actions-menu')) {
        setIsActionsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActionsMenuOpen]);

  // Show FAQ popup after 2 seconds if not dismissed
  useEffect(() => {
    if (!faqPopupDismissed) {
      const timer = setTimeout(() => {
        setIsFaqPopupVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [faqPopupDismissed]);

  const handleFaqPopupDismiss = () => {
    setIsFaqPopupVisible(false);
    setFaqPopupDismissed(true);
  };

  // Easter egg in console
  useEffect(() => {
    const styles = {
      title: [
        'color: #61afef',
        'font-size: 20px',
        'font-weight: bold',
        'text-shadow: 2px 2px #282c34',
        'padding: 10px',
      ].join(';'),
      subtitle: [
        'color: #98c379',
        'font-size: 14px',
        'font-weight: bold',
      ].join(';'),
      text: [
        'color: #abb2bf',
        'font-size: 12px',
      ].join(';'),
      link: [
        'color: #61afef',
        'font-size: 12px',
        'text-decoration: underline',
      ].join(';'),
    };

    console.log('%cWelcome to CipherHacks! 🚀', styles.title);
    console.log('%c👾 You found our secret console message!', styles.subtitle);
    console.log('%cSince you\'re here, you might be interested in:', styles.text);
    console.log('%c1. Contributing to our open source code', styles.text);
    console.log('%c2. Joining our development team', styles.text);
    console.log('%c3. Finding more easter eggs...', styles.text);
    console.log('\n');
    console.log('%cGitHub: https://github.com/cipherhackz', styles.link);
    console.log('%cEmail: team@cipherhacks.tech', styles.link);
    console.log('\n');
    console.log('%cTry running %chelp()%c in the console...', styles.text, styles.subtitle, styles.text);

    // Add help function to window object
    (window as any).help = () => {
      console.log('%cAvailable Commands:', styles.subtitle);
      console.log('%c  hack()      - Try to hack the mainframe', styles.text);
      console.log('%c  matrix()    - Enter the matrix', styles.text);
      console.log('%c  coffee()    - Get virtual coffee', styles.text);
      console.log('%c  easteregg() - Find another easter egg', styles.text);
      console.log('%c  inspect()   - Run browser security analysis', styles.text);
      console.log('%c  decode()    - Decode encrypted strings', styles.text);
      console.log('\n%c🚨 Security Notice: Advanced penetration testers report unusual encrypted transmissions.', 'color: #e06c75; font-weight: bold;');
      console.log('%cRecommended tools: Terminal network commands, element inspection, cipher analysis.', styles.text);
    };

    (window as any).hack = () => {
      console.log('%cACCESS DENIED 🔒\nNice try though! Maybe try attending CipherHacks to learn real hacking skills? 😉', styles.subtitle);
    };

    (window as any).matrix = () => {
      console.log('%cLoading the Matrix...', styles.subtitle);
      setTimeout(() => {
        console.log('%c Wake up, Neo...', 'color: #98c379; font-family: monospace;');
        setTimeout(() => {
          console.log('%c The Matrix has you...', 'color: #98c379; font-family: monospace;');
          setTimeout(() => {
            console.log('%c Follow the white rabbit.', 'color: #98c379; font-family: monospace;');
            setTimeout(() => {
              console.log('%c 🐰', 'font-size: 50px;');
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    };

    (window as any).coffee = () => {
      console.log('%cHere\'s your virtual coffee! ☕\nError: Coffee not found. Please get real coffee.', styles.subtitle);
    };

    (window as any).easteregg = () => {
      console.log('%cCongratulations! You found another easter egg! 🥚\nBut wait... there\'s more! Keep exploring...', styles.subtitle);
    };

    // Obfuscated CTF function - requires reverse engineering
    const _0x1337=function(s: string): string {return s.split('').map((c: string) => String.fromCharCode(c.charCodeAt(0)^42)).join('')};
    const _0x4242='=B@2CEF<92\x0fB@2CL_';
    (window as any).inspect = () => {
      const _decoded = _0x1337(_0x4242);
      console.log('%c🔍 Browser Security Analysis Complete', styles.subtitle);
      console.log('%cYou\'ve unlocked the inspector protocol! This requires true detective work.', styles.text);
      console.log(`%c${_decoded}`, 'color: #e06c75; font-weight: bold; font-size: 14px;');
    };

    // Hidden ROT13 decoder - for the advanced challenges
    (window as any).decode = (str: string) => {
      const rot13 = (s: string) => s.replace(/[a-zA-Z]/g, (c: string) => {
        const code = c.charCodeAt(0) + 13;
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= code ? code : code - 26);
      });
      return rot13(str);
    };

    // Advanced JavaScript Features
    
    // 1. Konami Code Easter Egg
    let konamiCode = '';
    const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
    const handleKonamiCode = (e: KeyboardEvent) => {
      konamiCode += e.code;
      if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
      }
      if (konamiCode === konamiSequence) {
        console.log('%c🎮 KONAMI CODE ACTIVATED! 🎮', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
        console.log('%c🚀 Welcome to the Elite Hackers Club!', 'color: #4ecdc4; font-size: 16px;');
        console.log('%cSecret Flag: CipherHacks{K0n4m1_M4st3r_H4ck3r}', 'color: #45b7d1; font-weight: bold;');
        // Add visual effect
        document.body.style.animation = 'hue-rotate 2s infinite';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 5000);
      }
    };
    document.addEventListener('keydown', handleKonamiCode);

    // 2. Mouse Tracker with Particle Effects
    const particles: Array<{x: number, y: number, life: number, vx: number, vy: number}> = [];
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    const createParticleCanvas = () => {
      canvas = document.createElement('canvas');
      canvas.id = 'particle-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1000';
      canvas.style.opacity = '0.7';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
    };

    const addParticle = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          life: 1.0,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1
        });
      }
    };

    const updateParticles = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${(Date.now() / 10) % 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      requestAnimationFrame(updateParticles);
    };

    // 3. Advanced Console Commands
    (window as any).particles = (enable: boolean = true) => {
      if (enable && !canvas) {
        createParticleCanvas();
        updateParticles();
        
        const mouseHandler = (e: MouseEvent) => addParticle(e.clientX, e.clientY);
        document.addEventListener('mousemove', mouseHandler);
        
        console.log('%c✨ Particle effects enabled! Move your mouse around!', 'color: #ff6b6b; font-size: 14px;');
        
        (window as any).disableParticles = () => {
          document.removeEventListener('mousemove', mouseHandler);
          canvas?.remove();
          canvas = null;
          console.log('%c🚫 Particle effects disabled.', 'color: #ffa500;');
        };
      } else if (!enable && canvas) {
        (window as any).disableParticles();
      }
    };

    (window as any).glitch = () => {
      const elements = document.querySelectorAll('h1, h2, h3, p, span');
      elements.forEach((el, index) => {
        setTimeout(() => {
          const original = el.textContent;
          const glitched = original?.split('').map(char => 
            Math.random() < 0.1 ? String.fromCharCode(33 + Math.floor(Math.random() * 93)) : char
          ).join('');
          el.textContent = glitched || '';
          setTimeout(() => {
            el.textContent = original || '';
          }, 200);
        }, index * 50);
      });
      console.log('%c👾 GLITCH EFFECT ACTIVATED!', 'color: #ff0080; font-weight: bold; text-shadow: 2px 2px #00ff80;');
    };

    (window as any).rainbow = () => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes rainbow {
          0% { color: #ff0000; }
          16% { color: #ff8000; }
          33% { color: #ffff00; }
          50% { color: #00ff00; }
          66% { color: #0080ff; }
          83% { color: #8000ff; }
          100% { color: #ff0000; }
        }
        .rainbow-text { animation: rainbow 2s infinite; }
      `;
      document.head.appendChild(style);
      
      document.querySelectorAll('h1, h2, h3').forEach(el => {
        el.classList.add('rainbow-text');
      });
      
      console.log('%c🌈 RAINBOW MODE ACTIVATED!', 'background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff); -webkit-background-clip: text; color: transparent; font-weight: bold; font-size: 16px;');
      
      setTimeout(() => {
        document.querySelectorAll('.rainbow-text').forEach(el => {
          el.classList.remove('rainbow-text');
        });
        style.remove();
        console.log('%c🌈 Rainbow mode disabled.', 'color: #888;');
      }, 10000);
    };

    (window as any).cyberpunk = () => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes neon-glow {
          0%, 100% { 
            text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff;
            filter: hue-rotate(0deg);
          }
          50% { 
            text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff, 0 0 20px #ff00ff;
            filter: hue-rotate(180deg);
          }
        }
        .cyberpunk-mode {
          background: linear-gradient(45deg, #000 25%, #111 25%, #111 50%, #000 50%, #000 75%, #111 75%, #111);
          background-size: 20px 20px;
          animation: neon-glow 2s ease-in-out infinite;
        }
        .cyberpunk-mode h1, .cyberpunk-mode h2, .cyberpunk-mode h3 {
          color: #00ffff !important;
          text-shadow: 0 0 10px #00ffff;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('cyberpunk-mode');
      
      console.log('%c🤖 CYBERPUNK MODE ENGAGED! 🤖', 'color: #00ffff; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
      
      setTimeout(() => {
        document.body.classList.remove('cyberpunk-mode');
        style.remove();
        console.log('%c🤖 Cyberpunk mode disabled.', 'color: #888;');
      }, 15000);
    };

    (window as any).status = () => {
      const memUsage = (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1048576),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)
      } : 'N/A';
      
      console.log('%c🖥️  SYSTEM STATUS REPORT', 'color: #00ff00; font-weight: bold; font-size: 16px;');
      console.log('%c════════════════════════════', 'color: #00ff00;');
      console.log(`%cUser Agent: ${navigator.userAgent}`, 'color: #00ffff;');
      console.log(`%cScreen: ${window.screen.width}x${window.screen.height}`, 'color: #00ffff;');
      console.log(`%cViewport: ${window.innerWidth}x${window.innerHeight}`, 'color: #00ffff;');
      console.log(`%cMemory Usage: ${typeof memUsage === 'object' ? `${memUsage.used}MB / ${memUsage.total}MB` : memUsage}`, 'color: #00ffff;');
      console.log(`%cConnection: ${(navigator as any).connection?.effectiveType || 'Unknown'}`, 'color: #00ffff;');
      console.log(`%cOnline: ${navigator.onLine ? '✅' : '❌'}`, 'color: #00ffff;');
      console.log(`%cCookies Enabled: ${navigator.cookieEnabled ? '✅' : '❌'}`, 'color: #00ffff;');
      console.log(`%cTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`, 'color: #00ffff;');
      console.log('%c════════════════════════════', 'color: #00ff00;');
    };

    // Update help function to include new commands
    (window as any).help = () => {
      console.log('%cAvailable Commands:', styles.subtitle);
      console.log('%c  hack()         - Try to hack the mainframe', styles.text);
      console.log('%c  matrix()       - Enter the matrix', styles.text);
      console.log('%c  coffee()       - Get virtual coffee', styles.text);
      console.log('%c  easteregg()    - Find another easter egg', styles.text);
      console.log('%c  inspect()      - Run browser security analysis', styles.text);
      console.log('%c  decode()       - Decode encrypted strings', styles.text);
      console.log('\n%cVisual Effects:', 'color: #ff6b6b; font-weight: bold;');
      console.log('%c  particles()    - Enable mouse particle effects', styles.text);
      console.log('%c  glitch()       - Activate glitch effect', styles.text);
      console.log('%c  rainbow()      - Rainbow text mode', styles.text);
      console.log('%c  cyberpunk()    - Cyberpunk aesthetic mode', styles.text);
      console.log('%c  matrixRain()   - Matrix digital rain effect', styles.text);
      console.log('\n%cSystem Commands:', 'color: #4ecdc4; font-weight: bold;');
      console.log('%c  status()       - Show system information', styles.text);
      console.log('\n%cGames & Challenges:', 'color: #ffd700; font-weight: bold;');
      console.log('%c  typing_test()  - Test your typing speed', styles.text);
      console.log('\n%c🎮 Try the Konami Code: ↑↑↓↓←→←→BA', 'color: #ffa500; font-weight: bold;');
      console.log('\n%c🚨 Security Notice: Advanced penetration testers report unusual encrypted transmissions.', 'color: #e06c75; font-weight: bold;');
      console.log('%cRecommended tools: Terminal network commands, element inspection, cipher analysis.', styles.text);
    };

    // Matrix Rain Effect
    (window as any).matrixRain = () => {
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const columns = Math.floor(window.innerWidth / 20);
      
      const createMatrixChar = (x: number) => {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = x + 'px';
        char.style.top = '-20px';
        char.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(char);
        
        setTimeout(() => {
          char.remove();
        }, 3000);
      };
      
      console.log('%c🌧️ MATRIX RAIN ACTIVATED!', 'color: #00ff00; font-weight: bold; font-family: monospace;');
      
      const interval = setInterval(() => {
        for (let i = 0; i < columns; i++) {
          if (Math.random() < 0.1) {
            createMatrixChar(i * 20);
          }
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        console.log('%c🌧️ Matrix rain stopped.', 'color: #888;');
      }, 10000);
    };

    // Secret typing test challenge
    (window as any).typing_test = () => {
      const phrases = [
        'The quick brown fox jumps over the lazy dog',
        'CipherHacks is the best hackathon in San Diego',
        'Cybersecurity is not just about technology, its about people',
        'console.log("Hello, World!");',
        'SELECT * FROM hackers WHERE skill_level = "elite";'
      ];
      
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      const startTime = Date.now();
      
      console.log('%c⌨️ TYPING TEST CHALLENGE!', 'color: #ff6b6b; font-weight: bold; font-size: 16px;');
      console.log(`%cType this phrase: "${phrase}"`, 'color: #00ffff; font-size: 14px;');
      
      const checkTyping = (input: string) => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const wpm = Math.round((phrase.length / 5) / (duration / 60));
        
        if (input === phrase) {
          console.log(`%c🎉 PERFECT! Time: ${duration.toFixed(2)}s | WPM: ${wpm}`, 'color: #00ff00; font-weight: bold;');
          if (wpm > 60) {
            console.log('%c🚀 Speed Demon! You earn the title: Elite Typist', 'color: #ffd700; font-weight: bold;');
          }
        } else {
          console.log(`%c❌ Not quite right. You typed: "${input}"`, 'color: #ff6b6b;');
        }
      };
      
      (window as any).submit_typing = checkTyping;
      console.log('%cWhen done, run: submit_typing("your typed phrase here")', 'color: #ffa500;');
    };

    // Add cleanup function for event listeners
    return () => {
      document.removeEventListener('keydown', handleKonamiCode);
    };

  }, []);


  return (
    <MirageProvider
      reportEndpoint="/api/cipherhacks/report"
      protectSelectors={['[data-sensitive]', 'input[type="password"]', 'input[name*="card"]', 'input[name*="cvv"]']}
      honeypotFields
      behaviorTracking
    >
    <div className="min-h-screen bg-atom-bg">
      {/* Prominent Back to Home Button */}
      <RouterLink
        to="/"
        className="fixed top-20 left-4 sm:left-8 z-50 group"
      >
        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-atom-blue to-atom-purple text-white rounded-full shadow-2xl hover:shadow-atom-blue/50 transition-all duration-300 hover:scale-105 border-2 border-white/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-bold text-sm sm:text-base whitespace-nowrap">Back to Thank You</span>
        </div>
      </RouterLink>

      {/* Hidden CTF Indicator - Only visible to those who know to look */}
      <div 
        className="fixed bottom-0 right-0 p-1 text-xs opacity-5 hover:opacity-20 transition-opacity duration-1000 select-none pointer-events-none"
        style={{ fontSize: '8px', color: '#282c34' }}
      >
        Security Level: 🔒🔒🔒 | Flags: 3 | Status: Hidden
      </div>

      {/* Vulnerable Search Component - Intentional XSS Demo */}
      <VulnerableSearch />

      {/* Navigation */}
      <motion.nav 
         className="fixed top-0 left-0 right-0 z-50"
         initial={{ y: -100, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.5, duration: 0.3 }}
       >
         <div className={`w-full backdrop-blur-sm transition-all duration-300 ${
           scrolled ? 'bg-atom-bg bg-opacity-90 shadow-lg' : 'bg-transparent'
         }`}>
           <div className="container-custom">
             <div className="flex items-center justify-center h-12 sm:h-14 md:h-16 px-1 sm:px-2 md:px-4">
               <ul className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8">
                 {NAV_ITEMS.map((item) => {
                  const linkContent = (
                    <>
                      <motion.div
                        className={`transition-colors ${
                          item.primary ? 'text-atom-blue' : 'text-atom-fg group-hover:text-atom-blue'
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className={`${item.primary ? 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7' : 'h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5'}`} />
                      </motion.div>
                      <span className={`${scrolled ? 'opacity-100' : 'opacity-90'}`}>
                        {item.name}
                      </span>
                    </>
                  );

                  const commonClasses = `${item.className} items-center space-x-1 px-1 sm:px-2 md:px-3 py-1 rounded-lg group transition-all duration-300 ${
                    item.primary 
                      ? 'text-atom-blue font-bold text-sm sm:text-base md:text-lg' 
                      : 'text-atom-fg hover:text-atom-blue text-xs sm:text-sm md:text-base'
                  }`;

                  return (
                    <motion.li
                      key={item.name}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {'href' in item && item.href ? (
                        <RouterLink to={item.href} className={commonClasses}>
                          {linkContent}
                        </RouterLink>
                      ) : (
                        <ScrollLink
                          to={item.to!}
                          smooth={true}
                          duration={500}
                          href={`#${item.to}`}
                          className={commonClasses}
                        >
                          {linkContent}
                        </ScrollLink>
                      )}
                    </motion.li>
                  );
                })}
                 {/* Actions Dropdown Menu */}
                 <motion.li
                   className="hidden md:block relative actions-menu"
                   onMouseEnter={() => setIsActionsMenuHovered(true)}
                   onMouseLeave={() => setIsActionsMenuHovered(false)}
                 >
                   <motion.button
                     onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                     whileHover={{ y: -2 }}
                     whileTap={{ y: 0 }}
                     className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 rounded-lg text-white bg-atom-blue hover:bg-opacity-90 transition-all duration-300 text-xs md:text-sm animate-glow-blue"
                   >
                     <motion.div
                       whileHover={{ rotate: 360 }}
                       transition={{ duration: 0.5 }}
                     >
                       <RocketLaunchIcon className="h-4 w-4 md:h-5 md:w-5" />
                     </motion.div>
                     <span className="hidden lg:inline">Actions</span>
                     <motion.div
                       animate={{ rotate: (isActionsMenuOpen || isActionsMenuHovered) ? 180 : 0 }}
                       transition={{ duration: 0.3 }}
                     >
                       <ChevronDownIcon className="h-3 w-3 md:h-4 md:w-4" />
                     </motion.div>
                   </motion.button>

                   <AnimatePresence>
                     {(isActionsMenuOpen || isActionsMenuHovered) && (
                       <motion.div
                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                         className="absolute top-full right-0 mt-2 w-48 bg-atom-bg bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-atom-blue border-opacity-30 overflow-hidden z-50"
                       >
                         {NAV_ACTION_BUTTONS.map((button, index) => (
                           <motion.div
                             key={button.name}
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: index * 0.05 }}
                           >
                             {button.name === 'Register' ? (
                               <RouterLink
                                 to={button.href!}
                                 className="flex items-center space-x-3 px-4 py-3 hover:bg-atom-blue hover:bg-opacity-20 transition-all duration-200 border-b border-atom-blue border-opacity-10 last:border-b-0"
                               >
                                 <motion.div
                                   whileHover={{ rotate: 360 }}
                                   transition={{ duration: 0.5 }}
                                   className={`p-2 rounded-lg ${button.className}`}
                                 >
                                   <button.icon className="h-4 w-4 text-white" />
                                 </motion.div>
                                 <span className="text-atom-fg font-medium">{button.name}</span>
                               </RouterLink>
                             ) : button.action === 'openSchedule' ? (
                               <button
                                 onClick={() => {
                                   setIsPdfViewerOpen(true);
                                   setIsActionsMenuOpen(false);
                                 }}
                                 className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-atom-blue hover:bg-opacity-20 transition-all duration-200 border-b border-atom-blue border-opacity-10 last:border-b-0"
                               >
                                 <motion.div
                                   whileHover={{ rotate: 360 }}
                                   transition={{ duration: 0.5 }}
                                   className={`p-2 rounded-lg ${button.className}`}
                                 >
                                   <button.icon className="h-4 w-4 text-white" />
                                 </motion.div>
                                 <span className="text-atom-fg font-medium">{button.name}</span>
                               </button>
                             ) : (
                               <a
                                 href={button.href!}
                                 className="flex items-center space-x-3 px-4 py-3 hover:bg-atom-blue hover:bg-opacity-20 transition-all duration-200 border-b border-atom-blue border-opacity-10 last:border-b-0"
                               >
                                 <motion.div
                                   whileHover={{ rotate: 360 }}
                                   transition={{ duration: 0.5 }}
                                   className={`p-2 rounded-lg ${button.className}`}
                                 >
                                   <button.icon className="h-4 w-4 text-white" />
                                 </motion.div>
                                 <span className="text-atom-fg font-medium">{button.name}</span>
                               </a>
                             )}
                           </motion.div>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </motion.li>
               </ul>
             </div>
           </div>
         </div>
       </motion.nav>

      {/* Referral Program Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="fixed top-12 sm:top-14 md:top-16 left-0 right-0 z-40 bg-gradient-to-r from-atom-purple to-atom-blue bg-opacity-95 backdrop-blur-sm border-b border-atom-blue border-opacity-30"
      >
        <div className="container-custom py-2 md:py-3 px-4">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1 text-white">
              <KeyIcon className="h-4 w-4 md:h-5 md:w-5 animate-pulse flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base font-medium">
                🎁 <strong>Referral Program:</strong> Get a free <strong>YubiKey 5 NFC</strong> when you
                {' '}
                <RouterLink to="/register" className="underline hover:text-atom-green transition-colors">register</RouterLink>
                {' '}and refer <strong>3 REGISTERED friends</strong>, then
                {' '}
                <RouterLink to="/referral" className="underline hover:text-atom-green transition-colors">submit the form</RouterLink>.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center relative pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container-custom text-center z-10 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <img 
              src="/logo.svg" 
              alt="CipherHacks Logo" 
              className="h-40 sm:h-48 md:h-64 lg:h-56 xl:h-64 w-auto mx-auto"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-atom-blue mb-4 tracking-tight"
          >
            CipherHacks 2025
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl text-atom-fg mb-6"
          >
            San Diego's Premier High School Hackathon
          </motion.p>
          
          {/* Combined Date and Venue Section */}
          <div className="mb-6">
            {targetDate ? (
              <div className="space-y-6">
                {/* Date and Venue Info - Centered */}
                <div className="text-lg md:text-xl text-atom-orange font-bold text-center">
                  📅 October 10-11, 2025 @ <a 
                    href="https://maps.google.com/?q=330+Park+Blvd,+San+Diego,+CA+92101" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-atom-blue hover:text-atom-green transition-colors underline"
                  >
                    San Diego Central Library Shiley Events Suite
                  </a>
                </div>
                
                {/* Countdown */}
                <Countdown 
                  date={targetDate}
                  renderer={({ days, hours, minutes, seconds }) => (
                    <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
                      {[
                        { value: days, label: 'Days' },
                        { value: hours, label: 'Hours' },
                        { value: minutes, label: 'Minutes' },
                        { value: seconds, label: 'Seconds' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-atom-bg bg-opacity-50 p-3 md:p-4 rounded-lg"
                        >
                          <div className="text-2xl md:text-3xl xl:text-4xl font-bold font-mono text-atom-green">{item.value}</div>
                          <div className="text-xs md:text-sm text-atom-fg">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-8 xl:gap-12 space-y-4 lg:space-y-0 text-center">
                <span className="text-2xl md:text-3xl xl:text-4xl font-bold text-atom-orange text-center">📅 October 10-11, 2025</span>
                <div className="text-lg md:text-xl text-atom-fg text-center">
                  📍 <span className="text-atom-orange font-semibold">Venue:</span> <a 
                    href="https://maps.google.com/?q=330+Park+Blvd,+San+Diego,+CA+92101" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-atom-blue hover:text-atom-green transition-colors underline"
                  >
                    San Diego Central Library Shiley Events Suite
                  </a>
                </div>
              </div>
            )}
          </div>
                     <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
             <RouterLink to="/register">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-atom-purple bg-atom-purple text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-opacity-90 transition-colors animate-glow-purple"
               >
                 Register Now
               </motion.button>
             </RouterLink>
             <a href="https://cipherhacks.tech/discord" target="_blank" rel="noopener noreferrer">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-atom-blue bg-atom-blue text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-opacity-90 transition-colors animate-glow-blue"
               >
                 Join Discord
               </motion.button>
             </a>
             <RouterLink to="/volunteer">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-atom-green bg-atom-green text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-opacity-90 transition-colors animate-glow-green"
               >
                 Volunteer
               </motion.button>
             </RouterLink>
             <motion.button
               onClick={() => setIsPdfViewerOpen(true)}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="border-2 border-atom-blue text-atom-blue px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-atom-blue hover:bg-opacity-10 transition-colors"
             >
               View Schedule
             </motion.button>
             <RouterLink to="/guide">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-atom-orange bg-atom-orange text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-opacity-90 transition-colors animate-glow-orange font-semibold"
                 style={{ boxShadow: '0 0 30px rgba(209,154,102,0.8), 0 0 60px rgba(209,154,102,0.5)' }}
               >
                 Event Guide
               </motion.button>
             </RouterLink>
             <a
               href="https://cipherhacks.tech/donate"
             >
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-atom-green text-atom-green px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-lg md:text-xl hover:bg-atom-green hover:bg-opacity-10 transition-colors"
               >
                 Donate
               </motion.button>
             </a>
           </div>
        </div>
        <div className={`mt-8 w-full px-4 ${terminalState === 'closed' ? 'mb-0' : 'mb-4'}`}>
          <AnimatePresence mode="wait">
            {terminalState !== 'closed' && (
              <Terminal onStateChange={setTerminalState} />
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 bg-black bg-opacity-30">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title text-center mb-12"
          >
            What Makes CipherHacks Special
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.1 }}
                className="bg-atom-bg bg-opacity-50 p-6 rounded-lg shadow-xl border border-atom-blue border-opacity-20 hover:border-opacity-50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`${feature.color} p-3 rounded-lg bg-black bg-opacity-30`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${feature.color}`}>
                      {feature.title}
                    </h3>
                    <p className="text-atom-fg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title"
          >
            About CipherHacks
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed">
                CipherHacks is more than just a hackathon - it's a celebration of innovation, creativity, and the future of technology. 
                Join us for an unforgettable weekend of coding, learning, and building alongside fellow high school students passionate about technology.
              </p>
              <div className="space-y-4">
                {HERO_ITEMS.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-atom-green">
                    <item.icon className="h-6 w-6" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
              className="bg-black bg-opacity-50 rounded-lg p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-atom-orange mb-6">What to Expect</h3>
              <ul className="space-y-4">
                {WHAT_TO_EXPECT.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: index * 0.1 }}
                    className="flex items-center space-x-3 text-lg"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-black bg-opacity-30">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FAQ_ITEMS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-atom-bg bg-opacity-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-atom-blue border-opacity-0 hover:border-opacity-20"
              >
                <h3 className="text-xl font-bold text-atom-cyan mb-3 group-hover:text-atom-blue transition-colors">{faq.q}</h3>
                <p className="text-atom-fg leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-20">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title"
          >
            Our Amazing Sponsors
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="text-center text-xl mb-8"
          >
            We are incredibly grateful to our sponsors who make CipherHacks possible. As a Hack Club fiscally sponsored event, 
            all donations are tax-deductible through Hack Club's 501(c)(3) nonprofit status.
          </motion.p>
          <div className="divide-y divide-white/10">
            {SPONSOR_TIERS
              .filter((t) => t.tier !== 'IN-KIND')
              .map((tier) => (
                <div key={tier.tier} className="py-4 md:py-6 space-y-2 first:pt-0 last:pb-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-center gap-3 mb-1"
                  >
                    <span className="text-4xl">{tier.icon}</span>
                    <h3 className={`text-2xl font-bold ${tier.color}`}>
                      {tier.tier} Sponsors
                    </h3>
                  </motion.div>
                  <SponsorCarousel
                    key={tier.tier}
                    sponsors={tier.sponsors}
                    tier={tier.tier}
                    onSponsorClick={setSelectedSponsor}
                    isPopupOpen={selectedSponsor !== null}
                  />
                </div>
              ))}
          </div>

          <motion.p 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-atom-bright-blue mt-8"
          >
            Big shoutout to Jukebox for our <a href="https://www.jukeboxprint.com/custom-stickers" target="_blank" rel="noopener noreferrer" className="underline hover:text-atom-pink">custom stickers</a> at the Hackathon!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="mt-8 text-center"
          >
            <RouterLink 
              to="/sponsor"
              className="inline-flex items-center px-8 py-3 bg-atom-purple text-white rounded-lg text-xl hover:bg-opacity-90 transition-colors group"
            >
              <HeartIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Become a Sponsor
            </RouterLink>
          </motion.div>
        </div>
      </section>

      {/* Donators Section */}
      <section id="donators" className="py-20 bg-black bg-opacity-30">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title"
          >
            Our Generous Donators
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="text-center text-xl mb-8"
          >
            Thank you to everyone who has donated to make CipherHacks possible! 
            All donations are tax-deductible through Hack Club's 501(c)(3) nonprofit status.
          </motion.p>

          {DONATORS.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {DONATORS.map((donator, index) => (
                <motion.div
                  key={`${donator.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="bg-atom-bg bg-opacity-50 p-6 rounded-lg shadow-lg border border-atom-green border-opacity-20 hover:border-opacity-50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-atom-green">
                        {donator.isAnonymous ? "Anonymous Donor" : donator.name}
                      </h3>
                      {donator.date && (
                        <p className="text-sm text-atom-fg-muted mt-1">{donator.date}</p>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-atom-cyan">
                      ${donator.amount}
                    </div>
                  </div>
                  {donator.message && (
                    <p className="text-atom-fg italic border-l-2 border-atom-green pl-3 mt-3">
                      "{donator.message}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-8"
            >
              <p className="text-atom-fg-muted text-lg mb-4">
                Be the first to donate and support CipherHacks!
              </p>
            </motion.div>
          )}

          {/* Financial Transparency Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="mt-8 bg-black bg-opacity-50 rounded-lg p-6 border border-atom-blue border-opacity-30"
          >
            <h3 className="text-2xl font-bold text-atom-cyan mb-4 text-center">
              💎 Financial Transparency
            </h3>
            <p className="text-atom-fg text-center mb-4">
              We believe in complete transparency. View our real-time financial transactions and ledger on Hack Club Bank (HCB).
            </p>
            <div className="flex justify-center">
              <a
                href={HCB_TRANSPARENCY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-atom-cyan text-white rounded-lg text-lg hover:bg-opacity-90 transition-colors group"
              >
                <GlobeAltIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                View Full Transparency Page
              </a>
            </div>
          </motion.div>

          {/* Donate CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="mt-8 text-center"
          >
            <a 
              href="https://cipherhacks.tech/donate"
              className="inline-flex items-center px-8 py-3 bg-atom-green text-white rounded-lg text-xl hover:bg-opacity-90 transition-colors group"
            >
              <HeartIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Make a Donation
            </a>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="pt-12 pb-20">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title text-center"
          >
            Meet Our Founding Team
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="text-center text-xl mb-12"
          >
            The passionate students behind CipherHacks
          </motion.p>
          {/* Founder Section - Separate Row */}
          <div className="flex justify-center mb-12">
            {TEAM_MEMBERS.filter(member => member.role.includes('Founder')).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.1 }}
                className="bg-black bg-opacity-20 rounded-xl p-6 backdrop-blur-sm border border-atom-blue border-opacity-20 hover:border-opacity-50 transition-all duration-300 max-w-sm w-full"
              >
                <div className="text-center mb-4">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-atom-blue shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-atom-bg flex items-center justify-center border-2 border-atom-blue shadow-lg">
                      {getDefaultIcon(member.gender)}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-atom-blue">{member.name}</h3>
                  <p className="text-atom-purple font-mono">{member.role}</p>
                </div>
                <p className="text-atom-fg text-sm mb-4 text-center">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-4">
                  {Object.entries(member.links).map(([key, value]) => {
                    if (!value) return null;

                    let icon;
                    switch (key) {
                      case 'website':
                        icon = <GlobeAltIcon className="h-5 w-5" />;
                        break;
                      case 'github':
                        icon = <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
                        break;
                      case 'linkedin':
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>;
                        break;
                      case 'email':
                        icon = <EnvelopeIcon className="h-5 w-5" />;
                        break;
                      default:
                        icon = <GlobeAltIcon className="h-5 w-5" />;
                    }

                    const linkHref = key === 'email' ? `mailto:${value}` : value;

                    return (
                      <a
                        key={key}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                        className="text-atom-fg hover:text-atom-blue transition-colors"
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Directors Section - Grid Layout */}
          <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
            {TEAM_MEMBERS.filter(member => !member.role.includes('Founder')).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.1 }}
                className="bg-black bg-opacity-20 rounded-xl p-6 backdrop-blur-sm border border-atom-blue border-opacity-20 hover:border-opacity-50 transition-all duration-300 max-w-sm w-full"
              >
                <div className="text-center mb-4">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-atom-blue shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-atom-bg flex items-center justify-center border-2 border-atom-blue shadow-lg">
                      {getDefaultIcon(member.gender)}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-atom-blue">{member.name}</h3>
                  <p className="text-atom-purple font-mono">{member.role}</p>
                </div>
                <p className="text-atom-fg text-sm mb-4 text-center">
                  {member.description}
                </p>
                <div className="flex justify-center space-x-4">
                  {Object.entries(member.links).map(([key, value]) => {
                    if (!value) return null;

                    let icon;
                    switch (key) {
                      case 'website':
                        icon = <GlobeAltIcon className="h-5 w-5" />;
                        break;
                      case 'github':
                        icon = <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
                        break;
                      case 'linkedin':
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>;
                        break;
                      case 'email':
                        icon = <EnvelopeIcon className="h-5 w-5" />;
                        break;
                      default:
                        icon = <GlobeAltIcon className="h-5 w-5" />;
                    }

                    const linkHref = key === 'email' ? `mailto:${value}` : value;

                    return (
                      <a
                        key={key}
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                        className="text-atom-fg hover:text-atom-blue transition-colors"
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Roles Information Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-atom-fg-muted mb-4">
              Want to learn more about all event roles and positions?
            </p>
            <RouterLink
              to="/roles"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-atom-purple bg-opacity-20 border-2 border-atom-purple text-atom-purple rounded-lg hover:bg-atom-purple hover:text-white transition-all duration-300 font-semibold"
            >
              <span>View All Event Roles & Hierarchy</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </RouterLink>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="section-title"
          >
            Get in Touch
          </motion.h2>
          <div className="text-center space-y-8">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl"
            >
              Have questions? We'd love to hear from you!
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto bg-atom-bg bg-opacity-50 p-8 rounded-lg shadow-xl"
            >
              <p className="text-xl mb-6">
                Reach out to us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-atom-blue hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <div className="flex justify-center space-x-8">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.name === "Instagram" ? InstagramIcon : social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      aria-label={social.name}
                      className="text-atom-fg hover:text-atom-blue transition-colors"
                    >
                      <Icon className="h-8 w-8" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <footer className="py-8 bg-black bg-opacity-30">
        <div className="container-custom text-center text-atom-fg">
          <div className="flex justify-center space-x-6 mb-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.name === "Instagram" ? InstagramIcon : social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  aria-label={social.name}
                  className="text-atom-fg hover:text-atom-blue transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </motion.a>
              );
            })}
          </div>
          <div className="mb-4">
            <RouterLink to="/privacy" className="text-sm hover:text-atom-blue hover:underline transition-colors">
              Privacy Policy
            </RouterLink>
          </div>
          <div className="flex justify-center space-x-6 my-4">
            <RouterLink to="/rules" className="text-sm text-atom-fg-muted hover:text-atom-blue transition-colors">Rules & Policy</RouterLink>
            <RouterLink to="/conduct" className="text-sm text-atom-fg-muted hover:text-atom-blue transition-colors">Code of Conduct</RouterLink>
          </div>
          <p className="text-sm text-atom-fg-muted max-w-2xl mx-auto">
            CipherHacks is a student-led event. CipherHacks is a fiscally sponsored event under Hack Club, a 501(c)(3) nonprofit organization.
          </p>
        </div>
      </footer>

      {/* Sponsor Popup */}
      <AnimatePresence>
        {isPdfViewerOpen && <PdfViewer onClose={() => setIsPdfViewerOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSponsor && (
          <SponsorPopup sponsor={selectedSponsor} onClose={() => setSelectedSponsor(null)} />
        )}
      </AnimatePresence>

      {/* FAQ Popup */}
      <FaqPopup 
        isVisible={isFaqPopupVisible} 
        onDismiss={handleFaqPopupDismiss} 
      />

      <Footer />
    </div>
    </MirageProvider>
  );
};

export default App;
