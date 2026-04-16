const COURSE_PATH = "/course";
const PROFILE_PATH = "/profile";
const BLOG_PATH = "/blog";
const ADMIN_PATH = "/admin";

const PATHS_ADMIN = {
    HOME: ADMIN_PATH,
    COURSE: {
        INDEX: ADMIN_PATH + COURSE_PATH,
        DETAIL: ADMIN_PATH + COURSE_PATH + '/:courseSlug', // /course/khoa-hoc-lap-trinh-frontend-newbie-28
        ORDER: ADMIN_PATH + '/course-order/:courseSlug', // /course-order/khoa-hoc-lap-trinh-frontend-newbie-28
    },
    BLOG: {
        INDEX: ADMIN_PATH + BLOG_PATH,
        DETAIL: ADMIN_PATH + BLOG_PATH + '/:blogSlug'
    },
    PROFILE: {
        INDEX: ADMIN_PATH + PROFILE_PATH,
        MY_COURSE: ADMIN_PATH + PROFILE_PATH + "/my-course",
        MY_PAYMENT: ADMIN_PATH + PROFILE_PATH + "/my-payment"
    },
    USERS: ADMIN_PATH + "/users",
}

export default PATHS_ADMIN