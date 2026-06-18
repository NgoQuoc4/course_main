import prisma from "./config/prisma.js";
import dotenv from "dotenv";

dotenv.config();

const checkCourses = async () => {
    try {
        const courses = await prisma.course.findMany({
            select: {
                title: true,
                slug: true
            }
        });
        console.log("Current Courses:", JSON.stringify(courses, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkCourses();
