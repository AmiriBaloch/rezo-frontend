import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Dashboard data
const dashboardData = {
  images: [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1742&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1678752717095-08cd0bd1d7e7?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1740&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1740&auto=format&fit=crop",
  ],
  stats: [
    { title: "Monthly Earnings", value: "20", moutian: "#EEFAFD", stroke: "#57CAEB" },
    { title: "Expense", value: "50", moutian: "#FFF2F1", stroke: "#FA7976" },
    { title: "Income", value: "$2000", moutian: "#F0E8F9", stroke: "#6418C3" },
    { title: "Adjustments", value: "$425", moutian: "#EFFBF8", stroke: "#5DDAB4" }
  ],
  chartData: [
    { name: "Sun", value: 10 },
    { name: "Mon", value: 20 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 40 },
    { name: "Thu", value: 35 },
    { name: "Fri", value: 50 },
    { name: "Sat", value: 25 },
  ]
};

const StatCard = ({ title, value, moutian, stroke }) => {
  return (
    <div className="w-full p-3">
      <h3 className="text-[#282828] font-semibold text-[14px]">{title}</h3>
      <h2 className="text-[#282828] font-semibold text-[22px]">{value}</h2>

      <ResponsiveContainer width="100%" height={120}>
        <ComposedChart data={dashboardData.chartData}>
          <XAxis
            height={10}
            dataKey="name"
            tick={{ fontSize: 10 }}
            axisLine={false}
          />
          <YAxis
            width={20}
            dataKey="value"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="none" fill={moutian} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomNextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 w-[45px] h-[45px] rounded-full shadow-lg hover:bg-gray-200 transition focus:outline-none"
      aria-label="Next image"
    >
      <i className="bi bi-arrow-right-circle-fill text-2xl text-[#16457E]"></i>
    </button>
  );
};

const CustomPrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2  w-[45px] h-[45px] rounded-full shadow-lg hover:bg-gray-200 transition focus:outline-none"
      aria-label="Previous image"
    >
      <i className="bi bi-arrow-left-circle-fill text-2xl text-[#16457E]"></i>
    </button>
  );
};

const TabMenu = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "property", label: "Property" },
    { id: "reports", label: "Reports" }
  ];

  return (
    <div className="flex items-center justify-between w-full md:w-[70%] absolute top-[5%] left-[50%] transform translate-x-[-50%] bg-[#596574] p-[10px] shadow-[0px 5px 15px 0px #FFC13B17] rounded-[5px]">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`text-[14px] ${activeTab === tab.id ? 'text-[#16457E]' : 'text-white'} font-medium pr-[10px] ${index !== tabs.length - 1 ? 'border-r-[1px] border-[#16457E]' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

function Earning() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  const exportToCSV = () => {
    // Prepare data for export
    const exportData = dashboardData.chartData.map(item => ({
      Day: item.name,
      Value: item.value
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ChartData");

    // Generate CSV and download
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'financial_report.csv');
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col gap-5">
      <div className="w-full flex flex-col lg:flex-row gap-5">
        {/* Image Slider Section */}
        <div className="w-full lg:w-[58%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-full relative">
          <Slider {...settings}>
            {dashboardData.images.map((src, index) => (
              <div className="w-full h-full" key={index}>
                <img
                  src={src}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>

          <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Stats Section */}
        <div className="w-full lg:w-[41%] h-full p-5 rounded-[10px] shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            {dashboardData.stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                moutian={stat.moutian}
                stroke={stat.stroke}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Report Generation Section */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 rounded-[5px]">
        <h2 className="text-[16px] font-medium mb-2 sm:mb-0">Generate Financial Report</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 text-[16px] text-[#CC4848] font-medium hover:text-[#a53a3a] transition px-3 py-1 rounded hover:bg-red-50"
        >
          <i className="bi bi-arrow-bar-down text-[22px]"></i>
          Export to CSV
        </button>
      </div>
    </div>
  );
}

export default Earning;