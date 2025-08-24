import { Webhook } from 'svix'
import User from '../models/User.js'
import Stripe from 'stripe'

import Purchase from '../models/Purchase.js'
import Course from '../models/Course.js'


//API Controller function to manage clerk user with database

export const clerkWebhooks = async (req, res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        await whook.verify(JSON.stringify(req.body),  {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

    const {data, type } = req.body

        switch (type) {
             case 'user.created' : {
                 const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                 }
                 await User.create(userData)
                 res.json({message: "user created succesfully"})
                 break;
             }
             case 'user.updated' : {
                   const userData ={
                     email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                   }

                   await User.findByIdAndUpdate(data.id, userData)
                   res.json({})
                   break;
             }

             case 'user.deleted' : {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
             }

             default:
                break;

        }

    } catch (error) {
        res.json({success: false, message: error.message})
        
    }

}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    // Use the dedicated Webhook Signing Secret from your .env file
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the event came from Stripe using the correct secret
        event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // FIX 1: Listen for the 'checkout.session.completed' event.
    // This is the recommended, more direct event for this workflow.
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Extract the metadata you passed when creating the session
        const { userId, courseId } = session.metadata;

        if (!userId || !courseId) {
            console.error("Webhook Error: Missing userId or courseId in metadata.");
            // Acknowledge the event to prevent Stripe from retrying, but log the error.
            return res.status(200).json({ received: true, message: "Missing metadata." });
        }

        try {
            // FIX 2: The main logic is to CREATE the purchase and fulfill the order.
            
            // Step A: Check if this purchase has already been processed (idempotency)
            const existingPurchase = await Purchase.findOne({ stripePaymentId: session.payment_intent });
            if (existingPurchase) {
                console.log(`Purchase for payment intent ${session.payment_intent} already processed.`);
                return res.status(200).json({ received: true, message: "Already processed." });
            }

            // Step B: Create the purchase record in your database.
            await Purchase.create({
                userId,
                courseId,
                amount: session.amount_total / 100, // Amount from Stripe is in cents
                stripePaymentId: session.payment_intent, // Store the payment intent ID
                status: 'completed'
            });

            // Step C: Add the course ID to the user's enrolled courses.
            await User.findByIdAndUpdate(userId, {
                $push: { enrolledCourses: courseId }
            });

            // Step D: Add the user ID to the course's list of students.
            await Course.findByIdAndUpdate(courseId, {
                $push: { enrolledStudents: userId }
            });

            console.log(`✅ SUCCESS: Purchase fulfilled for User ID: ${userId}, Course ID: ${courseId}`);

        } catch (dbError) {
            console.error("❌ Database update failed after successful payment:", dbError);
            // Let Stripe know there was an error on our end so it can retry.
            return res.status(500).json({ error: "Database update failed." });
        }
    } else {
        // Handle other event types if necessary
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event to Stripe
    res.status(200).json({ received: true });
};




