import React, { useState, useEffect } from "react";
import StatsCard from "@/components/molecules/StatsCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { staffService } from "@/services/api/staffService";
import { departmentService } from "@/services/api/departmentService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    patients: [],
    appointments: [],
    staff: [],
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patients, appointments, staff, departments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        departmentService.getAll()
      ]);

      setDashboardData({
        patients,
        appointments,
        staff,
        departments
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const { patients, appointments, staff, departments } = dashboardData;

  // Calculate statistics
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.currentStatus?.toLowerCase() === "critical").length;
  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const appointmentDate = new Date(apt.dateTime);
    return appointmentDate.toDateString() === today.toDateString();
  }).length;
  const staffOnDuty = staff.filter(s => s.schedule?.some(schedule => 
    schedule.date === format(new Date(), "yyyy-MM-dd") && schedule.status === "on duty"
  )).length;

  // Recent patients
  const recentPatients = patients
    .filter(p => p.admissionDate)
    .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
    .slice(0, 5);

  // Urgent appointments
  const urgentAppointments = appointments
    .filter(apt => apt.status === "pending" || apt.status === "confirmed")
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 5);

  // Department occupancy
  const departmentOccupancy = departments.map(dept => ({
    ...dept,
    occupancyRate: ((dept.occupiedBeds / dept.totalBeds) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. Wilson. Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Download">
            Export Report
          </Button>
          <Button variant="primary" icon="Plus">
            New Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value={totalPatients}
          icon="Users"
          subtitle={`${criticalPatients} critical`}
          color="primary"
          trend="+5.2% from last week"
          trendDirection="up"
        />
        
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments}
          icon="Calendar"
          subtitle="Scheduled for today"
          color="success"
          trend="+12.3% from yesterday"
          trendDirection="up"
        />
        
        <StatsCard
          title="Staff on Duty"
          value={staffOnDuty}
          icon="UserCheck"
          subtitle={`${staff.length - staffOnDuty} off duty`}
          color="info"
          trend="+2.1% from last week"
          trendDirection="up"
        />
        
        <StatsCard
          title="Bed Occupancy"
          value={`${Math.round(departmentOccupancy.reduce((acc, dept) => acc + parseFloat(dept.occupancyRate), 0) / departmentOccupancy.length)}%`}
          icon="Bed"
          subtitle="Average across all departments"
          color="warning"
          trend="-1.5% from last week"
          trendDirection="down"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Admissions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {recentPatients.length === 0 ? (
              <Empty type="patients" />
            ) : (
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.Id}
                    className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Room {patient.assignedRoom} • {patient.currentStatus}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(patient.admissionDate), "MMM dd")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {patient.primaryPhysician}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardBody>
            {urgentAppointments.length === 0 ? (
              <Empty type="appointments" />
            ) : (
              <div className="space-y-3">
                {urgentAppointments.map((appointment) => (
                  <div
                    key={appointment.Id}
                    className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Patient #{appointment.patientId}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "confirmed" 
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {appointment.type}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
                      {format(new Date(appointment.dateTime), "MMM dd, h:mm a")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Status</CardTitle>
        </CardHeader>
        <CardBody>
          {departmentOccupancy.length === 0 ? (
            <Empty type="departments" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {departmentOccupancy.map((dept) => (
                <div
                  key={dept.Id}
                  className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      parseFloat(dept.occupancyRate) > 90 
                        ? "bg-red-500" 
                        : parseFloat(dept.occupancyRate) > 70 
                          ? "bg-yellow-500" 
                          : "bg-green-500"
                    }`}></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Occupied</span>
                      <span className="font-medium">{dept.occupiedBeds}/{dept.totalBeds}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          parseFloat(dept.occupancyRate) > 90 
                            ? "bg-red-500" 
                            : parseFloat(dept.occupancyRate) > 70 
                              ? "bg-yellow-500" 
                              : "bg-green-500"
                        }`}
                        style={{ width: `${dept.occupancyRate}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Occupancy</span>
                      <span>{dept.occupancyRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;