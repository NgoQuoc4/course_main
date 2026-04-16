import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";

dotenv.config();

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const courses = await Course.find({}, "title slug");
        console.log("Current Courses:", JSON.stringify(courses, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkCourses();
