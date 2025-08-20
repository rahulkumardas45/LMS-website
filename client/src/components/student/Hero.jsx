import React from 'react'
import SearchBar from './SearchBar';

const SearchIcon = () => (
  <svg 
    className="w-5 h-5 text-gray-400" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    ></path>
  </svg>
);



const Hero = () => {

const sketchyUnderline = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12'%3e%3cpath d='M5 7c33.333-3.333 66.667-3.333 100 0 33.333 3.333 66.667 3.333 100 0' stroke='%233b82f6' stroke-width='4' fill='none' stroke-linecap='round'/%3e%3c/svg%3e")`;

  return ( 
     <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#eaf8ff] to-white font-sans px-4 py-8">
      <div className="text-center max-w-4xl mx-auto">

        {/* Main Heading */}
        <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight">
          Empower your future with the courses designed to{' '}
          <span className="text-blue-600">
            fit your choice.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          We bring together world-class instructors, interactive content, and a supportive
          community to help you achieve your personal and professional goals.
        </p>

        {/* Search Bar */}
        <SearchBar />

      </div>
    </div>
   
  )
}

export default Hero