import PublicHeader from "@/layouts/main-layout/ui/public-header/public-header";
import PublicSidebar from "@/layouts/main-layout/ui/public-sidebar/public-sidebar";
import { HEADER_Z_INDEX } from "@/shared/lib/constants";
import Main from "@/shared/ui/main";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex">
      <PublicSidebar />
      <div
        id="appScrollContainer"
        className="relative flex-1 pt-[4rem] overflow-y-auto"
        style={{
          zIndex: +HEADER_Z_INDEX + 1,
        }}
      >
        <PublicHeader />
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default MainLayout;
