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

//create a instance of the stripe payment 

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Use a try...catch block for all business logic
            try {
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    expand: ['data.line_items'], // Optional: expand if you need more details
                });

                if (sessions.data.length === 0) {
                    console.error(`No checkout session found for payment intent: ${paymentIntentId}`);
                    // Return 200 to stop Stripe from retrying for this recoverable error
                    return res.json({ received: true, message: "No session found." });
                }

                const { purchaseId } = sessions.data[0].metadata;

                const purchaseData = await Purchase.findById(purchaseId);

                // --- IDEMPOTENCY CHECK ---
                // If the purchase is already completed, do nothing.
                if (purchaseData && purchaseData.status === 'completed') {
                    console.log(`Purchase ${purchaseId} already processed.`);
                    return res.json({ received: true, message: "Already completed." });
                }
                
                // Check if all necessary data exists
                if (!purchaseData) {
                    console.error(`Purchase with ID ${purchaseId} not found.`);
                    return res.status(404).send('Purchase not found.');
                }
                
                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId);

                if (!userData || !courseData) {
                    console.error(`User or Course not found for Purchase ID ${purchaseId}.`);
                    return res.status(404).send('User or Course not found.');
                }

                // --- CORRECTED MONGOOSE LOGIC ---
                // Push the user's ID, not the whole user object
                courseData.enrolledStudents.push(userData._id); 
                userData.enrolledCourses.push(courseData._id);
                purchaseData.status = 'completed';

                // Save all changes
                await courseData.save();
                await userData.save();
                await purchaseData.save();

                console.log(`Successfully processed purchase ${purchaseId}.`);

            } catch (error) {
                console.error(`Error processing payment_intent.succeeded: ${error.message}`);
                // Send a 500 error to let Stripe know something went wrong on our end
                return res.status(500).send('Internal Server Error');
            }
            break;
        }
        case 'payment_intent.payment_failed': {
            // It's good practice to also wrap this in a try...catch
            try {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });

                if (sessions.data.length > 0) {
                    const { purchaseId } = sessions.data[0].metadata;
                    const purchaseData = await Purchase.findById(purchaseId);
                    if (purchaseData) {
                        purchaseData.status = 'failed';
                        await purchaseData.save();
                    }
                }
            } catch (error) {
                 console.error(`Error processing payment_intent.payment_failed: ${error.message}`);
                 return res.status(500).send('Internal Server Error');
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Send a 200 OK response to acknowledge receipt of the event
    res.json({ received: true });
};