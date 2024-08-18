import Navbar from "./navbar";
import Sidebar from "./sidecomp";
import HealthCard from "./patient_data";
import ProfileCard2 from "./data2";
import DiagnosticList from "./diagnosis";
import LabResults from "./results";
const Home = () => {
  return (
    <>  <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-[48%]">
          <HealthCard />
          <DiagnosticList />
          </div>
          <div className="w-[23%]">
          <ProfileCard2 />
          <LabResults/>
          </div>
          </div>
      </div>
    </>
  );
};

export default Home;