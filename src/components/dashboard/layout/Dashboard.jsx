"use client";
import MetricsManage from "../pages/Dashboard/MetricsManage";
import MyGoogleMap from "../pages/Dashboard/MyGoogleMap";

function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-[65%]">
        <MyGoogleMap />
      </div>
      <div className="w-full lg:w-[35%]">
        <MetricsManage />
      </div>
    </div>
  );
}
export default Dashboard;
