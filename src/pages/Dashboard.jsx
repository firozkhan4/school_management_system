import React, { useState } from 'react';
import {
  Users, UserSquare, Briefcase, Bell, DollarSign, Scale, Calendar, CheckCircle, Clock,
  Trello, AlertTriangle, MessageSquare, Menu
} from 'lucide-react';

// --- Mock Data ---
const mockSchoolName = "ABC International School Dashboard";
const mockMetrics = [
  { title: "Total Students", count: 1250, icon: Users, color: "bg-blue-500", detail: "Active enrollment" },
  { title: "Total Teachers", count: 85, icon: UserSquare, color: "bg-teal-500", detail: "Full-time faculty" },
  { title: "Non-Teaching Staff", count: 15, icon: Briefcase, color: "bg-purple-500", detail: "Admin & Support" },
];

const mockNotices = [
  { id: 1, title: "Half-Yearly Exam Schedule Released", date: "Nov 15, 2025", category: "Academics", icon: Bell, type: 'info' },
  { id: 2, title: "Mandatory Fire Drill Tomorrow", date: "Nov 17, 2025", category: "Safety", icon: AlertTriangle, type: 'warning' },
  { id: 3, title: "Parent-Teacher Meeting RSVP Deadline", date: "Nov 20, 2025", category: "Communication", icon: MessageSquare, type: 'info' },
  { id: 4, title: "Annual Day Practice Begins", date: "Nov 10, 2025", category: "Events", icon: Trello, type: 'success' },
];

const mockFinancials = {
  feesCollectionStatus: "95% Collected",
  feesDueAmount: "₹ 4,50,000",
  lastAccountState: "₹ 5,450,000",
  lastAuditDate: "Oct 15, 2025",
};

// --- Reusable Components ---

// 1. Metric Card Component
const MetricCard = ({ title, count, icon: Icon, color, detail }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition transform hover:shadow-xl hover:-translate-y-0.5 duration-200">
    <div className="flex-grow">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{count.toLocaleString()}</p>
      <p className="text-xs text-gray-400 mt-1">{detail}</p>
    </div>
    <div className={`p-3 ${color} rounded-full text-white shadow-md`}>
      <Icon size={28} />
    </div>
  </div>
);

// 2. Notice Item Component
const NoticeItem = ({ title, date, category, icon: Icon, type }) => {
  let categoryColor = 'text-gray-600 bg-gray-100';
  let iconColor = 'text-gray-500';

  if (type === 'info') {
    categoryColor = 'text-blue-600 bg-blue-100';
    iconColor = 'text-blue-500';
  } else if (type === 'warning') {
    categoryColor = 'text-red-600 bg-red-100';
    iconColor = 'text-red-500';
  } else if (type === 'success') {
    categoryColor = 'text-green-600 bg-green-100';
    iconColor = 'text-green-500';
  }

  return (
    <div className="flex items-start space-x-4 border-b border-gray-100 py-3 last:border-b-0">
      <div className={`p-2 rounded-full ${iconColor} bg-opacity-10`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition">{title}</p>
        <div className="flex items-center space-x-3 text-xs mt-1 text-gray-500">
          <span className="flex items-center">
            <Calendar size={12} className="mr-1" /> {date}
          </span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${categoryColor}`}>{category}</span>
        </div>
      </div>
    </div>
  );
};

// 3. Financial Status Component
const FinancialStatus = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${colorClass} text-white shadow-sm`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
    <p className={`text-lg font-bold ${colorClass.replace('bg-', 'text-')}`}>{value}</p>
  </div>
);


// --- Main App Component (Dashboard) ---
const Dashboard = () => {
  return (
    <div className="min-h-screen p-4 sm:p-8"
      style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', // Neutral light background
        fontFamily: 'Inter, sans-serif'
      }}
    >

      {/* Header and Title */}
      <header className="flex items-center justify-between border-b border-gray-300 pb-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Trello size={36} className="mr-3 text-blue-600" />
          {mockSchoolName}
        </h1>
        {/*   <button className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-100 transition lg:hidden"> */}
        {/*     <Menu size={24} /> */}
        {/*   </button> */}
      </header>

      {/* 1. Key Metrics Cards (Students, Teachers, Staff) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {mockMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </section>

      {/* 2. Main Dashboard Content (Notices and Financials) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Notices/Communication (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <Bell size={20} className="mr-2 text-red-500" /> Latest School Notices
            </h2>
            <div className="divide-y divide-gray-100">
              {mockNotices.map(notice => (
                <NoticeItem key={notice.id} {...notice} />
              ))}
              <div className="pt-4 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">View All Notices →</a>
              </div>
            </div>
          </div>

          {/* Additional space for charts/other metrics if needed */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-40 flex items-center justify-center text-gray-500">
            Enrollment Trend Chart Placeholder
          </div>
        </div>

        {/* Right Column: Fees and Account Status (1/3 width on desktop) */}
        <div className="lg:col-span-1 space-y-6">

          {/* Fees Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <DollarSign size={20} className="mr-2 text-green-600" /> Fees Status
            </h2>

            <div className="space-y-3">
              <FinancialStatus
                title="Collection Status"
                value={mockFinancials.feesCollectionStatus}
                icon={CheckCircle}
                colorClass="bg-green-500"
                subtitle="of total expected fees"
              />
              <FinancialStatus
                title="Outstanding Balance"
                value={mockFinancials.feesDueAmount}
                icon={AlertTriangle}
                colorClass="bg-yellow-500"
                subtitle="Immediate attention required"
              />
            </div>
          </div>

          {/* Last Account State Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
              <Scale size={20} className="mr-2 text-indigo-600" /> Last Account State
            </h2>

            <FinancialStatus
              title="Current Account Balance"
              value={mockFinancials.lastAccountState}
              icon={DollarSign}
              colorClass="bg-indigo-500"
              subtitle="Net funds available"
            />
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
              <span>Last Audit Date:</span>
              <span className="font-semibold text-gray-700 flex items-center"><Clock size={14} className="mr-1" /> {mockFinancials.lastAuditDate}</span>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
};

export default Dashboard;
