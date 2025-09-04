import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import Purchase from '../models/Purchase.js'
import User from '../models/User.js'
import { json } from 'express'




//update to role to educator
export const updateRoleToEducator = async(req, res)=>{
    try {
        const userId = req.auth().userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })
    res.json({ success: true, message: 'you can publish a course now'})
        
    } catch (error) {
        res.json({ success:false, message: error.message })
    }
}

// add new course

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;

     if(!educatorId){
      return res.json({ success: false, message: "Educator id is not found" });
     }

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId; 

    // Fetch educator details

    const educator = await User.findById(educatorId).select("name");

    if (!educator) {
      return res.json({ success: false, message: "Educator not found" });
    }

    parsedCourseData.educatorName = educator.name;


    //  Upload image first
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    //Set required fields before creating
  
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

   
    const newCourse = await Course.create(parsedCourseData);

    res.json({ success: true, message: "Course Added", course: newCourse });

    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// export const getEducatorCourses = async (req, res) => {
//   try {
//     // Assuming you are using Clerk or similar auth middleware
//     const { userId } = req.auth();

//     // The auth middleware should handle this, but an extra check is safe.
//     if (!userId) {
//       return res.status(401).json({ 
//         success: false, 
//         message: 'Unauthorized: User not found.' 
//       });
//     }

//     // Query the database for courses matching the educator's ID
//     const courses = await Course.find({ educator: userId });

//     // It's good practice to always return a successful response,
//     // even if the result is an empty array. Your original code did this well.
//     res.status(200).json({
//       success: true,
//       courses
//     });

//   } catch (error) {
//     // Log the detailed error on the server for debugging
//     console.error("Error fetching educator courses:", error);

//     // Send a generic, user-friendly error message to the client
//     res.status(500).json({ 
//       success: false, 
//       message: "An internal server error occurred. Please try again later." 
//     });
//   }
// };


// get educator courses

export const getEducatorCourses = async( req, res)=>{
  try {
    const { userId } = req.auth()

    if(!userId){
     return res.json({ success: false,  message:  'educator not found'})
    }

   const courses = await Course.find({ educator: userId });

   if (!courses || courses.length === 0) {
      return res.json({ success: true, courses: [] }); // return empty array instead of error
    }

  
   res.json({
    success: true,
    courses
   })
    
  } catch (error) {
    res.json({ success:false, message: error.message})
    
  }
     
}

// get educator dashboard data ( total earning, enrolled student, no of courses)

export const educatorDashboardData = async( req, res)=>{
  try {
     const { userId } = req.auth()

     const courses = await Course.find({educator: userId});

     const totalCourses  =  courses.length;
     const courseIds = courses.map( course => course._id);

  //cal the earning
     const purchases = await Purchase.find({
          courseId: {$in: courseIds},
          status: 'completed'
  
     });
  
     const totalEarnings = purchases.reduce((sum, purchases)=> sum +purchases.amount, 0);
  
     // collect unique enrolled student Ids with their courses title
  
     const enrolledStudentsData = [];

     for( const course of courses) {
      const students = await User.find({
         _id: {$in: course.enrolledStudents}
      }, 'name imageUrl'
    );
  
     students.forEach( student =>{
      enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
      })
     })
  
  
     }

     res.json({
       success: true,
       dashboardData: {
        totalEarnings, enrolledStudentsData, totalCourses
       }
     })
  
  } catch (error) {
    res.json({ success: false, message: error.message});
  }
}


// Get enroled students data with purchase data

export const getEnrolledStudentsData = async (req, res)=>{
 try {
    const { userId } = req.auth()

    const courses = await Course.find({educator : userId })

    const courseIds = courses.map( course => course._id)

  const purchases = await Purchase.find({
       courseId: { $in: courseIds},
       status: 'completed'
    }).populate('userId', 'name imageUrl').populate( 'courseId', 'courseTitle')

    const enrolledStudents = purchases.map( Purchase => ({
      student: Purchase.userId,
      courseTitle: Purchase.courseId.courseTitle,
      PurchaseData: Purchase.createdAt
    }))

    res.json({
      success:  true,
      enrolledStudents
    })

 } catch (error) {
   res.json({ success: false, message: error.message})
 }
}