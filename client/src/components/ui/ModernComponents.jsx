import React from 'react';
import { GradientText, AnimatedButton } from './ui/AnimationComponents';
import { HeroSection, FeatureCard, StatsCounter } from './ui/AnimatedSections';

/**
 * Modern Navbar with animations
 */
export const ModernNavbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect backdrop-blur-md shadow-lg' 
          : 'transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <GradientText text="Edemy" animated />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {['Home', 'Courses', 'Educators', 'Contact'].map((item, idx) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 animate-fadeInRight"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <AnimatedButton variant="primary" size="md" className="hidden md:block animate-fadeInRight">
          Sign Up
        </AnimatedButton>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-effect p-4 space-y-4 animate-slideDown">
          {['Home', 'Courses', 'Educators', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <AnimatedButton variant="primary" size="sm" className="w-full">
            Sign Up
          </AnimatedButton>
        </div>
      )}
    </nav>
  );
};

/**
 * Modern Footer with animations
 */
export const ModernFooter = () => {
  const sections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'Enterprise'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact', 'Status', 'Community'],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fadeInUp">
            <div className="text-2xl font-bold mb-4">
              <span className="text-gradient">Edemy</span>
            </div>
            <p className="text-gray-400">
              Transforming education through modern technology
            </p>
          </div>

          {/* Links */}
          {sections.map((section, idx) => (
            <div key={section.title} className="animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
              <h4 className="font-bold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#"
                      className="text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social Links */}
          <div className="flex justify-between items-center">
            <p className="text-gray-400">© 2024 Edemy. All rights reserved.</p>
            <div className="flex gap-4">
              {['Twitter', 'Facebook', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors hover-glow"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Course Card with hover animations
 */
export const CourseCard = ({
  id,
  image,
  title,
  instructor,
  rating,
  students,
  price,
  delay = 0,
}) => {
  return (
    <div 
      className="glass-effect rounded-2xl overflow-hidden hover-lift animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden group">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{instructor}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({students})</span>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gradient">${price}</span>
          <AnimatedButton variant="primary" size="sm">
            Enroll
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

/**
 * Student Profile Card
 */
export const StudentProfileCard = ({
  name,
  avatar,
  bio,
  level,
  coursesCompleted,
}) => {
  return (
    <div className="glass-effect rounded-2xl p-6 hover-lift text-center">
      {/* Avatar */}
      <img 
        src={avatar} 
        alt={name}
        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
      />

      {/* Info */}
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-gray-600 mb-3">{bio}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <p className="text-2xl font-bold text-indigo-600">{level}</p>
          <p className="text-xs text-gray-600">Level</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{coursesCompleted}</p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
      </div>

      <AnimatedButton variant="outline" size="sm" className="w-full">
        View Profile
      </AnimatedButton>
    </div>
  );
};

/**
 * Notification Toast with animation
 */
export const AnimatedNotification = ({
  message,
  type = 'success',
  onClose,
}) => {
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${typeClasses[type]} text-white px-6 py-4 rounded-lg shadow-lg animate-slideUp`}>
      {message}
    </div>
  );
};

/**
 * Empty State with animation
 */
export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeInUp">
      <div className="text-6xl mb-4 animate-float">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && (
        <AnimatedButton variant="primary" onClick={onAction}>
          {actionText}
        </AnimatedButton>
      )}
    </div>
  );
};

/**
 * Modal with backdrop animation
 */
export const AnimatedModal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-effect rounded-2xl max-w-md w-full p-6 animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {children}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {actions?.map((action) => (
            <AnimatedButton
              key={action.label}
              variant={action.variant || 'secondary'}
              size="md"
              onClick={action.onClick}
              className="flex-1"
            >
              {action.label}
            </AnimatedButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  ModernNavbar,
  ModernFooter,
  CourseCard,
  StudentProfileCard,
  AnimatedNotification,
  EmptyState,
  AnimatedModal,
};
