import Articles from "@/components/templates/index/Articles/Articles";
import Banner from "@/components/templates/index/Banner/Banner";
import Latest from "@/components/templates/index/Latest/Latest";
import Promote from "@/components/templates/index/Promote/Promote";

export default async function Home() {
  return (
    <>
      <Banner />
      <Latest />
      <Promote />
      <Articles />
    </>
  );
}
