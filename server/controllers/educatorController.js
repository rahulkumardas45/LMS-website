import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: 'User not authenticated' });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });
        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// add new course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body || {};
        const imageFile = req.file;
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const educatorId = auth?.userId;

        if (!educatorId) {
            return res.json({ success: false, message: "Educator id is not found" });
        }

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail Not Attached" });
        }

        if (!courseData) {
            return res.json({ success: false, message: "Course data is required" });
        }

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        // Fetch educator details or sync from Clerk
        let educator = await User.findById(educatorId).select("name");

        if (!educator) {
            try {
                const clerkUser = await clerkClient.users.getUser(educatorId);
                if (clerkUser) {
                    educator = await User.create({
                        _id: clerkUser.id,
                        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'Educator',
                        imageUrl: clerkUser.imageUrl || '',
                        enrolledCourses: []
                    });
                }
            } catch (e) {}
        }

        parsedCourseData.educatorName = educator?.name || "Educator";

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        const newCourse = await Course.create(parsedCourseData);

        res.json({ success: true, message: "Course Added", course: newCourse });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: 'Educator not found' });
        }

        const courses = await Course.find({ educator: userId });

        res.json({
            success: true,
            courses: courses || []
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// get educator dashboard data (total earning, enrolled students, no of courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: 'Educator not authenticated' });
        }

        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + (Number(purchase.amount) || 0), 0);

        const enrolledStudentsData = [];

        for (const course of courses) {
            const students = await User.find(
                { _id: { $in: course.enrolledStudents || [] } },
                'name imageUrl createdAt'
            );

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student,
                    date: student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings: Math.round(totalEarnings * 100) / 100,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: 'Educator not authenticated' });
        }

        const courses = await Course.find({ educator: userId });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases
            .filter(purchase => purchase.userId && purchase.courseId)
            .map(purchase => ({
                student: purchase.userId,
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt,
                PurchaseData: purchase.createdAt
            }));

        res.json({
            success: true,
            enrolledStudents
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};