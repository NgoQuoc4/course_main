import { useMemo } from "react";
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
        loading: courseLoading,
    } = useQuery(courseServices.getCourses);
    const courses = courseData?.courses || [];

    //  get questions data
    const {
        data: questionData,
        loading: questionLoading
    } = useQuery(questionService.getQuestion);
    const questions = questionData?.questions || [];

    // get courses data by slug
    const {
        data: courseDetailData,
        isLoading: courseDetailLoading,
    } = useQuery({
        queryKey: ["course-detail", courseSlug],
        queryFn: () => courseServices.getCourseBySlug(courseSlug),
        enabled: !!courseSlug,
    });

    const orderLink = `/course-order/` + courseSlug;

    const { courseInfo } = useAuthContext();
    const { startDate, price, _id } = courseDetailData || {};

    const isRegistered = useMemo(() => {
        return !!courseInfo?.find((item) => item?._id === _id);
    }, [courseInfo, _id]);

    const modifiedProps = useMemo(() => ({
        ...courseDetailData,
        name: courseDetailData?.title,
        title: courseDetailData?.tags?.[0] || "Khóa học",
        image: courseDetailData?.thumbnail,
        tags: courseDetailData?.tags?.join(" | "),
        duration: courseDetailData?.duration || courseDetailData?.chapters?.reduce((acc, chap) => acc + (chap.lessons?.length || 0), 0) || 15,
        schedule: courseDetailData?.schedule || {
            days: "Thứ 2, Thứ 4, Thứ 6",
            time: "18:30 - 21:30",
            address: "Lầu 2, 666/46/29 Ba Tháng Hai, Phường 14, Quận 10, TP. HCM"
        },
        teacherInfo: courseDetailData?.instructor || {},
        startDate: formatDate(startDate || ""),
        price: formatCurrency(price || ""),
        status: courseDetailData?.status,
        orderLink,
        isRegistered,
    }
    ), [courseDetailData, startDate, price, orderLink, isRegistered]);

    const apiLoading = courseDetailLoading || questionLoading || courseLoading;
    const pageLoading = useDebounce(apiLoading, 100);

    if (pageLoading) {
        return <PageLoading fixed={true} />;
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
