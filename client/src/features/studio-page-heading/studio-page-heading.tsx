import { ReactNode } from "react";

const StudioPageHeading = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-xl font-semibold mb-5">{children}</h2>;
};

export default StudioPageHeading;
