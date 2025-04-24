import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

type SidebarContextType = {
    sidebarPosition: 'left' | 'right';
    toggleSidebarPosition: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: JSX.Element }) => {
    const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>(() => {
    const storedPosition = window.localStorage.getItem("sidebar-position");
    return storedPosition === "left" || storedPosition === "right" ? storedPosition : "right";
    });

    const toggleSidebarPosition = () => {
        setSidebarPosition((prev) => {
            const newPosition = prev === "right" ? "left" : "right";
            window.localStorage.setItem("sidebar-position", newPosition);
            return newPosition;
        });
    };

    return (
        <SidebarContext.Provider value={{ sidebarPosition, toggleSidebarPosition }}>
            {children}
        </SidebarContext.Provider>
    );
};

SidebarProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within a SidebarProvider')
    }
    return context
}