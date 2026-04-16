import useMutation from "@/hooks/useMutation";
import { useEffect, useMemo } from "react";
import HeroSection from "./HeroSection";
import FaqSection from "../HomePage/FaqSection";
import ContentDetailSection from "./ContentDetailSection";
import FeaturedSection from "../HomePage/FeaturedSection";
import CoursesSection from "./CoursesSection";
import { questionService } from "@/features/general/services/questionService";
import useQuery from "@/hooks/useQuery";
import useDebounce from "@/hooks/useDebounce";
import PageLoading from "@/components/PageLoading";
import { ROLES } from "@/constants/roles";
import { formatCurrency, formatDate } from "@/utils/format";
import { courseServices } from "@/features/courses/services/courseServices";
import { useParams } from "react-router-dom";
import HeroTop from "@/features/general/components/HeroTop";
import { useAuthContext } from "@/context/AuthContext";

const CourseDetailPage = () => {
    const { courseSlug } = useParams()
    // get course data
    const {
        data: courseData,
        error: courseError,
        loading: courseLoading,
    } = useQuery(courseServices.getCourses);
    const courses = courseData?.courses || [];

    //  get questions data
    const {
        data: questionData,
        error: questionError,
        loading: questionLoading
    } = useQuery(questionService.getQuestion);
    const questions = questionData?.questions || [];

    // get courses data by slug
    const {
        data: courseDetailData,
        error: courseDetailError,
        loading: courseDetailLoading,
        execute,
    } = useMutation(courseServices.getCourseBySlug);

    useEffect(() => {
        if (courseSlug) execute(courseSlug || "");
    }, [courseSlug])

    const orderLink = `/course-order/` + courseSlug;

    const { courseInfo } = useAuthContext();
    const { teams, startDate, price, _id } = courseDetailData || {};

    const isRegistered = useMemo(() => {
        return !!courseInfo?.find((item) => item?._id === _id);
    }, [courseInfo, _id]);

    const modifiedProps = useMemo(() => ({
        ...courseDetailData,
        teacherInfo: courseDetailData?.instructor || teams?.find((item) => item.tags.includes(ROLES.teacher)) || {},
        startDate: formatDate(startDate || ""),
        price: formatCurrency(price || ""),
        orderLink,
        isRegistered,
    }
    ), [courseDetailData, teams, startDate, price, orderLink, isRegistered]);

    const apiLoading = courseDetailLoading || questionLoading || courseLoading;
    const pageLoading = useDebounce(apiLoading, 100);

    if (pageLoading) {
        return <PageLoading />;
    }
    return (
        <>
            <HeroTop {...modifiedProps} />
            <main className="mainwrapper coursedetailpage">
                <HeroSection {...modifiedProps} />
                <ContentDetailSection {...modifiedProps} />
                <FeaturedSection />
                <FaqSection questions={questions} loading={questionLoading} />
                <CoursesSection courses={courses} loading={courseLoading} {...courseDetailData} />
            </main>
        </>

    )
}

export default CourseDetailPage
