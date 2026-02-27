import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1: Logo and Description */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center text-white text-2xl font-bold mb-4">
              <img src={assets.logo_dark} alt="logo" />
            </a>
            <p className="max-w-xs">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Contact us</a></li>
              <li><a href="#" className="hover:text-white">Privacy policy</a></li>
            </ul>
          </div>

          {/* Column 3: Newsletter Subscription */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Subscribe to our newsletter</h3>
            <p className="mb-4">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-r-md hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p>Copyright 2026 © Edemy. All Right Reserved.</p>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer