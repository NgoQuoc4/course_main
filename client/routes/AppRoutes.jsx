// routes/AppRoutes.jsx
// Cấu hình Routing tập trung cho toàn bộ ứng dụng
// ======================================================================
// Tách riêng routing ra khỏi App.jsx để:
// 1. App.jsx chỉ lo việc wrap Providers (Redux, Context, BrowserRouter)
// 2. File này tập trung 100% vào việc điều hướng trang
// ======================================================================

import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PATHS from "@/constants/paths";

import PageLoading from "@/components/PageLoading";

// Lazy load tất cả Pages để tối ưu bundle size
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const CoursesPage = lazy(() => import("@/pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("@/pages/CourseDetailPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage"));
const CourseOrderPage = lazy(() => import("@/pages/CourseOrderPage"));
const StudentProfilePage = lazy(() => import("@/pages/StudentProfilePage"));
const MyInfo = lazy(() => import("@/pages/StudentProfilePage/MyInfo"));
const MyCourse = lazy(() => import("@/pages/StudentProfilePage/MyCourse"));
const MyPayment = lazy(() => import("@/pages/StudentProfilePage/MyPayment"));
const PaymentMethodPage = lazy(() => import("@/pages/PaymentMethodPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const PrivateRoute = lazy(() => import("@/components/PrivateRoute"));
// admin
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoading />}>
            <Routes>
                <Route path={PATHS.HOME} element={<MainLayout />}>
                    <Route index element={<HomePage />} />

                    {/* Khóa học */}
                    <Route path={PATHS.COURSE.INDEX} element={<CoursesPage />} />
                    <Route path={PATHS.COURSE.DETAIL} element={<CourseDetailPage />} />

                    {/* Blog */}
                    <Route path={PATHS.BLOG.INDEX} element={<BlogPage />} />
                    <Route path={PATHS.BLOG.DETAIL} element={<BlogDetailPage />} />

                    {/* Khu vực cần đăng nhập */}
                    <Route element={<PrivateRoute redirectPath={PATHS.HOME} />}>
                        <Route path={PATHS.COURSE.ORDER} element={<CourseOrderPage />} />
                        <Route path={PATHS.PROFILE.INDEX} element={<StudentProfilePage />}>
                            <Route index element={<MyInfo />} />
                            <Route path={PATHS.PROFILE.MY_COURSE} element={<MyCourse />} />
                            <Route path={PATHS.PROFILE.MY_PAYMENT} element={<MyPayment />} />
                        </Route>
                    </Route>

                    {/* Trang tĩnh */}
                    <Route path={PATHS.PAYMENT} element={<PaymentMethodPage />} />
                    <Route path={PATHS.CONTACT} element={<ContactPage />} />
                    <Route path={PATHS.ABOUT} element={<AboutPage />} />
                    <Route path={PATHS.PRIVACY} element={<PrivacyPage />} />

                    {/* 404 */}
                    <Route path="*" element={<ErrorPage />} />
                </Route>

                <Route path={PATHS_ADMIN.HOME} element={<AdminLayout />}>

                </Route>

            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
