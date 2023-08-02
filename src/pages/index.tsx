import { useSelector } from "react-redux";
import Hero from "../components/Hero";
import Sale from "../components/Sale";
import ContactUs from "./ContactUs";

function Home() {
  const { isUserDataExists } = useSelector((state: any) => state?.wallet);
  return (
    <div className="home">
      <Hero />
      {isUserDataExists ? <Sale /> : <ContactUs />}
    </div>
  );
}

export default Home;
