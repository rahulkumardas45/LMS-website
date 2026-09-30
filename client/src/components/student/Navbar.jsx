import React, { useContext, useState } from 'react';

import { assets } from '../../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  // Function to handle the logo click
  const isCourseListPage = location.pathname.includes('/course-list');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)
  // const navigate = useNavigate();

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)

    }
  }

  return (
    <header className={`relative flex items-center justify-between bg-[#eaf8ff] py-3 px-10 font-sans border-b border-gray-200 ${isCourseListPage ? 'bg-white' : 'bg-[#eaf8ff]'}`}>
      {/* Logo Section */}
      <div className="flex items-center gap-2.5 cursor-pointer">
        <img onClick={() => navigate('/')} src={assets.logo} alt="logo" />
      </div>

      {/* Navigation & Actions Section */}
      <nav className="flex items-center gap-4">
        {user ? (
          // --- View for LOGGED-IN users ---
          <>
            {/* Desktop Links: Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#courses"
                className="text-base font-medium text-gray-600 no-underline transition-colors duration-200 hover:text-blue-600"
                onClick={becomeEducator}
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </a>

              <span className="text-gray-300 text-lg">|</span>

              <a
                href="#login"
                className="text-base font-medium text-gray-600 no-underline transition-colors duration-200 hover:text-blue-600"
                onClick={() => navigate('/my-enrollments')}
              >
                My Enrollments
              </a>
            </div>

            {/* UserButton: Always visible for logged-in users */}
            <UserButton />

            {/* Mobile Menu Button (Hamburger): Visible only on mobile */}
            <button onClick={() => setMenuOpen(!isMenuOpen)} className="block md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </>
        ) : (
          // --- View for LOGGED-OUT users ---
          <>
            {/* Desktop Button: Hidden on mobile */}
            <button
              onClick={() => openSignIn()}
              className="hidden md:block cursor-pointer rounded-full bg-blue-500 py-3 px-6 text-base font-bold text-white transition-colors duration-200 hover:bg-blue-600"
            >
              Create Account
            </button>

            {/* Mobile Icon: Visible only on mobile */}
            <button onClick={() => openSignIn()} className="block md:hidden">
              <img src={assets.user_icon} alt="user icon" className="h-8 w-8" />
            </button>
          </>
        )}
      </nav>

      {/* --- Mobile Menu Dropdown --- */}
      {isMenuOpen && user && (
        <div className="absolute top-full right-4 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 md:hidden">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                becomeEducator();
              }}
            >
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <button
              className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                navigate('/my-enrollments');
              }}
            >
              My Enrollments
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;