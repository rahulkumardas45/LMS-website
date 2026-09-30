import { Webhook } from 'svix'
import Stripe from 'stripe'
import User from '../models/User.js'
import Purchase from '../models/Purchase.js'
import Course from '../models/Course.js'

// API Controller function to manage Clerk user with database
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const payload = typeof req.body === 'string'
            ? req.body
            : Buffer.isBuffer(req.body)
                ? req.body.toString('utf8')
                : JSON.stringify(req.body);

        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const parsedBody = typeof req.body === 'object' && !Buffer.isBuffer(req.body)
            ? req.body
            : JSON.parse(payload);

        const { data, type } = parsedBody;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || 'User',
                    imageUrl: data.image_url || '',
                };
                await User.findByIdAndUpdate(data.id, userData, { upsert: true, new: true });
                return res.json({ success: true, message: "User created successfully" });
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username || 'User',
                    imageUrl: data.image_url || '',
                };
                await User.findByIdAndUpdate(data.id, userData, { upsert: true, new: true });
                return res.json({ success: true, message: "User updated successfully" });
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true, message: "User deleted successfully" });
            }
            default:
                return res.json({ success: true, message: `Webhook event ${type} acknowledged` });
        }
    } catch (error) {
        console.error("Clerk webhook error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const stripeWebhooks = async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const purchaseId = session.metadata?.purchaseId;

                if (!purchaseId) {
                    console.log('No purchaseId in checkout session metadata.');
                    return res.status(200).json({ received: true });
                }

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

                // Enroll the user into the course
                const userIdStr = userData._id.toString();
                if (!courseData.enrolledStudents.map(id => id.toString()).includes(userIdStr)) {
                    courseData.enrolledStudents.push(userIdStr);
                    await courseData.save();
                }

                const courseIdStr = courseData._id.toString();
                if (!userData.enrolledCourses.map(id => id.toString()).includes(courseIdStr)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                purchaseData.status = 'completed';
                await purchaseData.save();

                console.log(`Purchase ${purchaseId} marked as completed via checkout.session.completed.`);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1,
                });

                if (!session.data || session.data.length === 0) {
                    return res.status(200).json({ received: true });
                }

                const purchaseId = session.data[0].metadata?.purchaseId;
                if (!purchaseId) {
                    return res.status(200).json({ received: true });
                }

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

                // Enroll the user into the course
                const userIdStr = userData._id.toString();
                if (!courseData.enrolledStudents.map(id => id.toString()).includes(userIdStr)) {
                    courseData.enrolledStudents.push(userIdStr);
                    await courseData.save();
                }

                const courseIdStr = courseData._id.toString();
                if (!userData.enrolledCourses.map(id => id.toString()).includes(courseIdStr)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                purchaseData.status = 'completed';
                await purchaseData.save();

                console.log(`Purchase ${purchaseId} marked as completed via payment_intent.succeeded.`);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1,
                });

                if (session.data && session.data.length > 0) {
                    const purchaseId = session.data[0].metadata?.purchaseId;
                    if (purchaseId) {
                        const purchaseData = await Purchase.findById(purchaseId);
                        if (purchaseData && purchaseData.status !== 'failed') {
                            purchaseData.status = 'failed';
                            await purchaseData.save();
                            console.log(`Purchase ${purchaseId} marked as failed.`);
                        }
                    }
                }
                break;
            }

            default:
                console.log(`Unhandled stripe event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error(`Error processing webhook: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



