import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationHeader from '../../components/ui/NavigationHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import CameraListPanel from './components/CameraListPanel';
import CameraConfigPanel from './components/CameraConfigPanel';
import CameraActionToolbar from './components/CameraActionToolbar';
import AddCameraModal from './components/AddCameraModal';

const CameraManagement = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alertCount] = useState(12);

  const mockUser = {
    name: 'Safety Manager',
    email: 'manager@industrial-safety.com',
    role: 'Safety Supervisor',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    lastLogin: '2025-08-31 15:45:00'
  };

  const mockCameras = [
    {
      id: 'cam_001',
      name: 'Main Entrance Camera',
      location: 'Building A - Main Entrance',
      ipAddress: '192.168.1.101',
      port: '554',
      username: 'admin',
      password: '••••••••',
      resolution: '1920x1080',
      frameRate: '30',
      status: 'online',
      thumbnail: 'https://picsum.photos/400/300?random=1',
      livePreview: 'https://picsum.photos/800/600?random=1',
      aiModels: ['ppe_detection', 'fall_detection'],
      createdAt: '2025-08-15T10:30:00Z',
      lastModified: '2025-08-31T14:20:00Z'
    },
    {
      id: 'cam_002',
      name: 'Production Floor Camera 1',
      location: 'Building B - Production Floor',
      ipAddress: '192.168.1.102',
      port: '554',
      username: 'admin',
      password: '••••••••',
      resolution: '2560x1440',
      frameRate: '30',
      status: 'online',
      thumbnail: 'https://picsum.photos/400/300?random=2',
      livePreview: 'https://picsum.photos/800/600?random=2',
      aiModels: ['ppe_detection', 'fire_smoke_detection', 'restricted_area'],
      createdAt: '2025-08-10T09:15:00Z',
      lastModified: '2025-08-30T16:45:00Z'
    },
    {
      id: 'cam_003',
      name: 'Warehouse Loading Dock',
      location: 'Building C - Loading Dock',
      ipAddress: '192.168.1.103',
      port: '554',
      username: 'admin',
      password: '••••••••',
      resolution: '1920x1080',
      frameRate: '24',
      status: 'offline',
      thumbnail: 'https://picsum.photos/400/300?random=3',
      livePreview: 'https://picsum.photos/800/600?random=3',
      aiModels: ['fall_detection', 'vehicle_detection'],
      createdAt: '2025-08-05T14:22:00Z',
      lastModified: '2025-08-29T11:30:00Z'
    },
    {
      id: 'cam_004',
      name: 'Emergency Exit Monitor',
      location: 'Building A - Emergency Exit',
      ipAddress: '192.168.1.104',
      port: '554',
      username: 'admin',
      password: '••••••••',
      resolution: '1280x720',
      frameRate: '30',
      status: 'maintenance',
      thumbnail: 'https://picsum.photos/400/300?random=4',
      livePreview: 'https://picsum.photos/800/600?random=4',
      aiModels: ['crowd_detection', 'restricted_area'],
      createdAt: '2025-07-28T08:45:00Z',
      lastModified: '2025-08-31T09:15:00Z'
    },
    {
      id: 'cam_005',
      name: 'Chemical Storage Area',
      location: 'Building D - Chemical Storage',
      ipAddress: '192.168.1.105',
      port: '554',
      username: 'admin',
      password: '••••••••',
      resolution: '1920x1080',
      frameRate: '30',
      status: 'online',
      thumbnail: 'https://picsum.photos/400/300?random=5',
      livePreview: 'https://picsum.photos/800/600?random=5',
      aiModels: ['ppe_detection', 'fire_smoke_detection'],
      createdAt: '2025-08-20T13:10:00Z',
      lastModified: '2025-08-31T15:20:00Z'
    },
    {
      id: 'cam_006',
      name: 'Cafeteria Monitoring',
      location: 'Building A - Cafeteria',
      ipAddress: '192.168.1.106',
      port: '554',
      username: 'admin',
      password: '••••••••',
      resolution: '1920x1080',
      frameRate: '15',
      status: 'online',
      thumbnail: 'https://picsum.photos/400/300?random=6',
      livePreview: 'https://picsum.photos/800/600?random=6',
      aiModels: ['crowd_detection'],
      createdAt: '2025-08-12T11:25:00Z',
      lastModified: '2025-08-30T14:40:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading cameras from API
    const loadCameras = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCameras(mockCameras);
      setSelectedCamera(mockCameras?.[0]);
    };

    loadCameras();
  }, []);

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  const handleCameraAdd = (newCamera) => {
    setCameras(prev => [...prev, newCamera]);
    setSelectedCamera(newCamera);
    setIsAddModalOpen(false);
  };

  const handleCameraUpdate = (updatedCamera) => {
    setCameras(prev => 
      prev?.map(camera => 
        camera?.id === updatedCamera?.id ? updatedCamera : camera
      )
    );
    setSelectedCamera(updatedCamera);
  };

  const handleCameraDelete = (cameraId) => {
    setCameras(prev => prev?.filter(camera => camera?.id !== cameraId));
    if (selectedCamera?.id === cameraId) {
      const remainingCameras = cameras?.filter(camera => camera?.id !== cameraId);
      setSelectedCamera(remainingCameras?.length > 0 ? remainingCameras?.[0] : null);
    }
  };

  const handleBulkOperation = (operationId) => {
    console.log('Bulk operation:', operationId);
    // Handle bulk operations like enable_all, disable_all, etc.
    switch (operationId) {
      case 'enable_all':
        setCameras(prev => prev?.map(camera => ({ ...camera, status: 'online' })));
        break;
      case 'disable_all':
        setCameras(prev => prev?.map(camera => ({ ...camera, status: 'offline' })));
        break;
      case 'restart_all':
        // Simulate restart process
        setCameras(prev => prev?.map(camera => ({ ...camera, status: 'maintenance' })));
        setTimeout(() => {
          setCameras(prev => prev?.map(camera => ({ ...camera, status: 'online' })));
        }, 3000);
        break;
      case 'export_config':
        // Simulate config export
        const config = JSON.stringify(cameras, null, 2);
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `camera-config-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
        a?.click();
        URL.revokeObjectURL(url);
        break;
      default:
        break;
    }
  };

  const handleRefresh = () => {
    // Simulate refresh
    console.log('Refreshing camera data...');
  };

  const handleExport = () => {
    // Simulate export
    console.log('Exporting camera data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Camera Management - Industrial Safety Monitor</title>
        <meta name="description" content="Configure camera infrastructure and assign AI detection models for industrial safety monitoring" />
      </Helmet>

      <NavigationHeader 
        user={mockUser} 
        alertCount={alertCount} 
        onNavigate={() => {}} // Add this required prop
      />
      
      <div className="pt-[60px]">
        <div className="p-6">
          <BreadcrumbNavigation 
            customBreadcrumbs={[]} // Add this required prop
          />
          
          <div className="space-y-6">
            <CameraActionToolbar
              cameras={cameras}
              onBulkOperation={handleBulkOperation}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            <div className="flex h-[calc(100vh-200px)] bg-card rounded-lg border border-border overflow-hidden">
              {/* Left Panel - Camera List */}
              <div className="w-full md:w-[30%] border-r border-border">
                <CameraListPanel
                  cameras={cameras}
                  selectedCamera={selectedCamera}
                  onCameraSelect={handleCameraSelect}
                  onCameraAdd={() => setIsAddModalOpen(true)}
                  onCameraDelete={handleCameraDelete}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>

              {/* Right Panel - Camera Configuration */}
              <div className="hidden md:block w-[70%]">
                <CameraConfigPanel
                  camera={selectedCamera}
                  onCameraUpdate={handleCameraUpdate}
                  onCameraDelete={handleCameraDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCameraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCameraAdd={handleCameraAdd}
      />
    </div>
  );
};

export default CameraManagement;