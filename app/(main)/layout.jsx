import SupportChat from "@/components/SupportChat";


const MainLayout = ({ children }) => {
    return <div className="pt-10">{children}
        <SupportChat />
    </div>
};

export default MainLayout;