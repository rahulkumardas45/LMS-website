import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CourseSection = () => {

  const { allCourses  } = useContext(AppContext);

  return (
    <div className="text-center py-12 md:py-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Learn from the best
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
      </p>
       <div className='grid grid-cols-1 sm:grid-cols-2  sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 my-10 md:my-16'>
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} Course={course} />
        ))}
       </div>


    <Link to="/course-list" onClick={() => window.scrollTo(0, 0)} className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
      Show All Courses
    </Link>
    </div>

  )
}

export default CourseSection