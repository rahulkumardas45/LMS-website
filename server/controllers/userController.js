import Stripe from "stripe";
import User from "../models/User.js"
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { json } from "express";

// get user data
export const getUserData = async (req, res) =>{
    try {
          const userId = req.auth().userId
          const user = await User.findById(userId)

          if(!user){
            return res.json({ success: false, message: 'Usre not found'})
          }

          res.json({ success: true, user})

    } catch (error) {
        res.json({ success: false, message: error.message})
        
    }
}

export const userEnrolledCourses = async( req, res) =>{
    try {
        const userId = req.auth().userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })


    } catch (error) {
        
        res.json({ success: false, message: error.message})
    }
}

// purchase course

export const purchaseCourse = async (req, res)=>{
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth().userId

        const courseData = await Course.findById(courseId)
        const userData = await User.findById( userId )
        
        if(!courseData || !userData){
            return res.json({ success: false , message: 'data is not found'})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice/100).toFixed(2),

        }

        // store the db
    const newPurchase = await Purchase.create(purchaseData)

    // Stripe payment gateway initailize
     
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const currency = process.env.CURRENCY.toLowerCase()

    // Creating aline item for the stripe

    const line_items = [{
        price_data: {
            currency,
            product_data: {
                name: courseData.courseTitle
            },
            unit_amount: Math.floor(newPurchase.amount) * 100
        },
        quantity: 1

    }]

    const session = await stripeInstance.checkout.sessions.create({
      
          success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                // Pass identifiers to link the Stripe payment back to your database
                purchaseId: newPurchase._id.toString(),
                userId: userId,
                courseId: courseId,
            }

    })

    res.json({ success: true, session_url: session.url });



        
    } catch (error) {
        res.json({ success: false, message: error.message})
        
    }

}

// course progress of 

export const  updateUserCourseProgress = async (req, res)=>{
    try {
        
        const{  userId } = req.auth();
        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findById({userId, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({ success: true, message: 'Lecture Already Completed'})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        }else{
           await CourseProgress.create({
            userId,
            courseId,
            lectureCompleted: [lectureId]
           }) 
        }

        res.json({success: true, message: 'Progress Updated'})

    } catch (error) {

        res.json({ success: false, message: error.message})
    }
}


// get user progress

export const getUserCourseProgress = async (req, res)=>{
    try {
         
        const{  userId } = req.auth();
        const { courseId } = req.body

        const progressData = await CourseProgress.findById({userId, courseId})

        res.json({ success: true, progressData})
    } catch (error) {
        res.json({ success:false,  message: error.message})
    }

}

//add user rating to course 

export const addUserRating =  async (req, res)=>{
    const { userId } = req.body()
    const { courseId, rating } = req.body;

    if( !courseId || !userId || !rating || rating<1 || rating >5){
        return res.json({success: false , message:  'Invalid Details'})
    }

     try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.json({ success: false, message: 'Course not found.'});
        }

    const user = await User.findById(userId)
       if(!user || !user.enrolledCourses.includes(courseId)){
        return res.json({ success: false,  message: 'user has not purchase this course.'});

       }

       const existingRatingIndex = course.courseRatings.findIndex( r => r.userId === userId)

       if(existingRatingIndex > -1){
        course.courseRatings[existingRatingIndex].rating = rating;
       }else{
          course.courseRatings.push({ userId, rating })
       }

       await course.save();

       return res.json({ success: true, message: 'Rating added'})
     

     } catch (error) {

        return res.json({ success: false, message: error.message })
     }

}