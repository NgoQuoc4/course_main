import { Outlet } from "react-router-dom"
import AuthModal from "@/features/auth/components/AuthModal"
import Footer from "@/components/Footer"
import Headers from "@/components/Header"
import Navbar from "@/components/Navbar"
import Overlay from "@/components/Overlay"
import PageLoading from "@/components/PageLoading"
// import HomePage from "../../pages/HomePage"

const MainLayout = () => {
    return (
        <>
            {/* <PageLoading /> */}
            <Headers />
            <Navbar />
            <Overlay />
            {/* main */}
            <Outlet />
            <Footer />
            <AuthModal />
        </>
    )
}

export default MainLayout