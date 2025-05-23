import StudioHeader from "@/layouts/studio-layout/ui/studio-header/studio-header";
import StudioSidebar from "@/layouts/studio-layout/ui/studio-sidebar/studio-sidebar";
import { HEADER_Z_INDEX } from "@/shared/lib/constants";
import Main from "@/shared/ui/main";

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex">
      <StudioSidebar />
      <div
        id="appScrollContainer"
        className="relative flex-1 mt-[4rem] overflow-y-auto"
        style={{
          zIndex: +HEADER_Z_INDEX + 1,
        }}
      >
        <StudioHeader />
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default StudioLayout;
