import React from 'react';

/**
 * GlassCard - Glassmorphic Card Component
 */
export const GlassCard = ({ 
  children, 
  variant = 'md', 
  hoverEffect = 'lift',
  className = '' 
}) => {
  const variantClasses = {
    sm: 'glass-effect-sm p-3 rounded-lg',
    md: 'glass-effect p-6 rounded-xl',
    lg: 'glass-effect-lg p-8 rounded-2xl',
  };

  return (
    <div className={`${variantClasses[variant]} hover-${hoverEffect} ${className}`}>
      {children}
    </div>
  );
};

/**
 * AnimatedButton - Modern Button Component
 */
export const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-glow',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg font-semibold
        transition-all duration-300
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        animate-fadeIn
        ${className}
      `}
    >
      {loading && <LoadingSpinner variant="dot" size="sm" />}
      {children}
    </button>
  );
};

/**
 * AnimatedText - Character Animation Component
 */
export const AnimatedText = ({
  text,
  animation = 'typewriter',
  delay = 50,
}) => {
  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    if (animation === 'typewriter') {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, delay);
      return () => clearInterval(interval);
    }
  }, [text, delay, animation]);

  if (animation === 'typewriter') {
    return <span>{displayedText}</span>;
  }

  if (animation === 'fade') {
    return <span className="animate-fadeInUp">{text}</span>;
  }

  if (animation === 'bounce') {
    return (
      <span className="inline-flex gap-1">
        {text.split('').map((char, idx) => (
          <span
            key={idx}
            className="animate-bounce"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
    );
  }

  return <span>{text}</span>;
};

/**
 * GradientText - Animated Gradient Text
 */
export const GradientText = ({
  text,
  animated = false,
  variant = 'primary',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
    success: 'bg-gradient-to-r from-green-600 to-teal-600',
    warm: 'bg-gradient-to-r from-yellow-600 to-red-600',
  };

  return (
    <span
      className={`
        ${variantClasses[variant]}
        bg-clip-text text-transparent
        ${animated ? 'animate-gradient-shift bg-200%' : ''}
      `}
    >
      {text}
    </span>
  );
};

/**
 * FloatingElement - Floating Animation Wrapper
 */
export const FloatingElement = ({
  children,
  animation = 'float',
  delay = 0,
}) => {
  return (
    <div
      className={`animate-${animation}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * LoadingSpinner - Loading States
 */
export const LoadingSpinner = ({
  variant = 'ring',
  size = 'md',
  color = 'indigo',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    purple: 'border-purple-600',
    pink: 'border-pink-600',
    green: 'border-green-600',
  };

  if (variant === 'ring') {
    return (
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div
          className={`w-full h-full border-4 ${colorClasses[color]} border-t-transparent rounded-full`}
        />
      </div>
    );
  }

  if (variant === 'dot') {
    return (
      <div className={`${sizeClasses[size]} flex gap-1 items-center justify-center`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1 h-1 ${colorClasses[color]} rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`${sizeClasses[size]} flex gap-1 items-end justify-center`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1 ${colorClasses[color]} rounded-full animate-pulse`}
            style={{
              height: ['40%', '60%', '40%'][i],
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <div
          className={`${colorClasses[color]} rounded-full animate-bounce`}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  return null;
};

/**
 * BadgeAnimated - Glowing Badge Component
 */
export const BadgeAnimated = ({
  text,
  variant = 'primary',
  animated = true,
}) => {
  const variantClasses = {
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`
        ${variantClasses[variant]}
        px-3 py-1 rounded-full text-sm font-semibold
        ${animated ? 'animate-glow shadow-glow' : ''}
      `}
    >
      {text}
    </span>
  );
};

/**
 * Tooltip - Animated Tooltip Component
 */
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`
            absolute ${positionClasses[position]}
            glass-effect px-3 py-2 rounded-lg text-sm whitespace-nowrap
            animate-fadeInUp pointer-events-none z-50
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

/**
 * ProgressRing - Circular Progress Indicator
 */
export const ProgressRing = ({
  percentage = 65,
  size = 'md',
  strokeWidth = 4,
  color = 'indigo',
}) => {
  const sizeMap = { sm: 80, md: 120, lg: 160 };
  const radius = (sizeMap[size] - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    indigo: 'stroke-indigo-600',
    purple: 'stroke-purple-600',
    pink: 'stroke-pink-600',
    green: 'stroke-green-600',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={sizeMap[size]} height={sizeMap[size]}>
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          fill="none"
          className={`${colorClasses[color]} transition-all duration-1000`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
    </div>
  );
};

/**
 * ScrollReveal - Reveals content on scroll
 */
export const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={isVisible ? 'animate-fadeInUp' : 'opacity-0'}>
      {children}
    </div>
  );
};

export default {
  GlassCard,
  AnimatedButton,
  AnimatedText,
  GradientText,
  FloatingElement,
  LoadingSpinner,
  BadgeAnimated,
  Tooltip,
  ProgressRing,
  ScrollReveal,
};
