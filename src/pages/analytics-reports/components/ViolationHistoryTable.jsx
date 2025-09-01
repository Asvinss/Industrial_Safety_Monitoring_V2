import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ViolationHistoryTable = ({ data, loading = false }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockData = [
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
    },
    {
      id: 'V-003',
      timestamp: '2025-08-31 15:18:45',
      camera: 'CAM-001',
      location: 'Loading Dock',
      violationType: 'Fire/Smoke',
      severity: 'Critical',
      description: 'Smoke detected in storage area - immediate evacuation required',
      thumbnail: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
      aiConfidence: 96.1,
      status: 'Resolved'
    },
    {
      id: 'V-004',
      timestamp: '2025-08-31 14:56:32',
      camera: 'CAM-005',
      location: 'Production Floor',
      violationType: 'PPE Violation',
      severity: 'Medium',
      description: 'Missing safety gloves while operating machinery',
      thumbnail: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      aiConfidence: 89.3,
      status: 'Acknowledged'
    },
    {
      id: 'V-005',
      timestamp: '2025-08-31 14:23:17',
      camera: 'CAM-002',
      location: 'Warehouse B',
      violationType: 'Restricted Area',
      severity: 'Low',
      description: 'Unauthorized personnel in restricted zone',
      thumbnail: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      aiConfidence: 87.5,
      status: 'Resolved'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-accent bg-accent/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'text-success bg-success/10';
      case 'under investigation': return 'text-warning bg-warning/10';
      case 'acknowledged': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    const dataToSort = data || mockData;
    if (!Array.isArray(dataToSort)) {
      return [];
    }
    
    return [...dataToSort]?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, mockData, sortField, sortDirection]);

  const totalPages = Math.ceil((sortedData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = React.useMemo(() => {
    return sortedData?.slice(startIndex, startIndex + itemsPerPage) || [];
  }, [sortedData, startIndex, itemsPerPage]);

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <Icon 
          name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
          size={14} 
        />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-48"></div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Violation History</h3>
          <div className="text-sm text-muted-foreground">
            {sortedData?.length} total violations
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <SortableHeader field="timestamp">Timestamp</SortableHeader>
              <SortableHeader field="camera">Camera</SortableHeader>
              <SortableHeader field="violationType">Type</SortableHeader>
              <SortableHeader field="severity">Severity</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Thumbnail
              </th>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {Array.isArray(paginatedData) && paginatedData?.length > 0 ? (
              paginatedData?.map((violation) => (
                <tr key={violation?.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {violation?.timestamp && new Date(violation.timestamp)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {violation?.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{violation?.camera}</div>
                    <div className="text-xs text-muted-foreground">{violation?.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-foreground">{violation?.violationType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(violation?.severity)}`}>
                      {violation?.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground max-w-xs truncate" title={violation?.description}>
                      {violation?.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      AI Confidence: {violation?.aiConfidence}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={violation?.thumbnail}
                        alt={`Violation ${violation?.id} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(violation?.status)}`}>
                      {violation?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Eye">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Download">
                        Export
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-muted-foreground">
                  No violations found for the selected criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData?.length || 0)} of {sortedData?.length || 0} violations
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            >
              Previous
            </Button>
            <span className="text-sm text-foreground">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
              disabled={currentPage === (totalPages || 1)}
              iconName="ChevronRight"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationHistoryTable;