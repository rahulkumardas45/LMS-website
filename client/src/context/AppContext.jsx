import { createContext, useContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth, useUser} from "@clerk/clerk-react";


export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();

  const {getToken} = useAuth();
  const {user} = useUser();


  const [isEducator, setIsEducator] = useState(true);

 const [allCourses, setAllCourses] = useState([]);
 const [enrolledCourses, setEnrolledCourses] = useState([])

 //fetch all courses detail

 const fetchAllCourses = async () => {
  setAllCourses(dummyCourses)
 }


 //function t0   calculate the rating


 const calculateRating = (course) => {
    if(course.courseRatings.length === 0) return 0;

    let totalRating = 0
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating

    }
  )
  return totalRating / course.courseRatings.length
    
 }

 //function to calculate course chapter time
 const calculateChapterTime = (chapter) => {
  let totalTime = 0
  chapter.chapterContent.map((lecture) => 
    totalTime += lecture.lectureDuration
 )
 return humanizeDuration(totalTime * 60 * 1000, { units: ["h", "m"] })

 }

 //function to calculate Course duration
 const calculateCourseDuration = (course) => {
   let totalTime =0;
   course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=> totalTime += lecture.lectureDuration

   ))

    return humanizeDuration(totalTime * 60 * 1000, { units: ["h", "m"] })

 }


 //fetch user enrollcourses

 const fetchUserEnrolledCourses = async ()=>{
  setEnrolledCourses(dummyCourses)
 }


 // function to calculate the total no of lecture
 const calculateTotalLecture = (course) => {
  let totalLecture = 0
  course.courseContent.map((chapter) => {
       if(Array.isArray(chapter.chapterContent)){
        totalLecture += chapter.chapterContent.length
       }
       
  }
)
return totalLecture;
 }



//run  the function useeffect function

useEffect(() => {
  fetchAllCourses();
   fetchUserEnrolledCourses();
}, []);

const logToken = async ()=>{
  console.log(await getToken());
}

useEffect(()=>{
  if(user){
  logToken()
  }
},[user])


    const value ={
      currency,
      allCourses,
      navigate,
      calculateRating,
      isEducator,
      setIsEducator,
      calculateChapterTime,
      calculateCourseDuration,
      calculateTotalLecture,
      enrolledCourses,
      fetchUserEnrolledCourses
    }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

