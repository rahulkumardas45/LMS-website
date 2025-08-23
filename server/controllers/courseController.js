
import Course from "../models/Course.js";

//Get All Courses

export const getAllCourse = async (req, res)=>{
    try {

        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStusents']).populate({path: 'educator'})

        res.json({ success: true, courses})

    } catch (error) {
        res.json({ success: false, message: error.message})
    }

}

// get course by id

export const getCourseId = async (req, res)=>{
    
   try {
    const { id } = req.params;

    const courseData = await Course.findById(id).populate({path: 'educator'})

    // remove lectureurl if ispreview is false

    courseData.cousreContent.forEach(chapter => {
        chapter.chapterContent.forEach(lecture =>{
            if(!lecture.isPreviewFree){
                lecture.lectureUrl = "";
            }
        })
    })

    res.json({ success: true, courseData})
    
   } catch (error) {

    res.json({success: false, message: error.message})
   }

}

