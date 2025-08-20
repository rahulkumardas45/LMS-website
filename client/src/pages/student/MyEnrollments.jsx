import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {Line} from 'rc-progress'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {

 const {enrolledCourses,
      fetchUserEnrolledCourses,calculateCourseDuration,navigate} = useContext(AppContext)

      const [progressArray, setProgressArray] = useState(
        [
    {lectureCompleted: 2, totalLectures: 4},
    {lectureCompleted: 1, totalLectures: 5},
    {lectureCompleted: 3, totalLectures: 6},
    {lectureCompleted: 4, totalLectures: 4},
    {lectureCompleted: 0, totalLectures: 3},
    {lectureCompleted: 5, totalLectures: 7},
    {lectureCompleted: 6, totalLectures: 8},
    {lectureCompleted: 2, totalLectures: 6},
    {lectureCompleted: 4, totalLectures: 10},
    {lectureCompleted: 3, totalLectures: 5},
    {lectureCompleted: 7, totalLectures: 7},
    {lectureCompleted: 1, totalLectures: 4},
    {lectureCompleted: 0, totalLectures: 2},
    {lectureCompleted: 5, totalLectures: 5}
]
      )

  return (
    <>
    <div className='md:px-36 px-8 pt-10 mb-0'>
  <h1 className='text-2xl font-semibold'>My Enrollments</h1>
  <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
    <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
      <tr>
        <th className='px-4 py-3 font-semibold truncate'>Course</th>
        <th className='px-4 py-3 font-semibold truncate'>Duration</th>
        <th className='px-4 py-3 font-semibold truncate'>Completed</th>
        <th className='px-4 py-3 font-semibold truncate'>Status</th>
      </tr>
    </thead>
    <tbody className='divide-y divide-gray-200 bg-white'>
  {
    enrolledCourses.map((course, index) => (
      <tr key={index} className="max-sm:block max-sm:border-b max-sm:py-4 max-sm:px-2">

        {/* Course Name Cell */}
        <td className="px-4 py-3 whitespace-nowrap max-sm:block">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src={course.courseThumbnail} 
                alt={'course.courseThumbnail'} 
                className='w-28 h-16 object-cover rounded-md' 
              />
            </div>
            <div className="ml-4">
              <p className='text-sm font-semibold text-gray-900'>{course.courseTitle}</p>
              <Line strokeWidth={4} percent={progressArray[index] ? (progressArray[index].lectureCompleted *100)/progressArray[index].totalLectures : 0} className='bg-gray-300 rounded-full'/>
            </div>
          </div>
        </td>

        {/* Duration Cell */}
        <td data-label="Duration" className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 max-sm:block max-sm:before:content-[attr(data-label)':_'] max-sm:before:font-semibold max-sm:before:text-gray-800">
          {calculateCourseDuration(course)}
        </td>

        {/* Completed Cell */}
        <td data-label="Completed" className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 max-sm:block max-sm:before:content-[attr(data-label)':_'] max-sm:before:font-semibold max-sm:before:text-gray-800">
          <p>{progressArray[index] && `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`}<span className="text-gray-500">Lectures</span></p>
        </td>

        {/* Status Cell */}
        <td data-label="Status" className="px-4 py-3 whitespace-nowrap max-sm:block max-sm:before:content-[attr(data-label)':_'] max-sm:before:font-semibold max-sm:before:text-gray-800">
          <button onClick={()=>navigate('/player/' + course._id)}   className='inline-flex items-center px-5 py-3  rounded text-xs font-medium bg-blue-500 text-white-800 cursor-pointer'>
            {progressArray[index] && progressArray[index].lectureCompleted/progressArray[index].totalLectures==1 ? 'Completed' : 'On Going' }
          </button>
        </td>
        
      </tr>
    ))
  }
</tbody>
  </table>
    </div>

    <Footer/>
    </>
    
  )
}

export default MyEnrollments