import { HEADER_Z_INDEX } from "./ui/constants";
import Header from "./ui/header/header";
import Main from "./ui/main";
import Sidebar from "./ui/sidebar/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <div
        className="relative flex-1 pt-[4rem] overflow-y-auto"
        style={{
          zIndex: HEADER_Z_INDEX + 1,
        }}
      >
        <Header />
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default MainLayout;
