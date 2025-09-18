import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { staffService } from "@/services/api/staffService";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [staffData, patientsData] = await Promise.all([
        staffService.getAll(),
        patientService.getAll()
      ]);
      
      setStaff(staffData);
      setPatients(patientsData);
    } catch (err) {
      setError("Failed to load staff data");
      toast.error("Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Enrich staff with patient names
  const enrichedStaff = staff.map(member => {
    const assignedPatientNames = member.assignedPatients?.map(patientId => {
      const patient = patients.find(p => p.Id === patientId);
      return patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${patientId}`;
    }) || [];

    // Get today's schedule status
    const today = format(new Date(), "yyyy-MM-dd");
    const todaySchedule = member.schedule?.find(s => s.date === today);
    const currentStatus = todaySchedule?.status || "off duty";

    return {
      ...member,
      assignedPatientNames,
      currentStatus
    };
  });

  const filteredStaff = enrichedStaff.filter(member => {
    const matchesSearch = searchTerm === "" || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || 
      member.role.toLowerCase() === filterRole.toLowerCase();

    const matchesStatus = filterStatus === "all" || 
      member.currentStatus.toLowerCase().replace(" ", "") === filterStatus.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStaffClick = (member) => {
    toast.info(`Opening staff profile for ${member.name}`);
  };

  const handleAddStaff = () => {
    toast.success("Opening new staff member form");
  };

  const handleAssignPatient = (staffId) => {
    const member = staff.find(s => s.Id === staffId);
    toast.info(`Assigning patient to ${member.name}`);
  };

  const handleUpdateSchedule = (staffId) => {
    const member = staff.find(s => s.Id === staffId);
    toast.info(`Updating schedule for ${member.name}`);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const roleCounts = {
    all: staff.length,
    doctor: staff.filter(s => s.role.toLowerCase() === "doctor").length,
    nurse: staff.filter(s => s.role.toLowerCase() === "nurse").length,
    technician: staff.filter(s => s.role.toLowerCase() === "technician").length,
    administrator: staff.filter(s => s.role.toLowerCase() === "administrator").length
  };

  const statusCounts = {
    all: staff.length,
    onduty: enrichedStaff.filter(s => s.currentStatus.toLowerCase().replace(" ", "") === "onduty").length,
    offduty: enrichedStaff.filter(s => s.currentStatus.toLowerCase().replace(" ", "") === "offduty").length,
    break: enrichedStaff.filter(s => s.currentStatus.toLowerCase() === "break").length,
    emergency: enrichedStaff.filter(s => s.currentStatus.toLowerCase() === "emergency").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital staff and schedules</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Download">
            Export List
          </Button>
          <Button variant="primary" icon="Plus" onClick={handleAddStaff}>
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar
            placeholder="Search by name, role, or department..."
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="form-input text-sm"
            >
              <option value="all">All Roles ({roleCounts.all})</option>
              <option value="doctor">Doctors ({roleCounts.doctor})</option>
              <option value="nurse">Nurses ({roleCounts.nurse})</option>
              <option value="technician">Technicians ({roleCounts.technician})</option>
              <option value="administrator">Administrators ({roleCounts.administrator})</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input text-sm"
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="onduty">On Duty ({statusCounts.onduty})</option>
              <option value="offduty">Off Duty ({statusCounts.offduty})</option>
              <option value="break">On Break ({statusCounts.break})</option>
              <option value="emergency">Emergency ({statusCounts.emergency})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">{statusCounts.onduty}</div>
          <div className="text-sm text-green-600">On Duty</div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-700">{statusCounts.offduty}</div>
          <div className="text-sm text-gray-600">Off Duty</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">{statusCounts.break}</div>
          <div className="text-sm text-yellow-600">On Break</div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-700">{statusCounts.emergency}</div>
          <div className="text-sm text-red-600">Emergency</div>
        </div>
      </div>

      {/* Staff Cards */}
      {filteredStaff.length === 0 ? (
        <Empty 
          type={searchTerm ? "search" : "staff"}
          action={searchTerm ? () => setSearchTerm("") : handleAddStaff}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <Card key={member.Id} hover onClick={() => handleStaffClick(member)} className="cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {member.name.split(" ").map(n => n.charAt(0)).join("").slice(0, 2)}
                  </div>

                  {/* Staff Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {member.name}
                      </h3>
                      <StatusBadge status={member.currentStatus} type="staff" />
                    </div>

                    <div className="space-y-1 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <ApperIcon name="Briefcase" className="h-4 w-4 mr-2" />
                        <span>{member.role}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <ApperIcon name="Building" className="h-4 w-4 mr-2" />
                        <span>{member.department}</span>
                      </div>

                      {member.contactInfo?.phone && (
                        <div className="flex items-center">
                          <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                          <span>{member.contactInfo.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center">
                        <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                        <span>{member.shift}</span>
                      </div>
                    </div>

                    {/* Assigned Patients */}
                    {member.assignedPatientNames && member.assignedPatientNames.length > 0 && (
                      <div className="border-t border-gray-100 pt-3 mb-4">
                        <div className="flex items-center mb-2">
                          <ApperIcon name="Users" className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            Assigned Patients ({member.assignedPatientNames.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.assignedPatientNames.slice(0, 2).map((patientName, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                            >
                              {patientName}
                            </span>
                          ))}
                          {member.assignedPatientNames.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              +{member.assignedPatientNames.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="UserPlus"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignPatient(member.Id);
                          }}
                        >
                          Assign
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Calendar"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateSchedule(member.Id);
                          }}
                        >
                          Schedule
                        </Button>
                      </div>

                      <div className="flex items-center text-xs text-gray-400">
                        <ApperIcon name="Mail" className="h-3 w-3 mr-1" />
                        <span>{member.contactInfo?.email?.split("@")[0] || "N/A"}</span>
                      </div>
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

export default Staff;