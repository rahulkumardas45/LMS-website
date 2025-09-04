import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCourses = () => {

  const  {currency , backendUrl, isEducator, getToken } = useContext(AppContext)
  const [courses , setCourses] = useState(null)
  // const [isLive, setIsLive ] = useState(false)

 const fetchEducatorCourses = async ()=>{
    
  try {
    const token = await getToken()
    const {data} = await axios.get(backendUrl + '/api/educator/educator-course', { headers: {Authorization: `Bearer ${token}`}} )

    data.success && setCourses(data.courses)
    
  } catch (error) {
    toast.error(error.message)
    
  }

 }


useEffect(()=>{
  if(isEducator){
    fetchEducatorCourses()
  }
},[isEducator])


  return  courses ?(
   <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="border-b-4 border-blue-500 pb-2">My Courses</span>
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-4 bg-gray-50 border-b">
            <div className="col-span-6 text-sm font-semibold text-gray-600">All Courses</div>
            <div className="col-span-2 text-sm font-semibold text-gray-600 text-center">Earnings</div>
            <div className="col-span-2 text-sm font-semibold text-gray-600 text-center">Students</div>
             <div className="col-span-2 text-sm font-semibold text-gray-600 text-center">On Published</div>
           
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                
                {/* Course Title and Image */}
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                  <img 
                    src={course.courseThumbnail} 
                    alt={course.courseTitle} 
                    className="w-24 h-14 rounded-lg object-cover hidden sm:block"
                  />
                  <span className="font-medium text-gray-900">{course.courseTitle}</span>
                </div>
                <div className="col-span-1 md:col-span-2 text-left md:text-center">
                  <span className="md:hidden font-semibold text-gray-600">Earnings: </span>
                  <span className="text-gray-700">{currency}
  {Math.floor(
    course.enrolledStudents.length *
      (course.coursePrice - (course.discount * course.coursePrice) / 100)
  )}</span>
                </div>

  {/* Students */}
                <div className="col-span-1 md:col-span-2 text-left md:text-center">
                   <span className="md:hidden font-semibold text-gray-600">Students: </span>
                   <span className="text-gray-700">{course.enrolledStudents.length}</span>
                </div>


                 <div className="col-span-1 md:col-span-2 text-left md:text-center">
                   <span className="md:hidden font-semibold text-gray-600">Created At: </span>
                   <span className="text-gray-700">{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>

              

                {/* Course Status */}
                {/* <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                   <StatusToggle isLive={course.isLive} />
                </div> */}
    
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : <Loading/>
}

export default MyCourses