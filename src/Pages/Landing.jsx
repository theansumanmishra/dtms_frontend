import LandingForm from "../Components/LandingPage/LandingPage";
import LandingFooter from "../Layouts/LandingFooter";
import Navbar from "../Layouts/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <LandingForm />
      <LandingFooter />
    </>
  );
};

export default LandingPage;
