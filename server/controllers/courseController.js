import Course from "../models/Course.js";

//  Get All Courses
export const getAllCourse = async (req, res) => {
  try {
    
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents" ]).populate("educator", "name") 
      
      if(!courses){
        return res.json({
          success: false,
          message:" cousess is not  found"
        })
      }

    res.json({ success: true, courses });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Course by ID

export const getCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Course.findById(id).populate("educator" ,"name");
  
    if (!courseData) {
     
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });
    

    res.json({ success: true, courseData });
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
