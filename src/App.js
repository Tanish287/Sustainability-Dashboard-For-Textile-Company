import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Bell, Filter, RefreshCw, Download, ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, Building, Zap, Droplets, Trash2, Wind } from 'lucide-react';

// Mock data for the dashboard
const mockKPIData = {
  energy: { current: 1500, unit: 'kWh', status: 'On Track', target: 1200, trend: 5.2 },
  water: { current: 12000, unit: 'L', status: 'On Track', target: 11000, trend: -2.1 },
  waste: { current: 300, unit: 'kg', status: 'Over Limit', target: 250, trend: 8.7 },
  emissions: { current: 150, unit: 'gCO2', status: 'On Track', target: 140, trend: -1.3 }
};

const mockTrendData = [
  { month: 'Jan', energy: 1400, water: 11500, waste: 280, emissions: 145 },
  { month: 'Feb', energy: 1350, water: 11200, waste: 290, emissions: 148 },
  { month: 'Mar', energy: 1450, water: 11800, waste: 310, emissions: 152 },
  { month: 'Apr', energy: 1500, water: 12000, waste: 300, emissions: 150 },
];

const mockDepartmentData = [
  { name: 'Dyeing', value: 35 },
  { name: 'Weaving', value: 28 },
  { name: 'Finishing', value: 22 },
  { name: 'Quality Control', value: 15 }
];

const mockHotspotData = [
  { location: 'Line A', usage: 850 },
  { location: 'Line B', usage: 720 },
  { location: 'Line C', usage: 680 },
  { location: 'Line D', usage: 780 },
  { location: 'Line E', usage: 920 },
  { location: 'Line F', usage: 640 }
];

const mockAlerts = [
  { id: 1, type: 'warning', title: 'High Energy Consumption', message: '75% above limit', severity: 'high', time: '2 hours ago' },
  { id: 2, type: 'info', title: 'Maintenance Scheduled', message: 'Next week', severity: 'low', time: '1 day ago' },
  { id: 3, type: 'warning', title: 'Policy Update', message: 'New Guidelines', severity: 'medium', time: '3 hours ago' }
];

const radarData = [
  { metric: 'Energy', current: 85, target: 100 },
  { metric: 'Water', current: 92, target: 100 },
  { metric: 'Waste', current: 70, target: 100 },
  { metric: 'Emissions', current: 88, target: 100 }
];

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

const SustainabilityDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: 'today',
    unit: 'all',
    department: 'all',
    machine: 'all',
    shift: 'all'
  });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refreshData = () => {
    setLastRefresh(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-100';
      case 'Over Limit': return 'text-red-600 bg-red-100';
      case 'Warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const KPITile = ({ icon: Icon, title, data, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(title.toLowerCase())}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{data.current}</span>
        <span className="text-sm text-gray-500 ml-1">{data.unit}</span>
      </div>
      <div className="flex items-center mt-2">
        {data.trend > 0 ? (
          <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${data.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {Math.abs(data.trend)}%
        </span>
        <span className="text-gray-500 text-sm ml-1">vs target</span>
      </div>
    </div>
  );

  const OverallPerformanceTile = ({ onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick('overall')}
    >
      <div className="flex items-center justify-between mb-4">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
          On Track
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall Performance</h3>
      <div className="text-3xl font-bold text-gray-900 mb-4">85%</div>
      <ResponsiveContainer width="100%" height={120}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} />
          <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );

  const AlertsPanel = () => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Bell className="w-5 h-5 mr-2" />
        Critical Alerts
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="flex-shrink-0 mt-1">
              {alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{alert.title}</p>
              <p className="text-sm text-gray-600">{alert.message}</p>
              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FilterBar = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center space-x-4 flex-wrap">
        <Filter className="w-5 h-5 text-gray-600" />
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.timeRange}
          onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.unit}
          onChange={(e) => setFilters({...filters, unit: e.target.value})}
        >
          <option value="all">All Units</option>
          <option value="unit1">Unit 1</option>
          <option value="unit2">Unit 2</option>
        </select>
        <select 
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.department}
          onChange={(e) => setFilters({...filters, department: e.target.value})}
        >
          <option value="all">All Departments</option>
          <option value="dyeing">Dyeing</option>
          <option value="weaving">Weaving</option>
          <option value="finishing">Finishing</option>
        </select>
      </div>
    </div>
  );

  const InsightsPage = ({ kpi }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{kpi} Trend Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey={kpi} 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 capitalize">{kpi} by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockDepartmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockDepartmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Hotspot Identification */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Hotspot Identification</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockHotspotData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Impact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600">Estimated Savings</h4>
                <div className="text-2xl font-bold text-green-600">$2000</div>
                <div className="text-sm text-green-600">+$500</div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Cost of Initiatives</h4>
                <div className="text-2xl font-bold text-blue-600">$1500</div>
                <div className="text-sm text-blue-600">-$300</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AlertsPanel />
          
          {/* Goal Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Target</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Quarterly Target</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardHome = () => (
    <div className="space-y-6">
      <FilterBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <KPITile 
              icon={Zap} 
              title="Energy" 
              data={mockKPIData.energy} 
              onClick={(kpi) => {
                setSelectedKPI(kpi);
                setCurrentView('insights');
              }}
            />
            <KPITile 
              icon={Droplets} 
              title="Water" 
              data={mockKPIData.water} 
              onClick={(kpi) => {
                setSelectedKPI(kpi);
                setCurrentView('insights');
              }}
            />
            <KPITile 
              icon={Trash2} 
              title="Waste" 
              data={mockKPIData.waste} 
              onClick={(kpi) => {
                setSelectedKPI(kpi);
                setCurrentView('insights');
              }}
            />
            <KPITile 
              icon={Wind} 
              title="Emissions" 
              data={mockKPIData.emissions} 
              onClick={(kpi) => {
                setSelectedKPI(kpi);
                setCurrentView('insights');
              }}
            />
            <div className="md:col-span-2 xl:col-span-2">
              <OverallPerformanceTile 
                onClick={(type) => {
                  setSelectedKPI(type);
                  setCurrentView('insights');
                }}
              />
            </div>
          </div>
        </div>
        
        <div>
          <AlertsPanel />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-lg font-medium text-gray-900">My Company</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className="text-gray-600 hover:text-gray-900"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="text-gray-600 hover:text-gray-900 relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {mockAlerts.some(alert => alert.severity === 'high') && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </button>
              <button className="text-gray-600 hover:text-gray-900" title="Reports">
                <Download className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardHome />}
        {currentView === 'insights' && <InsightsPage kpi={selectedKPI} />}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>© 2025 Sustainability Inc.</span>
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Last refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-sm text-gray-600">
        Last refreshed: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SustainabilityDashboard;