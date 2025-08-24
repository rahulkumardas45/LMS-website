import Stripe from "stripe";
import User from "../models/User.js"
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// get user data
export const getUserData = async (req, res) =>{
    try {
          const userId = req.auth.userId
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
        const userId = req.auth.userId
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
        const userId = req.auth.userId
        
        const origin = req.headers.origin; 

        const courseData = await Course.findById(courseId)
        const userData = await User.findById( userId )
        

        if(!courseData){
            return res.json({ success: false , message: 'coursedata is not found'})
        }
        
         if(!userData){
            return res.json({ success: false , message: 'userData is not found'})
        }

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
            unit_amount: Math.floor(newPurchase.amount)*100
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