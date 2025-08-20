import React, { useContext, useEffect, useState } from 'react'
import SearchBar from '../../components/student/SearchBar'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const CourseList = () => {

      
      
  const {navigate} = useContext(AppContext);
  const { allCourses  } = useContext(AppContext);
  const {input} = useParams();
  const [filteredCourse, setFilteredCourse] = useState([])
  
//search functionality for the course

  useEffect(()=>{
    if(allCourses && allCourses.length >0){
      const tempCourse = allCourses.slice()

      input ? 
      setFilteredCourse(
        tempCourse.filter(
          course => course.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      )
      :
      setFilteredCourse(tempCourse)


    }

  },[allCourses,input])

  return (
    <>
   <div className="bg-white py-8 px-4 md:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:gap-100 gap-12 ">
        
        {/* Left Side: Title and Breadcrumbs */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Course List
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <a href="#" onClick={() => navigate('/')} className="text-blue-600 hover:underline">Home</a>
            <span className="mx-2">/</span>
            <span>Course List</span>
          </p>
        </div>
        
        {/* Right Side: Search Bar */}
        {/* This will now work perfectly */}
        <div>
        <SearchBar data={input} className="w-full md:w-1/2" />
        </div>
      
      </div>
      {
        input && <div className='inline-flex items-center gap-4 px-4 py-2 border   mt-15 ml-8 text-gray-600'>
          <p>{input}</p>
          <img src={assets.cross_icon} alt="cross-icon"  className="cursor-pointer"  onClick={()=>{navigate('/course-list')}} />
        </div>
      }
       <div className='grid grid-cols-1 sm:grid-cols-2  sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 my-10 md:my-16'>
        {filteredCourse.map((course, index) => (
          <CourseCard key={index} Course={course} />
        ))}
       </div>
    </div>
    <Footer/>
    </>
  )
}

export default CourseList