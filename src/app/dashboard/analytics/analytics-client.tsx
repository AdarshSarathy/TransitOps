"use client";

import { Download, TrendingUp, Droplets, Receipt, Percent, FileText } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type VehicleStat = {
  id: string;
  registrationNumber: string;
  revenue: number;
  cost: number;
  roi: number;
};

type AnalyticsData = {
  totalOperationalCost: number;
  fuelEfficiency: string;
  averageROI: string;
  vehicleStats: VehicleStat[];
  costliestVehicles: VehicleStat[];
};

export function AnalyticsClient({
  analyticsData,
  fleetUtilization
}: {
  analyticsData: AnalyticsData;
  fleetUtilization: number;
}) {
  // Mock data for Monthly Revenue chart
  const monthlyRevenueData = [
    { name: "Jan", revenue: 400000 },
    { name: "Feb", revenue: 300000 },
    { name: "Mar", revenue: 550000 },
    { name: "Apr", revenue: 450000 },
    { name: "May", revenue: 600000 },
    { name: "Jun", revenue: Math.max(...analyticsData.vehicleStats.map(v => v.revenue), 700000) },
  ];

  // Data for Costliest Vehicles chart
  const costliestData = analyticsData.costliestVehicles.map(v => ({
    name: v.registrationNumber,
    cost: v.cost
  }));

  const handleDownloadCSV = () => {
    // 1. Prepare CSV headers and rows
    const headers = ["Registration Number", "Revenue (INR)", "Cost (INR)", "ROI (%)"];
    const rows = analyticsData.vehicleStats.map(v => 
      [v.registrationNumber, v.revenue, v.cost, v.roi]
    );

    // 2. Build CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 3. Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transitops_roi_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("TransitOps — Fleet ROI & Operational Cost Report", 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableColumn = ["Registration Number", "Revenue (INR)", "Cost (INR)", "ROI (%)"];
    const tableRows = analyticsData.vehicleStats.map(v => [
      v.registrationNumber,
      `Rs. ${v.revenue.toLocaleString()}`,
      `Rs. ${v.cost.toLocaleString()}`,
      `${v.roi}%`
    ]);

    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [212, 145, 10], textColor: 255 }, // TransitOps Gold
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save PDF
    doc.save(`transitops_roi_report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-10">
      
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics & ROI</h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            Performance metrics and financial overview
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white border-none shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex p-2 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Droplets className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fuel Efficiency</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">{analyticsData.fuelEfficiency}</span>
            <span className="text-sm font-medium text-[#6b7280]">km/L</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex p-2 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Percent className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fleet Utilization</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">{fleetUtilization}</span>
            <span className="text-sm font-medium text-[#6b7280]">%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex p-2 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Receipt className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operational Cost</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">₹{analyticsData.totalOperationalCost.toLocaleString()}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex p-2 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg. Vehicle ROI</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">{analyticsData.averageROI}</span>
            <span className="text-sm font-medium text-[#6b7280]">%</span>
          </div>
        </div>

      </div>

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Monthly Revenue (Mocked for Demo) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Monthly Revenue (Mock)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#1a1a2e' }}
                  contentStyle={{ backgroundColor: '#111119', borderColor: '#1e1e2e', borderRadius: '8px' }}
                  itemStyle={{ color: '#e0e0e0' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#d4910a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Costliest Vehicles */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Top Costliest Vehicles</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costliestData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#1a1a2e' }}
                  contentStyle={{ backgroundColor: '#111119', borderColor: '#1e1e2e', borderRadius: '8px' }}
                  itemStyle={{ color: '#e0e0e0' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Cost']}
                />
                <Bar dataKey="cost" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
