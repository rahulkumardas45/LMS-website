import React from 'react'
import { assets } from '../../assets/assets';

const Footer = () => {

     const socialLinks = [
    { href: 'https://facebook.com', src: assets.facebook_icon, alt: 'Facebook' },
    { href: 'https://twitter.com', src: assets.twitter_icon, alt: 'Twitter' },
    { href: 'https://instagram.com', src: assets.instagram_icon, alt: 'instagram_icon' },
  ];
  return (
     <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-6 md:px-8 flex items-center justify-between">
        
        {/* Left Section: Logo and Copyright */}
        <div className="flex items-center gap-4">
          <img src={assets.logo} alt="Edemy Logo" className="h-8" />
          <p className="text-sm text-gray-600">
            All rights reserved. Copyright @Edemy
          </p>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.alt}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <img src={link.src} alt={link.alt} className="h-4 w-4" />
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}

export default Footer