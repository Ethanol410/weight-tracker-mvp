// Animation variants for Framer Motion-like animations using CSS
export const fadeInUp = {
  initial: 'opacity-0 translate-y-4',
  animate: 'opacity-100 translate-y-0',
  transition: 'transition-all duration-300 ease-out'
}

export const fadeIn = {
  initial: 'opacity-0',
  animate: 'opacity-100',
  transition: 'transition-opacity duration-200'
}

export const slideInRight = {
  initial: 'opacity-0 translate-x-4',
  animate: 'opacity-100 translate-x-0',
  transition: 'transition-all duration-200 ease-out'
}

export const scaleIn = {
  initial: 'opacity-0 scale-95',
  animate: 'opacity-100 scale-100',
  transition: 'transition-all duration-150 ease-out'
}

// Utility function to apply staggered animations
export function staggerChildren(items: Record<string, unknown>[], delay: number = 0.1) {
  return items.map((item, index) => ({
    ...item,
    style: {
      animationDelay: `${index * delay}s`,
      ...(typeof item.style === 'object' && item.style !== null ? item.style : {})
    }
  }))
}

// CSS classes for common animations
export const animationClasses = {
  // Hover effects
  hoverScale: 'transform transition-transform duration-200 hover:scale-105',
  hoverLift: 'transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  hoverGrow: 'transform transition-transform duration-150 hover:scale-110',
  
  // Loading effects
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Entrance animations
  slideUp: 'transform translate-y-4 opacity-0 animate-[slideUp_0.3s_ease-out_forwards]',
  slideDown: 'transform -translate-y-4 opacity-0 animate-[slideDown_0.3s_ease-out_forwards]',
  slideLeft: 'transform translate-x-4 opacity-0 animate-[slideLeft_0.3s_ease-out_forwards]',
  slideRight: 'transform -translate-x-4 opacity-0 animate-[slideRight_0.3s_ease-out_forwards]',
  fadeIn: 'opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]',
  fadeInUp: 'animate-fade-in-up',
  slideInRight: 'animate-slide-in-right',
  
  // Error animations
  shake: 'animate-shake',
  
  // Focus states
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  focusWithin: 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
  
  // Interactive states
  clickable: 'cursor-pointer select-none',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-75 pointer-events-none',
}

// Custom keyframes to add to your CSS
export const customKeyframes = `
@keyframes slideUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideLeft {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideRight {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
  background-size: 200px;
  animation: shimmer 1.5s infinite;
}
`
