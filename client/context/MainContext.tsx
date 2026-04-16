import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { useLocation } from 'react-router-dom';

interface MainContextValue {
    isShowNavbar: boolean;
    handleShowNavbar: (isShow: boolean) => void;
}

const MainContext = createContext<MainContextValue | undefined>(undefined);

interface MainContextProviderProps {
    children: ReactNode;
}

const MainContextProvider: React.FC<MainContextProviderProps> = ({ children }) => {
    const { pathname } = useLocation();
    const [isShowNavbar, setIsShowNavbar] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });

        setIsShowNavbar(false);
    }, [pathname]);

    const handleShowNavbar = (isShow: boolean) => {
        setIsShowNavbar(isShow);
    }

    return (
        <MainContext.Provider value={{ isShowNavbar, handleShowNavbar }}>
            {children}
        </MainContext.Provider>
    )
}

export default MainContextProvider;

export const useMainContext = () => {
    const context = useContext(MainContext);
    if (context === undefined) {
        throw new Error("useMainContext must be used within a MainContextProvider");
    }
    return context;
};
