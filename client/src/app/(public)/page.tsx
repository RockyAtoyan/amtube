import ExploreVideos from "@/widgets/explore-videos/explore-videos";
import { TrendingSlider } from "@/widgets/trending-slider/trending-slider";

export default function Home() {
  return (
    <div>
      <TrendingSlider />
      <ExploreVideos />
    </div>
  );
}
