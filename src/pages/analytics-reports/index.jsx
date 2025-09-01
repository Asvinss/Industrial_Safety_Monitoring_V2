import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import MetricsCard from './components/MetricsCard';
import DateRangeSelector from './components/DateRangeSelector';
import ViolationTrendChart from './components/ViolationTrendChart';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';
import CameraPerformanceChart from './components/CameraPerformanceChart';
import HeatMapChart from './components/HeatMapChart';
import FilterPanel from './components/FilterPanel';
import ViolationHistoryTable from './components/ViolationHistoryTable';
import ExportToolbar from './components/ExportToolbar';

const AnalyticsReports = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    violationTypes: [],
    severityLevels: [],
    cameraLocations: [],
    shiftPatterns: []
  });

  // Mock user data
  const currentUser = {
    name: 'Safety Manager',
    email: 'manager@industrial-safety.com',
    role: 'Safety Supervisor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    lastLogin: '2025-08-31 15:45:00'
  };

  // Mock metrics data
  const metricsData = [
    {
      title: 'Total Violations',
      value: '1,247',
      change: -12.5,
      changeType: 'positive',
      icon: 'AlertTriangle',
      description: 'Total safety violations detected across all cameras in the selected period'
    },
    {
      title: 'Compliance Score',
      value: '94.2%',
      change: 3.8,
      changeType: 'positive',
      icon: 'Shield',
      description: 'Overall safety compliance rating based on violation frequency and severity'
    },
    {
      title: 'Critical Incidents',
      value: '23',
      change: -45.2,
      changeType: 'positive',
      icon: 'Zap',
      description: 'High-severity violations requiring immediate attention and response'
    },
    {
      title: 'Camera Uptime',
      value: '98.7%',
      change: 1.2,
      changeType: 'positive',
      icon: 'Camera',
      description: 'Average operational uptime across all monitoring cameras'
    },
    {
      title: 'Response Time',
      value: '2.3 min',
      change: -18.7,
      changeType: 'positive',
      icon: 'Clock',
      description: 'Average time from violation detection to initial response'
    },
    {
      title: 'AI Accuracy',
      value: '96.1%',
      change: 2.4,
      changeType: 'positive',
      icon: 'Brain',
      description: 'Machine learning model accuracy in violation detection and classification'
    }
  ];

  // Add mock data for charts and components
  const mockViolationTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Violations',
      data: [65, 59, 80, 81, 56, 55]
    }]
  };

  const mockCategoryData = {
    labels: ['PPE Violations', 'Safety Zone', 'Equipment Misuse'],
    datasets: [{
      data: [300, 150, 100]
    }]
  };

  const mockCameraData = {
    cameras: ['Camera 1', 'Camera 2', 'Camera 3'],
    performance: [95, 87, 92]
  };

  const mockHeatMapData = {
    zones: [
      { id: 1, name: 'Zone A', violations: 45 },
      { id: 2, name: 'Zone B', violations: 23 }
    ]
  };

  const mockViolationHistoryData = [
    {
      id: 'V-001',
      timestamp: '2025-08-31 15:45:23',
      camera: 'CAM-003',
      location: 'Production Floor',
      violationType: 'PPE Violation',
      severity: 'High',
      description: 'Worker without safety helmet detected in restricted area',
      thumbnail: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      aiConfidence: 94.2,
      status: 'Resolved'
    },
    {
      id: 'V-002',
      timestamp: '2025-08-31 15:32:11',
      camera: 'CAM-007',
      location: 'Warehouse A',
      violationType: 'Fall Detection',
      severity: 'Critical',
      description: 'Person fall detected near loading dock area',
      thumbnail: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      aiConfidence: 98.7,
      status: 'Under Investigation'
    }
  ];

  const mockBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Reports', href: '/analytics/reports', current: true }
  ];

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    setFilters({ ...filters, dateRange: range });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Trigger data refresh based on filters
    console.log('Filters updated:', newFilters);
  };

  const handleExport = (type) => {
    setLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting ${type} report with current filters:`, filters);
      
      // Mock download trigger
      const fileName = `safety-report-${new Date()?.toISOString()?.split('T')?.[0]}.${type}`;
      console.log(`Downloaded: ${fileName}`);
      
      setLoading(false);
    }, 2000);
  };

  const handleToggleFilterPanel = () => {
    setIsFilterPanelCollapsed(!isFilterPanelCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        user={currentUser} 
        alertCount={23} 
        onNavigate={handleNavigate}
      />
      <div className="pt-[60px] flex h-screen">
        {/* Filter Sidebar */}
        <FilterPanel
          isCollapsed={isFilterPanelCollapsed}
          onToggleCollapse={handleToggleFilterPanel}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <BreadcrumbNavigation customBreadcrumbs={mockBreadcrumbs} />
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive safety data visualization and compliance reporting
                </p>
              </div>
              
              <DateRangeSelector
                selectedRange={selectedDateRange}
                onRangeChange={handleDateRangeChange}
                customRange={customDateRange}
                onCustomRangeChange={setCustomDateRange}
              />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  description={metric?.description}
                  loading={loading}
                />
              ))}
            </div>

            {/* Export Toolbar */}
            <ExportToolbar onExport={handleExport} loading={loading} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <ViolationTrendChart loading={loading} data={mockViolationTrendData} />
              </div>
              
              <CategoryBreakdownChart loading={loading} data={mockCategoryData} />
              <CameraPerformanceChart loading={loading} data={mockCameraData} />
              
              <div className="lg:col-span-2">
                <HeatMapChart loading={loading} data={mockHeatMapData} />
              </div>
            </div>

            {/* Violation History Table */}
            <ViolationHistoryTable loading={loading} data={mockViolationHistoryData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;