import SectionTitle from "../../Components/SectionTitle";
import Banner from "../../Components/Banner";

const Home = () => {
  return (
    <div>
      <div className="pt-10 pb-4  bg-fixed shadow-xl">
        <SectionTitle
          heading={"Make Smarter, Data-Driven Investment Decisions"}
        ></SectionTitle>
        <Banner></Banner>
      </div>
    </div>
  );
};

export default Home;
