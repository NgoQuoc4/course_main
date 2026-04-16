import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import PageLoading from './components/PageLoading'
import PATHS from "@/constants/paths";
import PATHS_ADMIN from "@/constants/pathadmin";
import HomePageAdmin from './pages/AdminPage/HomePage';
import CoursePageAdmin from './pages/AdminPage/CoursePage';
import BlogPageAdmin from './pages/AdminPage/BlogPage';
import UserPageAdmin from './pages/AdminPage/UserPage';
import AdminRoute from './components/AdminRoute';
import AuthContextProvider from './context/AuthContext';
import MainContextProvider from './context/MainContext';

function App() {
  const MainLayout = lazy(() => import('./layouts/MainLayout'));
  const HomePage = lazy(() => import('./pages/HomePage'));
  const CoursesPage = lazy(() => import('./pages/CoursesPage'));
  const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
  const BlogPage = lazy(() => import('./pages/BlogPage'));
  const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
  const CourseOrderPage = lazy(() => import('./pages/CourseOrderPage'));
  const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage'));
  const MyInfo = lazy(() => import('./pages/StudentProfilePage/MyInfo'));
  const MyCourse = lazy(() => import('./pages/StudentProfilePage/MyCourse'));
  const MyPayment = lazy(() => import('./pages/StudentProfilePage/MyPayment'));
  const PaymentMethodPage = lazy(() => import('./pages/PaymentMethodPage'));
  const ContactPage = lazy(() => import('./pages/ContactPage'));
  const AboutPage = lazy(() => import('./pages/AboutPage'));
  const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
  const ErrorPage = lazy(() => import('./pages/ErrorPage'));
  const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
  
  // Admin pages
  const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

  return (
    <Suspense fallback={<PageLoading />}>
      <BrowserRouter>
        <MainContextProvider>
          <AuthContextProvider>
            <Routes>
              {/* Main App Routes */}
              <Route path={PATHS.HOME} element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path={PATHS.COURSE.INDEX} element={<CoursesPage />} />
                <Route path={PATHS.COURSE.DETAIL} element={<CourseDetailPage />} />

                <Route path={PATHS.BLOG.INDEX} element={<BlogPage />} />
                <Route path={PATHS.BLOG.DETAIL} element={<BlogDetailPage />} />

                <Route element={<PrivateRoute redirectPath={PATHS.HOME} />}>
                  <Route path={PATHS.COURSE.ORDER} element={<CourseOrderPage />} />

                  <Route path={PATHS.PROFILE.INDEX} element={<StudentProfilePage />} >
                    <Route index element={<MyInfo />} />
                    <Route path={PATHS.PROFILE.MY_COURSE} element={<MyCourse />} />
                    <Route path={PATHS.PROFILE.MY_PAYMENT} element={<MyPayment />} />
                  </Route>
                </Route>

                <Route path={PATHS.PAYMENT} element={<PaymentMethodPage />} />
                <Route path={PATHS.CONTACT} element={<ContactPage />} />
                <Route path={PATHS.ABOUT} element={<AboutPage />} />
                <Route path={PATHS.PRIVACY} element={<PrivacyPage />} />

                <Route path="*" element={<ErrorPage />} />
              </Route>

              {/* Admin Dashboard Routes */}
              <Route element={<AdminRoute allowedRoles={['admin', 'teacher']} />}>
                <Route path={PATHS_ADMIN.HOME} element={<AdminLayout />}>
                  <Route index element={<HomePageAdmin />} />
                  <Route path={PATHS_ADMIN.COURSE.INDEX} element={<CoursePageAdmin />} />
                  <Route path={PATHS_ADMIN.BLOG.INDEX} element={<BlogPageAdmin />} />
                  
                  {/* restricted to admin only */}
                  <Route element={<AdminRoute allowedRoles={['admin']} />}>
                    <Route path={PATHS_ADMIN.USERS} element={<UserPageAdmin />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </AuthContextProvider>
        </MainContextProvider>
      </BrowserRouter>
    </Suspense >
  )
}

export default App
