import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
     <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto text-center px-4">
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Learn anything, anytime, anywhere
        </h1>
        
        {/* Subheading */}
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
        </p>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Get started
          </button>
          
          <a href="#" className="flex items-center text-gray-800 font-semibold hover:text-blue-600 transition duration-300">
            Learn more
            <img src={assets.arrow_icon} alt="arrow_icon" />
          </a>
        </div>
        
      </div>
    </section>
  )
}

export default CallToAction