import useQuery from "@/hooks/useQuery";
import { courseServices } from "@/features/courses/services/courseServices";
import HeroSection from "./HeroSection";
import CourseComingSection from "./CourseComingSection";
import CoursesSection from "./CoursesSection";
import TeacherSection from "./TeacherSection";
import FeaturedSection from "./FeaturedSection";
import TestimonialSection from "./TestimonialSection";
import FaqSection from "./FaqSection";
import GallerySection from "./GallerySection";
import CallRegisterSection from "./CallRegisterSection";
import { galleryServices } from "@/features/general/services/galleryServices";
import { teamServices } from "@/features/general/services/teamServices";
import { questionService } from "@/features/general/services/questionService";

export const HomePage = () => {
  const {
    data: dataCourses,
    error: errorCourses,
    isLoading: loadingCourses,
  } = useQuery({
    queryKey: ["course", "active,inactive"],
    queryFn: () => courseServices.getCourses("?status=active,inactive"),
  });

  const allCourses = dataCourses?.courses || [];
  const now = new Date();

  // Active courses whose start date is not in the future go to the main list
  const courses = allCourses.filter((course) => {
    if (course.status !== "active") return false;
    if (course.startDate && new Date(course.startDate) > now) {
      return false;
    }
    return true;
  });

  // Inactive courses or active courses with future start dates go to the coming soon section
  const comingCourses = allCourses.filter((course) => {
    if (course.status === "inactive") return true;
    if (course.status === "active" && course.startDate && new Date(course.startDate) > now) {
      return true;
    }
    return false;
  });

  // get gallery section
  const {
    data: dataGallery,
    error: errorGallery,
    isLoading: loadingGallery,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryServices.getGallery(),
  });
  const galleries = dataGallery?.galleries?.[0]?.images || [];

  //get team data
  const {
    data: dataTeam,
    error: errorTeam,
    isLoading: loadingTeam,
  } = useQuery({
    queryKey: ["team"],
    queryFn: () => teamServices.getTeam(),
  });
  const teams = dataTeam?.teams || [];

  //  get data questions
  const {
    data: dataQuestion,
    error: errorQuestion,
    isLoading: loadingQuestion,
  } = useQuery({
    queryKey: ["question"],
    queryFn: () => questionService.getQuestion(),
  });
  const questions = dataQuestion?.questions || [];

  return (
    <main className="mainwrapper">
      <HeroSection />
      <CourseComingSection courses={comingCourses} loading={loadingCourses} />
      <CoursesSection courses={courses} loading={loadingCourses} />
      <TeacherSection teachers={teams} loading={loadingTeam} />
      <FeaturedSection />
      {/* --------------------------------Testimonial-------------------------------- */}
      <TestimonialSection />
      {/* --------------------------------faq-------------------------------- */}
      <FaqSection questions={questions} loading={loadingQuestion} />
      <GallerySection galleries={galleries} loading={loadingGallery} />
      <CallRegisterSection />
    </main>
  );
};
export default HomePage;
