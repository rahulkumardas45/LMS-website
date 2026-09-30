import Course from "../models/Course.js";

// Get All Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"]);

    res.json({ success: true, courses: courses || [] });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Course by ID
export const getCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Course.findById(id);

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const courseObj = courseData.toObject();

    // remove lectureUrl if isPreviewFree is false
    if (Array.isArray(courseObj.courseContent)) {
      courseObj.courseContent.forEach(chapter => {
        if (Array.isArray(chapter.chapterContent)) {
          chapter.chapterContent.forEach(lecture => {
            if (!lecture.isPreviewFree) {
              lecture.lectureUrl = "";
            }
          });
        }
      });
    }

    res.json({ success: true, courseData: courseObj });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
