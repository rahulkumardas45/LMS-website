import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import CourseCard from '../../components/student/CourseCard';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import axios from 'axios';
import { toast } from 'react-toastify';


const CourseDetail = () => {

  const {id} = useParams()

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnroll, setIsAlreadyEnroll] = useState(false)
  const [playData, setPlayData] = useState(null)

  const {allCourses,calculateRating,calculateChapterTime,
      calculateCourseDuration,
      calculateTotalLecture,currency , backendUrl, userData , getToken } = useContext(AppContext)

  const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/course/' + id)
       if(data.success){
          setCourseData(data.courseData)
       }else{
        toast.error(data.message)
       }

      } catch (error) {
        toast.error(error.message)
      }

  }


  const enrollCourse = async ()=>{
    try {
      if(!userData){
        return toast.warn('Login to Enroll')
      }

      if(isAlreadyEnroll){
        return toast.warn('Already Enrolled')
      }
      
      const token = await getToken();

      const { data } = await axios.post(backendUrl + '/api/user/purchase', { courseId: courseData._id}, {headers: {Authorization : `Bearer ${token}`} })
      
      if(data.success){
        const { session_url } = data
        window.location.replace(session_url)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      
    }
       

  }


  const toggleSection = (index)=>{
    setOpenSection((prev)=> ({
     ...prev, 
     [index]: !prev[index]
    }))
  }

  useEffect(()=>{
    fetchCourseData()
  },[])

  useEffect(()=>{
     if( userData && courseData && userData.enrolledCourses){
      setIsAlreadyEnroll(userData.enrolledCourses.some(c => (c._id || c).toString() === courseData._id.toString()))
     }
  },[ userData, courseData])


  return courseData ? (
    <>
   <div className='flex items-start justify-center min-h-screen bg-gradient-to-b from-[#eaf8ff] to-white font-sans px-4 py-8'>
  
  {/* left component */}
  
  <div className='container mx-auto max-w-4xl px-4 py-4 text-left ml-10'>
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{courseData.courseTitle}</h1>
    <p className="mt-2 text-lg w-1/2 text-gray-600" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>
 
  {/* review and rating */}
   <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt="" 
                  className='w-3.5 h-3.5'/>
              ))}
            </div>
            (
            <p className='text-sm text-blue-600'>{courseData.courseRatings.length} {courseData.courseRatings.length >1 ? 'ratings' : 'rating'}</p>
            )
            <p> {courseData.enrolledStudents.length} {courseData.enrolledStudents.length >1 ? 'students' : 'student'}</p>
          </div>
    <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educatorName}</span></p>

    <div className='pt-8 text-gray-800'>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Course Structure
      </h2>

      <div className='pt-5 '>
        {courseData.courseContent?.map((chapter, index)=>
          <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
            <div className='flex items-center justify-between  px-4 py-3  cursor-pointer select-none ' onClick={()=>toggleSection(index)}>
              <div className='flex items-center gap-2'>
                <img  className = {`transform transition-transform ${openSection[index] ? 'rotate-180 ': ' '}`} src={assets.down_arrow_icon} alt="arrow icon" />
                <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
              </div>
              <p className='text-sm md:text-default'>
                {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
              </p>

            </div>
            {/* //for the lecture */}
            <div className={`overflow-hidden transition-all duration-300  ${openSection[index] ? 'max-h-96' :'max-h-0'}`}>
              <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                {chapter.chapterContent?.map((lecture, i)=>
                <li key={i} className='flex items-start gap-2 py-1'>
                 <img src={assets.play_icon} alt="play_icon" className='w-4 h-4 mt-1' />
                 <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                  <p>{lecture.lectureTitle}</p>
                  <div className='flex gap-2'>
                    {lecture.isPreviewFree && <p 
                    onClick={()=>setPlayData({
                      videoId: lecture.lectureUrl.split('/').pop()
                    })}
                    className='text-sm text-green-600 cursor-pointer'>Free Preview</p>}
                    <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ['h', 'm']})}</p>
                  </div>
                 </div>
                </li>

                )}
              </ul>
            </div>

          </div>

        )

        }
      </div>
     
    </div>
     <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Course Description
      </h2>
      <p className="text-gray-600 space-y-4 leading-relaxed" 
      dangerouslySetInnerHTML={{__html: courseData.courseDescription}}>
      </p>
    </div>

      </div>
 
  {/* right component */}
  <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-sm mr-5 w-full overflow-hidden">
      
      {
        playData ? 
  <YouTube videoId={playData.videoId} opts={{playerVars: {autoplay: 1}}} iframeClassName='w-full aspect-video' />
  :

      <img 
        src={courseData.courseThumbnail} 
        alt='thumbnail'
        className="w-full object-cover" 
      />
      }
      {/* Course Image */}
      
      {/* Card Content */}
      <div className="p-6">
        
       <div className='flex items-center gap-2 '>
     <img  className = 'w-3.5'src={assets.time_left_clock_icon} alt="time_left_clock_icon" />
        <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
        </div>
        {/* Price Section */}
        <div className='flex gap-3 items-center pt-2'>
          <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice /100 ).toFixed(2)}</p>
          <p className='md:text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
          <p className='md:text-lg text-gray-500'>{courseData.discount} % off</p>
        </div>
        {/* Stats Section */}
        <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
          <div className=' flex items-center gap-1'>
            <img src={assets.star} alt="star" />
            <p>{calculateRating(courseData)}</p>
          </div>
          <div className='h-4 w-px bg-gray-500/40'></div>
          
          <div className=' flex items-center gap-1'>
            <img src={assets.time_clock_icon} alt="clock icon" />
            <p>{calculateCourseDuration(courseData)}</p>
          </div>

         <div className='h-4 w-px bg-gray-500/40'></div>
         
         <div className=' flex items-center gap-1'>
            <img src={assets.lesson_icon} alt="clock icon" />
            <p>{calculateTotalLecture(courseData)} lessons</p>
          </div>
        </div>
        
        {/* Enroll Button */}
        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 mt-5 transition duration-300 mb-6 cursor-pointer"  onClick = {enrollCourse}> 
         { isAlreadyEnroll ? ' AlreadyEnroll Now' : 'Enroll Now'} 
        </button>
        
        {/* Features List */}
        <div>
        <h3 className="font-bold text-gray-800 text-lg mb-3">What's in the course?</h3>
        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
          <li>Lifetime access with free updates.</li>
          <li>Step-by-step, hands-on project guidance.</li>
          <li>Downloadable resources and source code.</li>
          <li>Quizzes to test your knowledge.</li>
          <li>Certificate of completion.</li>
        </ul>
        </div>
      </div>
    </div>
</div>
<Footer/>
    </>
  ) :
  <Loading/>

}

export default CourseDetail