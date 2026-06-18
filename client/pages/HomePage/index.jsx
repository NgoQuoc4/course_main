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
  // Active courses go to the main list
  const courses = allCourses.filter((course) => course.status === "active");

  // Inactive courses go to the coming soon section
  const comingCourses = allCourses.filter(
    (course) => course.status === "inactive",
  );

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
