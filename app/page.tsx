import { Hero } from "@/components/hero";
import { FeaturedProperties } from "@/components/featured-properties";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 items-center mt-20">
      <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
        <Hero />
        <FeaturedProperties />
      </div>
    </div>
  );
}
