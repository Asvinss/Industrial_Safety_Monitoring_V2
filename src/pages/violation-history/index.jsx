import React, { useState, useEffect, useMemo } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ViolationFilters from './components/ViolationFilters';
import ViolationStats from './components/ViolationStats';
import ViolationTable from './components/ViolationTable';
import BulkActions from './components/BulkActions';
import ViolationDetailsModal from './components/ViolationDetailsModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ViolationHistory = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filters, setFilters] = useState({
    search: '',
    violationType: 'all',
    severity: 'all',
    status: 'all',
    cameraLocation: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Mock violation data
  const mockViolations = [
    {
      id: 'VIO-2025-001',
      timestamp: new Date('2025-08-31T15:45:00'),
      violationType: 'ppe_missing',
      severity: 'high',
      status: 'new',
      cameraLocation: 'Production Floor A',
      investigator: '',
      aiConfidence: 94,
      description: 'Worker detected without required safety helmet in high-risk production area. Individual was operating near heavy machinery without proper head protection.',
      notes: '',
      thumbnailUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-002',
      timestamp: new Date('2025-08-31T14:30:00'),
      violationType: 'fall_risk',
      severity: 'critical',
      status: 'investigating',
      cameraLocation: 'Warehouse North',
      investigator: 'Sarah Johnson',
      aiConfidence: 98,
      description: 'Employee working at height without proper fall protection equipment. Ladder positioned unsafely near edge of elevated platform.',
      notes: 'Initial investigation started. Safety officer dispatched to location. Worker has been temporarily reassigned.',
      thumbnailUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-003',
      timestamp: new Date('2025-08-31T13:15:00'),
      violationType: 'fire_hazard',
      severity: 'critical',
      status: 'resolved',
      cameraLocation: 'Chemical Storage',
      investigator: 'Mike Chen',
      aiConfidence: 96,
      description: 'Improper storage of flammable materials detected. Chemicals stored too close to heat source and electrical equipment.',
      notes: 'Immediate action taken. Materials relocated to proper storage area. Fire safety protocols reviewed with all staff. Additional training scheduled.',
      thumbnailUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-004',
      timestamp: new Date('2025-08-31T12:00:00'),
      violationType: 'smoke_detected',
      severity: 'medium',
      status: 'reviewed',
      cameraLocation: 'Loading Dock',
      investigator: 'Lisa Rodriguez',
      aiConfidence: 87,
      description: 'Smoke detected in loading dock area. Source identified as vehicle exhaust accumulation due to poor ventilation.',
      notes: 'Ventilation system inspected and repaired. Loading procedures updated to minimize vehicle idle time.',
      thumbnailUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-005',
      timestamp: new Date('2025-08-31T11:30:00'),
      violationType: 'restricted_area',
      severity: 'medium',
      status: 'investigating',
      cameraLocation: 'Maintenance Area',
      investigator: 'David Wilson',
      aiConfidence: 92,
      description: 'Unauthorized personnel detected in restricted maintenance area during active repair operations.',
      notes: 'Reviewing access logs and interviewing personnel. Additional security measures being considered.',
      thumbnailUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-006',
      timestamp: new Date('2025-08-31T10:45:00'),
      violationType: 'unsafe_behavior',
      severity: 'low',
      status: 'false_positive',
      cameraLocation: 'Production Floor B',
      investigator: 'John Smith',
      aiConfidence: 76,
      description: 'Potential unsafe lifting technique detected. Upon review, worker was following proper procedures.',
      notes: 'False positive confirmed after manual review. AI model confidence was below threshold. No action required.',
      thumbnailUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-007',
      timestamp: new Date('2025-08-31T09:20:00'),
      violationType: 'ppe_missing',
      severity: 'high',
      status: 'resolved',
      cameraLocation: 'Warehouse South',
      investigator: 'Sarah Johnson',
      aiConfidence: 91,
      description: 'Multiple workers detected without required safety gloves while handling chemical containers.',
      notes: 'Immediate corrective action taken. All workers provided with proper PPE. Additional safety briefing conducted.',
      thumbnailUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'VIO-2025-008',
      timestamp: new Date('2025-08-31T08:15:00'),
      violationType: 'fire_hazard',
      severity: 'medium',
      status: 'new',
      cameraLocation: 'Office Entrance',
      investigator: '',
      aiConfidence: 83,
      description: 'Blocked emergency exit detected. Storage materials improperly placed near fire exit door.',
      notes: '',
      thumbnailUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      fullImageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  // Mock user data
  const mockUser = {
    name: 'Safety Manager',
    email: 'manager@industrial-safety.com',
    role: 'Safety Supervisor',
    avatar: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastLogin: '2025-08-31 15:45:00'
  };

  // Initialize violations data
  useEffect(() => {
    setViolations(mockViolations);
  }, []);

  // Filter and sort violations
  const processedViolations = useMemo(() => {
    let filtered = violations?.filter(violation => {
      const matchesSearch = !filters?.search || 
        violation?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        violation?.cameraLocation?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        violation?.investigator?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        violation?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase());

      const matchesType = filters?.violationType === 'all' || violation?.violationType === filters?.violationType;
      const matchesSeverity = filters?.severity === 'all' || violation?.severity === filters?.severity;
      const matchesStatus = filters?.status === 'all' || violation?.status === filters?.status;
      const matchesLocation = filters?.cameraLocation === 'all' || violation?.cameraLocation === filters?.cameraLocation;

      const matchesDateFrom = !filters?.dateFrom || new Date(violation.timestamp) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters?.dateTo || new Date(violation.timestamp) <= new Date(filters.dateTo + 'T23:59:59');

      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesLocation && matchesDateFrom && matchesDateTo;
    });

    // Sort violations
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'timestamp') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [violations, filters, sortConfig]);

  useEffect(() => {
    setFilteredViolations(processedViolations);
  }, [processedViolations]);

  // Calculate alert count for navigation
  const alertCount = violations?.filter(v => v?.status === 'new')?.length;

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedViolations([]); // Clear selection when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      violationType: 'all',
      severity: 'all',
      status: 'all',
      cameraLocation: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setSelectedViolations([]);
  };

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedViolations(newSelection);
  };

  const handleStatusUpdate = (violationId, updates) => {
    setViolations(prev => prev?.map(violation => 
      violation?.id === violationId 
        ? { ...violation, ...updates }
        : violation
    ));
  };

  const handleBulkStatusUpdate = (status) => {
    setViolations(prev => prev?.map(violation => 
      selectedViolations?.includes(violation?.id)
        ? { ...violation, status }
        : violation
    ));
    setSelectedViolations([]);
  };

  const handleBulkAssign = (investigator) => {
    setViolations(prev => prev?.map(violation => 
      selectedViolations?.includes(violation?.id)
        ? { ...violation, investigator }
        : violation
    ));
    setSelectedViolations([]);
  };

  const handleBulkExport = (format) => {
    console.log(`Exporting ${selectedViolations?.length} violations as ${format}`);
    // Implementation for bulk export
    setSelectedViolations([]);
  };

  const handleViewDetails = (violation) => {
    setSelectedViolation(violation);
    setIsModalOpen(true);
  };

  const handleExportAll = (format) => {
    console.log(`Exporting all ${filteredViolations?.length} violations as ${format}`);
    // Implementation for export all
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        user={mockUser} 
        alertCount={alertCount}
        onNavigate={() => {}}
      />
      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <BreadcrumbNavigation 
            customBreadcrumbs={[
              { label: 'Dashboard', href: '/' },
              { label: 'Safety Monitoring', href: '/safety' },
              { label: 'Violation History', href: '/violations', current: true }
            ]}
          />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Violations</h1>
              <p className="text-muted-foreground">
                Review and manage historical safety incidents with detailed tracking and investigation tools
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => handleExportAll('pdf')}
                iconName="FileText"
                iconPosition="left"
              >
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportAll('excel')}
                iconName="FileSpreadsheet"
                iconPosition="left"
              >
                Export Excel
              </Button>
              <Button
                onClick={() => window.location?.reload()}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Statistics Overview */}
          <ViolationStats 
            violations={filteredViolations} 
            filters={filters}
          />

          {/* Filters */}
          <ViolationFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Showing {filteredViolations?.length} of {violations?.length} violations
              </span>
              {selectedViolations?.length > 0 && (
                <span className="text-sm font-medium text-accent">
                  {selectedViolations?.length} selected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Sort by: {sortConfig?.key} ({sortConfig?.direction})
              </span>
            </div>
          </div>

          {/* Violations Table */}
          <ViolationTable
            violations={filteredViolations}
            selectedViolations={selectedViolations}
            onSelectionChange={handleSelectionChange}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={handleViewDetails}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedViolations?.length}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkExport={handleBulkExport}
            onBulkAssign={handleBulkAssign}
          />

          {/* Violation Details Modal */}
          <ViolationDetailsModal
            violation={selectedViolation}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedViolation(null);
            }}
            onStatusUpdate={handleStatusUpdate}
            onNotesUpdate={(violationId, notes) => {
              setViolations(prev => prev?.map(violation => 
                violation?.id === violationId 
                  ? { ...violation, notes }
                  : violation
              ));
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ViolationHistory;