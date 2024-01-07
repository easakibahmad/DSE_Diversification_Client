import SectionTitle from "../../Components/SectionTitle";
import Banner from "../../Components/Banner";

const Home = () => {
  return (
    <div>
      <div className="mt-8  text-white">
        <div className="mb-3">
          <SectionTitle
            heading={"Make Smarter, Data-Driven Investment Decisions"}
          ></SectionTitle>
        </div>
        <Banner></Banner>
      </div>
    </div>
  );
};

export default Home;
