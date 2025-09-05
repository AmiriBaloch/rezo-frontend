import { useState, useEffect } from "react";
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

const DashboardStatCard = ({ title, value, change, moutian, stroke, data }) => {
  return (
    <div className="bg-white shadow-md rounded-sm w-full md:w-[200px] p-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[#282828] font-semibold text-sm">{title}</h3>
        <span className="flex gap-0.5 text-[#282828] font-semibold text-xs">
          <i className={`bi ${change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
          {Math.abs(change)}%
        </span>
      </div>
      <h2 className="text-[#282828] font-semibold text-[22px]">{value}</h2>

      <ResponsiveContainer width="100%" height={120}>
        <ComposedChart data={data}>
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

const MetricsManage = () => {
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState("7");
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for different time periods
  const [metricsData, setMetricsData] = useState({
    customers: { value: 0, change: 0, data: [] },
    orders: { value: 0, change: 0, data: [] },
    income: { value: 0, change: 0, data: [] },
    expenses: { value: 0, change: 0, data: [] },
  });

  // Mock data for ongoing and upcoming bookings
  const [bookings, setBookings] = useState({
    ongoing: [],
    upcoming: []
  });

  // Generate random data based on time period
  const generateData = (period) => {
    const days = parseInt(period);
    const dataPoints = days === 7 ? 7 : days === 30 ? 4 : 12; // Weekly, monthly, quarterly

    const generateRandomData = () => {
      return Array.from({ length: dataPoints }, (_, i) => {
        const baseValue = Math.floor(Math.random() * 100) + 10;
        const dayValue = days === 7 ? i : days === 30 ? i * 7 : i * (days / dataPoints);
        return {
          name: days === 7 ? ["S", "M", "T", "W", "T", "F", "S"][i] :
            `Week ${i + 1}`,
          value: baseValue + Math.floor(Math.random() * 20)
        };
      });
    };

    const calculateChange = (data) => {
      if (data.length < 2) return 0;
      const first = data[0].value;
      const last = data[data.length - 1].value;
      return Math.round(((last - first) / first) * 100);
    };

    const customerData = generateRandomData();
    const orderData = generateRandomData();
    const incomeData = generateRandomData();
    const expenseData = generateRandomData();

    setMetricsData({
      customers: {
        value: customerData.reduce((sum, item) => sum + item.value, 0),
        change: calculateChange(customerData),
        data: customerData
      },
      orders: {
        value: orderData.reduce((sum, item) => sum + item.value, 0),
        change: calculateChange(orderData),
        data: orderData
      },
      income: {
        value: incomeData.reduce((sum, item) => sum + item.value, 0),
        change: calculateChange(incomeData),
        data: incomeData.map(item => ({ ...item, value: item.value * 10 }))
      },
      expenses: {
        value: expenseData.reduce((sum, item) => sum + item.value, 0),
        change: calculateChange(expenseData),
        data: expenseData.map(item => ({ ...item, value: item.value * 5 }))
      }
    });
  };

  // Generate mock booking data
  const generateBookings = () => {
    const statuses = ["In Use", "Completed", "Cancelled"];
    const mockBookings = Array.from({ length: 5 }, (_, i) => ({
      id: `0000${i + 10}`,
      address: `${["North", "South", "East", "West"][i % 4]}park Road`,
      license: `B${1000 + i}ABC`,
      customer: ["Chris", "Alex", "Taylor", "Jordan", "Morgan"][i],
      phone: `08123456${70 + i}`,
      date: new Date(Date.now() + (i * 86400000)).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: i < 2 ? "In Use" : "Upcoming",
      avatar: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
    }));

    setBookings({
      ongoing: mockBookings.filter(b => b.status === "In Use"),
      upcoming: mockBookings.filter(b => b.status === "Upcoming")
    });
  };

  // Simulate API call
  useEffect(() => {
    setIsLoading(true);

    // Simulate network delay
    const timer = setTimeout(() => {
      generateData(timePeriod);
      generateBookings();
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [timePeriod]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-[20px] p-4">
      {/* Metrics Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-[22px] font-bold text-primary">Metrics</h2>
        <div className="relative inline-block">
          <select
            className="bg-white text-[#282828] text-xs p-2 pr-8 rounded-sm focus:outline-none border border-gray-200"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="7">Past 7 days</option>
            <option value="30">Past 30 days</option>
            <option value="90">Past 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-row md:flex-col gap-3 w-full">
          <div className="flex flex-col- gap-3 w-full">
            <DashboardStatCard
              title="Customers"
              value={metricsData.customers.value}
              change={metricsData.customers.change}
              moutian="#EEFAFD"
              stroke="#57CAEB"
              data={metricsData.customers.data}
            />
            <DashboardStatCard
              title="Orders"
              value={metricsData.orders.value}
              change={metricsData.orders.change}
              moutian="#FFF2F1"
              stroke="#FA7976"
              data={metricsData.orders.data}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-[20px] w-full">
            <DashboardStatCard
              title="Income"
              value={formatCurrency(metricsData.income.value)}
              change={metricsData.income.change}
              moutian="#F0E8F9"
              stroke="#6418C3"
              data={metricsData.income.data}
            />
            <DashboardStatCard
              title="Expenses"
              value={formatCurrency(metricsData.expenses.value)}
              change={metricsData.expenses.change}
              moutian="#EFFBF8"
              stroke="#5DDAB4"
              data={metricsData.expenses.data}
            />
          </div>
        </div>
      </div>

      {/*** Manage Section */}
      <div className="bg-white shadow-[0px 10px 60px 0px #E2ECF980] rounded-md p-[15px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[18px] font-bold text-primary ">Manage</h2>
          <button className="text-xs font-semibold text-[#282828] hover:text-primary">
            See All
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200">
          <button
            className={`w-1/2 text-[#282828] text-sm text-center font-normal py-2 ${activeTab === "ongoing" ? "border-b border-primary" : ""
              }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`w-1/2 text-[#282828] text-sm text-center font-normal py-2 ${activeTab === "upcoming" ? "border-b border-primary" : ""
              }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Next 5 Days
          </button>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-3">
            {(activeTab === "ongoing" ? bookings.ongoing : bookings.upcoming).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 border-sm border-[#C2C2C2] rounded-md p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-[#757575] text-sm font-normal">{booking.id}</h4>
                  <h4 className={`text-white rounded-md text-xs font-semibold py-o.5 px-2 ${booking.status === "In Use" ? "bg-[#22B07D]" : "bg-[#FFA500]"
                    }`}>
                    {booking.status}
                  </h4>
                </div>
                <div>
                  <h4 className="text-black text-xs font-semibold">
                    {booking.address}
                  </h4>
                  <h4 className="text-[#282828] rounded-sm text-xs font-normal leading-[30px]">
                    {booking.license}
                  </h4>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.avatar}
                      alt="Customer"
                      className="w-[38px] h-[38px] border-primary border-sm rounded-full"
                    />
                    <h4 className="text-[#282828] rounded-sm text-sm font-normal">
                      {booking.customer}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bi bi-telephone text-[22px] text-f3"></i>
                    <h4 className="text-[#282828] rounded-sm text-xs font-normal">
                      {booking.phone}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="bi bi-calendar3 text-[22px] text-f3"></i>
                    <h4 className="text-[#282828] rounded-sm text-xs font-normal">
                      {booking.date}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default MetricsManage;