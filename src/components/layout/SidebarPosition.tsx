import { createContext, useContext, useState } from "react";

type SidebarContextType = {
    sidebarPosition: 'left' | 'right';
    toggleSidebarPosition: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('right');

    const toggleSidebarPosition = () => {
        setSidebarPosition((prev) => (prev === 'right' ? 'left' : 'right'));
    };

    return (
        <SidebarContext.Provider value={{ sidebarPosition, toggleSidebarPosition }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within a SidebarProvider')
    }
    return context
}