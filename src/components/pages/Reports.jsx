import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { staffService } from "@/services/api/staffService";
import { departmentService } from "@/services/api/departmentService";
import { toast } from "react-toastify";

const Reports = () => {
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    staff: [],
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patients, appointments, staff, departments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        departmentService.getAll()
      ]);

      setData({ patients, appointments, staff, departments });
    } catch (err) {
      setError("Failed to load reports data");
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateMetrics = () => {
    const { patients, appointments, staff, departments } = data;
    const now = new Date();
    
    // Date ranges
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    // Patient metrics
    const totalPatients = patients.length;
    const criticalPatients = patients.filter(p => p.currentStatus?.toLowerCase() === "critical").length;
    const admittedThisMonth = patients.filter(p => {
      if (!p.admissionDate) return false;
      const admissionDate = new Date(p.admissionDate);
      return admissionDate >= monthStart && admissionDate <= monthEnd;
    }).length;

    // Appointment metrics
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status?.toLowerCase() === "completed").length;
    const cancelledAppointments = appointments.filter(a => a.status?.toLowerCase() === "cancelled").length;
    const appointmentCompletionRate = totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0;

    // Staff metrics
    const totalStaff = staff.length;
    const doctorsCount = staff.filter(s => s.role?.toLowerCase() === "doctor").length;
    const nursesCount = staff.filter(s => s.role?.toLowerCase() === "nurse").length;

    // Department metrics
    const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
    const occupiedBeds = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
    const averageOccupancy = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

    // Patient status distribution
    const statusDistribution = {
      critical: patients.filter(p => p.currentStatus?.toLowerCase() === "critical").length,
      urgent: patients.filter(p => p.currentStatus?.toLowerCase() === "urgent").length,
      stable: patients.filter(p => p.currentStatus?.toLowerCase() === "stable").length,
      observation: patients.filter(p => p.currentStatus?.toLowerCase() === "observation").length,
      discharge: patients.filter(p => p.currentStatus?.toLowerCase() === "discharge").length
    };

    return {
      totalPatients,
      criticalPatients,
      admittedThisMonth,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      appointmentCompletionRate,
      totalStaff,
      doctorsCount,
      nursesCount,
      totalBeds,
      occupiedBeds,
      averageOccupancy,
      statusDistribution
    };
  };

  const handleExport = (type) => {
    toast.success(`Exporting ${type} report...`);
  };

  const handleGenerateReport = (reportType) => {
    toast.info(`Generating ${reportType} report...`);
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Hospital performance metrics and compliance reports</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-input"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" icon="Download">
            Export All
          </Button>
          <Button variant="primary" icon="FileText">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalPatients}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.admittedThisMonth} admitted this month
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Appointment Rate</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.appointmentCompletionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.completedAppointments}/{metrics.totalAppointments} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bed Occupancy</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.averageOccupancy}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.occupiedBeds}/{metrics.totalBeds} beds occupied
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bed" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Staff</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalStaff}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {metrics.doctorsCount} doctors, {metrics.nursesCount} nurses
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Status Distribution</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {Object.entries(metrics.statusDistribution).map(([status, count]) => {
                const percentage = metrics.totalPatients > 0 ? ((count / metrics.totalPatients) * 100).toFixed(1) : 0;
                const colorClasses = {
                  critical: "bg-red-500",
                  urgent: "bg-orange-500",
                  stable: "bg-green-500",
                  observation: "bg-blue-500",
                  discharge: "bg-purple-500"
                };

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded ${colorClasses[status]} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colorClasses[status]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { name: "Daily Census Report", icon: "FileText", description: "Current patient census and bed status" },
                { name: "Staff Scheduling Report", icon: "Calendar", description: "Staff assignments and shift coverage" },
                { name: "Appointment Summary", icon: "Clock", description: "Scheduled, completed, and cancelled appointments" },
                { name: "Department Utilization", icon: "Building", description: "Resource usage across departments" },
                { name: "Patient Discharge Summary", icon: "UserMinus", description: "Patients ready for discharge" },
                { name: "Emergency Metrics", icon: "AlertTriangle", description: "Critical patient alerts and response times" }
              ].map((report) => (
                <div
                  key={report.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleGenerateReport(report.name)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name={report.icon} className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.description}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(report.name);
                    }}
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Compliance Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Regulatory Reports</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "HIPAA Compliance",
                status: "Compliant",
                lastAudit: "2024-01-15",
                nextDue: "2024-04-15",
                statusColor: "text-green-600 bg-green-100"
              },
              {
                name: "Joint Commission",
                status: "Under Review",
                lastAudit: "2023-12-01",
                nextDue: "2024-03-01",
                statusColor: "text-yellow-600 bg-yellow-100"
              },
              {
                name: "CMS Quality Reporting",
                status: "Submitted",
                lastAudit: "2024-01-01",
                nextDue: "2024-07-01",
                statusColor: "text-blue-600 bg-blue-100"
              },
              {
                name: "State Health Department",
                status: "Action Required",
                lastAudit: "2023-11-15",
                nextDue: "2024-02-15",
                statusColor: "text-red-600 bg-red-100"
              },
              {
                name: "Fire Safety Inspection",
                status: "Compliant",
                lastAudit: "2024-01-10",
                nextDue: "2025-01-10",
                statusColor: "text-green-600 bg-green-100"
              },
              {
                name: "Environmental Health",
                status: "Pending",
                lastAudit: "2023-10-20",
                nextDue: "2024-04-20",
                statusColor: "text-gray-600 bg-gray-100"
              }
            ].map((compliance) => (
              <div key={compliance.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{compliance.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${compliance.statusColor}`}>
                    {compliance.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Last Audit:</span>
                    <span>{format(new Date(compliance.lastAudit), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Due:</span>
                    <span>{format(new Date(compliance.nextDue), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="FileText"
                    onClick={() => handleGenerateReport(compliance.name)}
                    className="w-full"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;