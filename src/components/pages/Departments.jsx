import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { departmentService } from "@/services/api/departmentService";
import { staffService } from "@/services/api/staffService";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [departmentsData, staffData, patientsData] = await Promise.all([
        departmentService.getAll(),
        staffService.getAll(),
        patientService.getAll()
      ]);
      
      setDepartments(departmentsData);
      setStaff(staffData);
      setPatients(patientsData);
    } catch (err) {
      setError("Failed to load department data");
      toast.error("Failed to load department data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Enrich departments with staff and patient data
  const enrichedDepartments = departments.map(dept => {
    const departmentStaff = staff.filter(s => s.department === dept.name);
    const departmentPatients = patients.filter(p => {
      // Assuming room numbers indicate department (e.g., ICU-101, ER-205)
      return p.assignedRoom?.startsWith(dept.name.substring(0, 3).toUpperCase());
    });

    const occupancyRate = dept.totalBeds > 0 ? (dept.occupiedBeds / dept.totalBeds) * 100 : 0;
    const availableBeds = dept.totalBeds - dept.occupiedBeds;
    
    const staffOnDuty = departmentStaff.filter(s => {
      const today = new Date().toISOString().split('T')[0];
      return s.schedule?.some(schedule => 
        schedule.date === today && schedule.status === "on duty"
      );
    }).length;

    return {
      ...dept,
      departmentStaff,
      departmentPatients,
      occupancyRate: occupancyRate.toFixed(1),
      availableBeds,
      staffOnDuty,
      totalStaff: departmentStaff.length
    };
  });

  const filteredDepartments = enrichedDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDepartmentClick = (dept) => {
    toast.info(`Opening department details for ${dept.name}`);
  };

  const handleAddDepartment = () => {
    toast.success("Opening new department form");
  };

  const handleManageBeds = (deptId) => {
    const dept = departments.find(d => d.Id === deptId);
    toast.info(`Managing beds for ${dept.name}`);
  };

  const handleManageStaff = (deptId) => {
    const dept = departments.find(d => d.Id === deptId);
    toast.info(`Managing staff for ${dept.name}`);
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "from-red-500 to-red-600";
    if (rate >= 70) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getOccupancyBadgeColor = (rate) => {
    if (rate >= 90) return "bg-red-100 text-red-800 border-red-200";
    if (rate >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate overall statistics
  const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
  const totalOccupied = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
  const overallOccupancy = totalBeds > 0 ? ((totalOccupied / totalBeds) * 100).toFixed(1) : 0;
  const totalStaffOnDuty = enrichedDepartments.reduce((sum, dept) => sum + dept.staffOnDuty, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital departments and resources</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
          <Button variant="primary" icon="Plus" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar
            placeholder="Search departments..."
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary-700">{departments.length}</div>
              <div className="text-sm text-primary-600">Total Departments</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-700">{totalBeds}</div>
              <div className="text-sm text-blue-600">Total Beds</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bed" className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-700">{overallOccupancy}%</div>
              <div className="text-sm text-green-600">Overall Occupancy</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-700">{totalStaffOnDuty}</div>
              <div className="text-sm text-purple-600">Staff on Duty</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      {filteredDepartments.length === 0 ? (
        <Empty 
          type={searchTerm ? "search" : "departments"}
          action={searchTerm ? () => setSearchTerm("") : handleAddDepartment}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.Id} hover onClick={() => handleDepartmentClick(dept)} className="cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getOccupancyColor(dept.occupancyRate)} rounded-lg flex items-center justify-center mr-3`}>
                      <ApperIcon name="Building" className="h-5 w-5 text-white" />
                    </div>
                    {dept.name}
                  </CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getOccupancyBadgeColor(dept.occupancyRate)}`}>
                    {dept.occupancyRate}% occupied
                  </span>
                </div>
              </CardHeader>

              <CardBody>
                <div className="space-y-4">
                  {/* Bed Statistics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{dept.totalBeds}</div>
                      <div className="text-sm text-gray-500">Total Beds</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{dept.occupiedBeds}</div>
                      <div className="text-sm text-red-500">Occupied</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dept.availableBeds}</div>
                      <div className="text-sm text-green-500">Available</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Bed Occupancy</span>
                      <span>{dept.occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getOccupancyColor(dept.occupancyRate)}`}
                        style={{ width: `${dept.occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Staff Information */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                      <span>Staff: {dept.staffOnDuty}/{dept.totalStaff} on duty</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="UserCheck" className="h-4 w-4 mr-2" />
                      <span>{dept.departmentPatients.length} patients</span>
                    </div>
                  </div>

                  {/* Equipment List */}
                  {dept.equipment && dept.equipment.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center mb-2">
                        <ApperIcon name="Wrench" className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Equipment</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dept.equipment.slice(0, 3).map((equipment, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            {equipment}
                          </span>
                        ))}
                        {dept.equipment.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            +{dept.equipment.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Bed"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManageBeds(dept.Id);
                        }}
                      >
                        Manage Beds
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Users"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManageStaff(dept.Id);
                        }}
                      >
                        Staff
                      </Button>
                    </div>

                    <div className="text-xs text-gray-400">
                      Updated 1h ago
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;