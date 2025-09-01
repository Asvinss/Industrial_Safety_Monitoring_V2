import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddCameraModal = ({ isOpen, onClose, onCameraAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ipAddress: '',
    port: '554',
    username: '',
    password: '',
    resolution: '1920x1080',
    frameRate: '30',
    aiModels: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const availableAIModels = [
    {
      id: 'ppe_detection',
      name: 'PPE Detection',
      description: 'Detects hard hats, safety vests, and protective equipment',
      icon: 'Shield'
    },
    {
      id: 'fall_detection',
      name: 'Fall Detection',
      description: 'Identifies worker falls and unsafe positioning',
      icon: 'AlertTriangle'
    },
    {
      id: 'fire_smoke_detection',
      name: 'Fire & Smoke Detection',
      description: 'Monitors for fire hazards and smoke presence',
      icon: 'Flame'
    },
    {
      id: 'restricted_area',
      name: 'Restricted Area Monitoring',
      description: 'Alerts when personnel enter prohibited zones',
      icon: 'Ban'
    }
  ];

  const resolutionOptions = [
    '640x480', '1280x720', '1920x1080', '2560x1440', '3840x2160'
  ];

  const frameRateOptions = ['15', '24', '30', '60'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAIModelToggle = (modelId, checked) => {
    const updatedModels = checked
      ? [...formData?.aiModels, modelId]
      : formData?.aiModels?.filter(id => id !== modelId);
    
    handleInputChange('aiModels', updatedModels);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData?.name?.trim()) newErrors.name = 'Camera name is required';
      if (!formData?.location?.trim()) newErrors.location = 'Location is required';
      if (!formData?.ipAddress?.trim()) {
        newErrors.ipAddress = 'IP address is required';
      } else if (!/^(\d{1,3}\.){3}\d{1,3}$/?.test(formData?.ipAddress)) {
        newErrors.ipAddress = 'Invalid IP address format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep(1)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCamera = {
        id: `cam_${Date.now()}`,
        ...formData,
        status: 'offline',
        thumbnail: `https://picsum.photos/400/300?random=${Date.now()}`,
        livePreview: `https://picsum.photos/800/600?random=${Date.now()}`,
        createdAt: new Date()?.toISOString(),
        lastModified: new Date()?.toISOString()
      };
      
      onCameraAdd(newCamera);
      handleClose();
    } catch (error) {
      console.error('Error adding camera:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      location: '',
      ipAddress: '',
      port: '554',
      username: '',
      password: '',
      resolution: '1920x1080',
      frameRate: '30',
      aiModels: []
    });
    setErrors({});
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card border border-border rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Camera" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Add New Camera</h2>
              <p className="text-sm text-muted-foreground">
                Configure a new camera for safety monitoring
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Basic Info</span>
            </div>
            
            <div className="flex-1 h-px bg-border" />
            
            <div className={`flex items-center space-x-2 ${
              currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">AI Models</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Camera Name"
                    type="text"
                    value={formData?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    placeholder="e.g., Main Entrance Camera"
                    error={errors?.name}
                    required
                  />
                  
                  <Input
                    label="Location"
                    type="text"
                    value={formData?.location}
                    onChange={(e) => handleInputChange('location', e?.target?.value)}
                    placeholder="e.g., Building A - Floor 1"
                    error={errors?.location}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="IP Address"
                    type="text"
                    value={formData?.ipAddress}
                    onChange={(e) => handleInputChange('ipAddress', e?.target?.value)}
                    placeholder="192.168.1.100"
                    error={errors?.ipAddress}
                    required
                  />
                  
                  <Input
                    label="Port"
                    type="number"
                    value={formData?.port}
                    onChange={(e) => handleInputChange('port', e?.target?.value)}
                    placeholder="554"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    type="text"
                    value={formData?.username}
                    onChange={(e) => handleInputChange('username', e?.target?.value)}
                    placeholder="Camera username"
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    placeholder="Camera password"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Resolution
                    </label>
                    <select
                      value={formData?.resolution}
                      onChange={(e) => handleInputChange('resolution', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {resolutionOptions?.map(resolution => (
                        <option key={resolution} value={resolution}>
                          {resolution}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Frame Rate
                    </label>
                    <select
                      value={formData?.frameRate}
                      onChange={(e) => handleInputChange('frameRate', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {frameRateOptions?.map(rate => (
                        <option key={rate} value={rate}>
                          {rate} fps
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">AI Detection Models</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the AI models to enable for this camera. You can modify these settings later.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {availableAIModels?.map((model) => (
                    <div key={model?.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={formData?.aiModels?.includes(model?.id)}
                          onChange={(e) => handleAIModelToggle(model?.id, e?.target?.checked)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name={model?.icon} size={16} className="text-primary" />
                            <h4 className="text-sm font-medium text-foreground">
                              {model?.name}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {model?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
              >
                Cancel
              </Button>
              
              {currentStep < 2 ? (
                <Button
                  type="button"
                  variant="default"
                  onClick={handleNext}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="default"
                  loading={isSubmitting}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Camera
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCameraModal;