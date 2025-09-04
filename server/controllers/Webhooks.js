import { Webhook } from 'svix'
import Stripe from 'stripe'
import User from '../models/User.js'
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

    const { data, type } = req.body

    switch (type) {
             case 'user.created' : {
                 const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                 }
                 await User.create(userData)
                 res.json({success: true , message: "user created succesfully"})
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
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1,
                });

                if (!session.data || session.data.length === 0) {
                    console.error(`No session found for payment intent: ${paymentIntentId}`);
                    return res.status(404).send('Session not found for the given payment intent.');
                }

                const { purchaseId } = session.data[0].metadata; // fixed key name
                const purchaseData = await Purchase.findById(purchaseId);

                if (!purchaseData) {
                    console.error(`Purchase not found with ID: ${purchaseId}`);
                    return res.status(404).send('Purchase not found.');
                }

                if (purchaseData.status === 'completed') {
                    console.log(`Purchase ${purchaseId} already processed.`);
                    return res.status(200).json({ received: true });
                }

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId);

                if (!userData || !courseData) {
                    console.error(`User or Course not found for Purchase ID: ${purchaseId}`);
                    return res.status(404).send('User or Course not found.');
                }

                // Enroll the user
                if (!courseData.enrolledStudents.includes(userData._id)) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                }

                if (!userData.enrolledCourses.includes(courseData._id)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                // Mark purchase as completed
                purchaseData.status = 'completed';
                await purchaseData.save();

                console.log(`Purchase ${purchaseId} marked as completed.`);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1,
                });

                if (!session.data || session.data.length === 0) {
                    console.error(`No session found for payment intent: ${paymentIntentId}`);
                    return res.status(404).send('Session not found for the given payment intent.');
                }

                const { purchaseId } = session.data[0].metadata; // fixed key name
                const purchaseData = await Purchase.findById(purchaseId);

                if (!purchaseData) {
                    console.error(`Purchase not found with ID: ${purchaseId}`);
                    return res.status(404).send('Purchase not found.');
                }

                if (purchaseData.status === 'failed') {
                    console.log(`Purchase ${purchaseId} is already marked as failed.`);
                    return res.status(200).json({ received: true });
                }

                purchaseData.status = 'failed';
                await purchaseData.save();

                console.log(`Purchase ${purchaseId} marked as failed.`);
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error(`Error processing webhook: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



