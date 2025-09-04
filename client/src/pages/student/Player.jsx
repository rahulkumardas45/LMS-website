import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { useState } from 'react';
import { assets } from '../../assets/assets';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Player = () => {
  
  const [courseData, setCourseData] = useState(null);
   const [openSection, setOpenSection] = useState({});
   const [playData, setPlayData] = useState(null)
   const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData,fetchUserEnrolledCourses  } = useContext(AppContext)

    const [progressData, setProgressData] = useState(null)
    const [initialRating, setInitialRating] = useState(0)

   const {courseId} = useParams()

  const getCourseData = async () => {
    enrolledCourses.map((course) => {  if(course._id ===  courseId){
   setCourseData(course);

   course.courseRatings.map((item)=>{
    if(item.userId === userData._id){
      setInitialRating(item.rating)
    }
   })
    }
  })
}

  const toggleSection = (index)=>{
    setOpenSection((prev)=> ({
     ...prev, 
     [index]: !prev[index]
    }))
  }


  useEffect(()=>{
      if(enrolledCourses.length > 0){
        getCourseData()
      }
    },[enrolledCourses])

    const markLectureAsCompleted = async(lectureId) =>{
      try {

        const token = await getToken();

        const { data} = await axios.post(backendUrl + '/api/user/update-course-progress', {courseId, lectureId} , {headers: {Authorization: `Bearer ${token}`}})

        if(data.success){
          toast.success(data.message)
          getCourseProgress()
        }else{
          toast.error(data.message)
        }
        
      } catch (error) {
        
        toast.error(error.message)
      }
    }

    const getCourseProgress = async ()=>{
      try {
        const token = await getToken();
        const { data} = await axios.post(backendUrl + '/api/user/get-course-progress', {courseId}, {headers: {Authorization: `Bearer ${token}`}})

        if(data.success){
          setProgressData(data.progressData)
        }else{
          toast.error(data.message)
        }
        
      } catch (error) {
         toast.error(error.message)
      }

    }

    const handleRate  = async(rating) =>{
      try {
        const token = await getToken()
        const { data } = await axios.post(backendUrl + '/api/user/add-rating',
           {courseId, rating},
           {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }  
          )
        
        if(data.success){
          toast.success(data.message)
          fetchUserEnrolledCourses()
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
        
      }
    }

    useEffect(()=>{
      getCourseProgress()
    },[])


  return  courseData ? (
  <>
  <div className='p-4 sm:p-10 md:grid md:grid-cols-2 gap-15 md:px-36 pb-10'>
    {/* // left column */}
    <div className='text-gray-800 '>
    <h2 className='text-xl font-semibold'>Course Structure</h2>
    <div className='pt-5 '>
            { courseData && courseData.courseContent.map((chapter, index)=>
              <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                <div className='flex items-center justify-between  px-4 py-3  cursor-pointer select-none ' onClick={()=>toggleSection(index)}>
                  <div className='flex items-center gap-2'>
                    <img  className = {`transform transition-transform ${openSection[index] ? 'rotate-180 ': ' '}`} src={assets.down_arrow_icon} alt="arrow icon" />
                    <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>
                    {chapter.chapterContent.length} lectures -{calculateChapterTime(chapter)}
                  </p>
    
                </div>
                {/* //for the lecture */}
                <div className={`overflow-hidden transition-all duration-300  ${openSection[index] ? 'max-h-96' :'max-h-0'}`}>
                  <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                    {chapter.chapterContent.map((lecture, i)=>
                    <li key={i} className='flex items-start gap-2 py-1'>
                     <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play_icon" className='w-4 h-4 mt-1' />
                     <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                      <p>{lecture.lectureTitle}</p>
                      <div className='flex gap-2'>
                        {lecture.lectureUrl && <p 
                        onClick={()=>setPlayData({
                          ...lecture, chapter: index+1, lecture: i+1
                        })}
                        className='text-sm text-green-600 cursor-pointer'>Watch</p>}
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
       <div className='flex items-center gap-2 py-3 mt-10'>
        <h1 className='text-xl font-bold'>Rating this Course</h1>
        <Rating initialRating={initialRating} onRate={handleRate}/>
       </div>

    </div>
    {/* //right column */}
    <div  className='text-gray-800 text-right'>
    <div >
 { playData ? (
  <div>
      <YouTube videoId={playData.lectureUrl.split('/').pop()}  iframeClassName='w-full aspect-video' />
      <div className='flex justify-between items-center mt-1'>
        <p>{playData.chapter}.{playData.lecture} {playData.lectureTitle}</p>
        <button  onClick = {()=> markLectureAsCompleted(playData.lectureId)}  className='text-blue-600'>{progressData && progressData.lectureCompleted.includes(playData.lectureId)? 'Completed': 'Mark Complete'}</button>
      </div>
  </div>
 ):
      <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
 }
    </div>
    </div>
  </div>
<Footer/>
  </>
  ) : <Loading/>
}

export default Player