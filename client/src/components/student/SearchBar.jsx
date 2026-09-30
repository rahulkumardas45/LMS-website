import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const SearchBar = ({data}) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) {
      navigate('/course-list/' + encodeURIComponent(input.trim()))
    } else {
      navigate('/course-list')
    }
  }

  return (
     <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto px-4 sm:px-0">
      <div className="flex items-center w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        
        {/* Search Icon */}
        <div className="pl-4 pr-2  sm:pl-5 sm:pr-3">
          <img src={assets.search_icon} alt="search_icon" />
        </div>
        
        {/* Input Field */}
        <input onChange={(e) => setInput(e.target.value)} value={input}
          type="text"
          placeholder="Search for courses"
          className="w-full py-3 sm:py-4 text-sm sm:text-base text-gray-700 focus:outline-none"
        />
        
        {/* Search Button */}
        <button onClick={handleSearch} className="bg-blue-600 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base hover:bg-blue-700 transition-colors duration-300 cursor-pointer">
          Search
        </button>
        
      </div>
    </form>
  )
}

export default SearchBar