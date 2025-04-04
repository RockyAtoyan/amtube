import Header from "./ui/header";
import Main from "./ui/main";
import Sidebar from "./ui/sidebar/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default MainLayout;
