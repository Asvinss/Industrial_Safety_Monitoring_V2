import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import ProfileInformationTab from './components/ProfileInformationTab';
import NotificationPreferencesTab from './components/NotificationPreferencesTab';
import SecuritySettingsTab from './components/SecuritySettingsTab';
import SystemConfigurationTab from './components/SystemConfigurationTab';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [alertCount] = useState(7);

  // Mock user data
  const [user] = useState({
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@industrial-safety.com',
    phone: '+1 (555) 123-4567',
    role: 'Senior Safety Manager',
    department: 'Safety Operations',
    employeeId: 'EMP-2024-0892',
    location: 'Manufacturing Plant A',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    lastLogin: '2025-08-31 15:45:00',
    userRole: 'admin'
  });

  // Mock preferences data
  const [preferences] = useState({
    violationAlerts: {
      ppeViolation: true,
      fallDetection: true,
      fireDetection: true,
      unauthorizedAccess: true,
      equipmentMalfunction: false
    },
    deliveryMethods: {
      email: true,
      sms: false,
      inApp: true,
      desktop: true
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '06:00'
    },
    reportSchedule: {
      daily: false,
      weekly: true,
      monthly: true
    }
  });

  // Mock security settings
  const [securitySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    allowMultipleSessions: false
  });

  // Mock system configuration
  const [systemConfig] = useState({
    defaultAIModel: 'yolo-v8-safety',
    cameraTimeout: 30,
    alertThreshold: 'medium',
    autoArchive: true,
    archiveDays: 90,
    reportTemplate: 'standard',
    dataRetention: 365,
    systemMaintenance: {
      autoUpdates: true,
      maintenanceWindow: '02:00-04:00',
      backupFrequency: 'daily'
    }
  });

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: 'User',
      description: 'Personal details and account information'
    },
    {
      id: 'notifications',
      label: 'Notification Preferences',
      icon: 'Bell',
      description: 'Alert settings and delivery methods'
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: 'Shield',
      description: 'Two-factor authentication and login security'
    },
    {
      id: 'system',
      label: 'System Configuration',
      icon: 'Settings',
      description: 'AI models and system defaults (Admin only)',
      adminOnly: true
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSaveProfile = (profileData) => {
    console.log('Saving profile data:', profileData);
    // Handle profile save
  };

  const handleSaveNotifications = (notificationData) => {
    console.log('Saving notification preferences:', notificationData);
    // Handle notification preferences save
  };

  const handleSaveSecurity = (securityData) => {
    console.log('Saving security settings:', securityData);
    // Handle security settings save
  };

  const handleSaveSystemConfig = (configData) => {
    console.log('Saving system configuration:', configData);
    // Handle system configuration save
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInformationTab
            user={user}
            onSave={handleSaveProfile}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferencesTab
            preferences={preferences}
            onSave={handleSaveNotifications}
          />
        );
      case 'security':
        return (
          <SecuritySettingsTab
            securitySettings={securitySettings}
            onSave={handleSaveSecurity}
          />
        );
      case 'system':
        return (
          <SystemConfigurationTab
            systemConfig={systemConfig}
            userRole={user?.userRole}
            onSave={handleSaveSystemConfig}
          />
        );
      default:
        return null;
    }
  };

  const filteredTabs = tabs?.filter(tab => 
    !tab?.adminOnly || (tab?.adminOnly && (user?.userRole === 'admin' || user?.userRole === 'system_administrator'))
  );

  useEffect(() => {
    document.title = 'User Profile & Settings - Industrial Safety Monitor';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        user={user} 
        alertCount={alertCount} 
        onNavigate={handleNavigation}
      />
      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <BreadcrumbNavigation 
            customBreadcrumbs={[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'User Profile & Settings', path: '/profile-settings' }
            ]}
          />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Profile & Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account preferences, notifications, and security settings
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <nav className="space-y-2">
                  {filteredTabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                        w-full flex items-start space-x-3 p-4 rounded-lg text-left transition-all duration-150
                        ${activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon name={tab?.icon} size={20} className="mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium">{tab?.label}</div>
                        <div className={`text-xs mt-1 ${
                          activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {tab?.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Mobile/Tablet Tab Navigation */}
            <div className="lg:hidden col-span-1">
              <div className="flex overflow-x-auto space-x-2 pb-4 mb-6">
                {filteredTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-150
                      ${activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted bg-card border border-border'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="text-sm font-medium">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg">
                {/* Tab Header - Mobile/Tablet Only */}
                <div className="lg:hidden p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={filteredTabs?.find(tab => tab?.id === activeTab)?.icon} 
                      size={20} 
                      className="text-primary" 
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {filteredTabs?.find(tab => tab?.id === activeTab)?.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredTabs?.find(tab => tab?.id === activeTab)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileSettings;