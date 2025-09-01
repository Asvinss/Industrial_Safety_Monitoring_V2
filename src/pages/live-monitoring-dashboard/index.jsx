import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import CameraFeed from './components/CameraFeed';
import ViolationAlertsPanel from './components/ViolationAlertsPanel';
import SafetyMetricsPanel from './components/SafetyMetricsPanel';
import CameraGridControls from './components/CameraGridControls';
import Icon from '../../components/AppIcon';


const LiveMonitoringDashboard = () => {
  const [selectedCameras, setSelectedCameras] = useState(['cam-001', 'cam-002', 'cam-003', 'cam-004']);
  const [gridSize, setGridSize] = useState('2x2');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenCamera, setFullscreenCamera] = useState(null);
  const [alertFilter, setAlertFilter] = useState('all');

  // Mock data for cameras
  const availableCameras = [
    {
      id: 'cam-001',
      name: 'Production Line A',
      location: 'Manufacturing Floor - Zone 1',
      status: 'online',
      feedUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800',
      hasActiveViolation: true,
      availableModels: [
        { id: 'ppe', name: 'PPE Detection', accuracy: 94 },
        { id: 'fall', name: 'Fall Detection', accuracy: 89 },
        { id: 'fire', name: 'Fire Detection', accuracy: 97 }
      ],
      activeModels: ['ppe', 'fall']
    },
    {
      id: 'cam-002',
      name: 'Warehouse Entry',
      location: 'Warehouse - Main Entrance',
      status: 'online',
      feedUrl: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
      hasActiveViolation: false,
      availableModels: [
        { id: 'ppe', name: 'PPE Detection', accuracy: 94 },
        { id: 'unauthorized', name: 'Unauthorized Access', accuracy: 92 }
      ],
      activeModels: ['ppe', 'unauthorized']
    },
    {
      id: 'cam-003',
      name: 'Chemical Storage',
      location: 'Storage Area - Hazmat Zone',
      status: 'online',
      feedUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      hasActiveViolation: false,
      availableModels: [
        { id: 'ppe', name: 'PPE Detection', accuracy: 94 },
        { id: 'fire', name: 'Fire Detection', accuracy: 97 },
        { id: 'spill', name: 'Spill Detection', accuracy: 85 }
      ],
      activeModels: ['ppe', 'fire', 'spill']
    },
    {
      id: 'cam-004',
      name: 'Loading Dock',
      location: 'Shipping & Receiving',
      status: 'online',
      feedUrl: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=800',
      hasActiveViolation: false,
      availableModels: [
        { id: 'ppe', name: 'PPE Detection', accuracy: 94 },
        { id: 'fall', name: 'Fall Detection', accuracy: 89 }
      ],
      activeModels: ['ppe']
    },
    {
      id: 'cam-005',
      name: 'Assembly Line B',
      location: 'Manufacturing Floor - Zone 2',
      status: 'offline',
      feedUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=800',
      hasActiveViolation: false,
      availableModels: [
        { id: 'ppe', name: 'PPE Detection', accuracy: 94 },
        { id: 'fall', name: 'Fall Detection', accuracy: 89 }
      ],
      activeModels: []
    },
    {
      id: 'cam-006',
      name: 'Break Room',
      location: 'Employee Area - Level 2',
      status: 'maintenance',
      feedUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      hasActiveViolation: false,
      availableModels: [
        { id: 'ppe', name: 'PPE Detection', accuracy: 94 }
      ],
      activeModels: []
    }
  ];

  // Mock data for violations
  const violations = [
    {
      id: 'viol-001',
      type: 'Missing Hard Hat',
      severity: 'critical',
      description: 'Worker detected without required hard hat in high-risk zone',
      cameraId: 'cam-001',
      cameraName: 'Production Line A',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      thumbnail: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=200',
      acknowledged: false
    },
    {
      id: 'viol-002',
      type: 'Unauthorized Access',
      severity: 'high',
      description: 'Person detected in restricted area without proper clearance',
      cameraId: 'cam-002',
      cameraName: 'Warehouse Entry',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      thumbnail: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=200',
      acknowledged: false
    },
    {
      id: 'viol-003',
      type: 'Safety Vest Missing',
      severity: 'medium',
      description: 'Employee working without high-visibility safety vest',
      cameraId: 'cam-004',
      cameraName: 'Loading Dock',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      thumbnail: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=200',
      acknowledged: true
    },
    {
      id: 'viol-004',
      type: 'Slip Hazard',
      severity: 'medium',
      description: 'Liquid spill detected on factory floor creating slip hazard',
      cameraId: 'cam-003',
      cameraName: 'Chemical Storage',
      timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
      thumbnail: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200',
      acknowledged: true
    },
    {
      id: 'viol-005',
      type: 'Equipment Malfunction',
      severity: 'low',
      description: 'Safety sensor showing irregular readings on conveyor belt',
      cameraId: 'cam-001',
      cameraName: 'Production Line A',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      thumbnail: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=200',
      acknowledged: true
    }
  ];

  // Mock data for safety metrics
  const safetyMetrics = [
    {
      id: 'metric-001',
      type: 'violations',
      title: 'Active Violations',
      subtitle: 'Requiring immediate attention',
      value: violations?.filter(v => !v?.acknowledged)?.length,
      change: '+12%',
      trend: 'up',
      icon: 'AlertTriangle',
      percentage: 85
    },
    {
      id: 'metric-002',
      type: 'compliance',
      title: 'Compliance Rate',
      subtitle: 'Overall safety compliance',
      value: 94,
      change: '+2%',
      trend: 'up',
      icon: 'Shield',
      percentage: 94
    },
    {
      id: 'metric-003',
      type: 'cameras',
      title: 'Active Cameras',
      subtitle: 'Currently monitoring',
      value: availableCameras?.filter(c => c?.status === 'online')?.length,
      change: '0%',
      trend: 'stable',
      icon: 'Camera'
    },
    {
      id: 'metric-004',
      type: 'alerts',
      title: 'Alerts Today',
      subtitle: 'Total safety alerts',
      value: violations?.length,
      change: '+8%',
      trend: 'up',
      icon: 'Bell'
    }
  ];

  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@industrial-safety.com',
    role: 'Safety Supervisor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&h=150',
    lastLogin: '2025-08-31 15:45:00'
  };

  const getGridColumns = () => {
    switch (gridSize) {
      case '3x3': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case '4x4': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const getMaxCameras = () => {
    switch (gridSize) {
      case '3x3': return 9;
      case '4x4': return 16;
      default: return 4;
    }
  };

  const displayedCameras = availableCameras?.filter(camera => selectedCameras?.includes(camera?.id))?.slice(0, getMaxCameras());

  const handleModelToggle = (cameraId, modelId, enabled) => {
    // In a real app, this would update the camera configuration
    console.log(`Camera ${cameraId}: ${enabled ? 'Enable' : 'Disable'} model ${modelId}`);
  };

  const handleFullscreen = (cameraId) => {
    if (fullscreenCamera === cameraId) {
      setFullscreenCamera(null);
      setIsFullscreen(false);
    } else {
      setFullscreenCamera(cameraId);
      setIsFullscreen(true);
    }
  };

  const handleViolationClick = (violation) => {
    console.log('Violation clicked:', violation);
    // In a real app, this would open a detailed violation view
  };

  const handleAcknowledgeAll = () => {
    console.log('Acknowledging all violations');
    // In a real app, this would update violation status
  };

  const handleRefreshFeeds = () => {
    console.log('Refreshing camera feeds');
    // In a real app, this would refresh the camera connections
  };

  const alertCount = violations?.filter(v => !v?.acknowledged)?.length;

  useEffect(() => {
    // Auto-refresh violations every 30 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing violations...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        user={user} 
        alertCount={alertCount}
        onNavigate={() => {}}
      />
      <main className="pt-[60px]">
        <div className="container mx-auto px-4 py-6">
          <BreadcrumbNavigation 
            customBreadcrumbs={[]}
          />
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Live Safety Monitoring
            </h1>
            <p className="text-muted-foreground">
              Real-time industrial safety monitoring with AI-powered violation detection
            </p>
          </div>

          {/* Safety Metrics Panel */}
          <SafetyMetricsPanel metrics={safetyMetrics} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Camera Feeds Section */}
            <div className="xl:col-span-3">
              <CameraGridControls
                selectedCameras={selectedCameras}
                onCameraSelectionChange={setSelectedCameras}
                gridSize={gridSize}
                onGridSizeChange={setGridSize}
                isFullscreen={isFullscreen}
                onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
                availableCameras={availableCameras}
                onRefreshFeeds={handleRefreshFeeds}
              />

              {/* Camera Grid */}
              {isFullscreen && fullscreenCamera ? (
                <div className="bg-card border border-border rounded-lg p-4">
                  <CameraFeed
                    camera={availableCameras?.find(c => c?.id === fullscreenCamera)}
                    onModelToggle={handleModelToggle}
                    onFullscreen={handleFullscreen}
                    isFullscreen={true}
                  />
                </div>
              ) : (
                <div className={`grid ${getGridColumns()} gap-4`}>
                  {displayedCameras?.map((camera) => (
                    <CameraFeed
                      key={camera?.id}
                      camera={camera}
                      onModelToggle={handleModelToggle}
                      onFullscreen={handleFullscreen}
                      isFullscreen={false}
                    />
                  ))}
                </div>
              )}

              {displayedCameras?.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="Camera" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Cameras Selected
                    </h3>
                    <p className="text-sm">
                      Select cameras from the dropdown above to start monitoring
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Violation Alerts Panel */}
            <div className="xl:col-span-1">
              <ViolationAlertsPanel
                violations={violations}
                onViolationClick={handleViolationClick}
                onAcknowledgeAll={handleAcknowledgeAll}
                onFilterChange={setAlertFilter}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveMonitoringDashboard;