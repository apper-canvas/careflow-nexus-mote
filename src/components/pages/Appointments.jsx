import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/atoms/Card";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { staffService } from "@/services/api/staffService";
import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("calendar");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [appointmentsData, patientsData, staffData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        staffService.getAll()
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setStaff(staffData);
    } catch (err) {
      setError("Failed to load appointments data");
      toast.error("Failed to load appointments data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Enrich appointments with patient and staff names
  const enrichedAppointments = appointments.map(appointment => {
    const patient = patients.find(p => p.Id === parseInt(appointment.patientId));
    const staffMember = staff.find(s => s.Id === parseInt(appointment.staffId));
    
    return {
      ...appointment,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${appointment.patientId}`,
      staffName: staffMember ? staffMember.name : `Staff #${appointment.staffId}`,
      patientPhone: patient?.contactInfo?.phone || "",
      staffRole: staffMember?.role || ""
    };
  });

  const filteredAppointments = enrichedAppointments.filter(appointment => {
    const matchesSearch = searchTerm === "" || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || 
      appointment.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleDateSelect = (date) => {
    toast.info(`Selected date: ${format(date, "MMMM dd, yyyy")}`);
  };

  const handleAppointmentClick = (appointment) => {
    toast.info(`Opening appointment details for ${appointment.patientName}`);
  };

  const handleScheduleNew = () => {
    toast.success("Opening appointment scheduling form");
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const appointment = appointments.find(a => a.Id === appointmentId);
      const updatedAppointment = { ...appointment, status: newStatus };
      
      await appointmentService.update(appointmentId, updatedAppointment);
      
      setAppointments(prev => 
        prev.map(a => a.Id === appointmentId ? updatedAppointment : a)
      );
      
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (err) {
      toast.error("Failed to update appointment status");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const statusCounts = {
    all: appointments.length,
    confirmed: appointments.filter(a => a.status?.toLowerCase() === "confirmed").length,
    pending: appointments.filter(a => a.status?.toLowerCase() === "pending").length,
    cancelled: appointments.filter(a => a.status?.toLowerCase() === "cancelled").length,
    completed: appointments.filter(a => a.status?.toLowerCase() === "completed").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage patient appointments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "calendar" ? "primary" : "ghost"}
              size="sm"
              icon="Calendar"
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              icon="List"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button variant="primary" icon="Plus" onClick={handleScheduleNew}>
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar
            placeholder="Search by patient, staff, or appointment type..."
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All", count: statusCounts.all },
            { key: "confirmed", label: "Confirmed", count: statusCounts.confirmed },
            { key: "pending", label: "Pending", count: statusCounts.pending },
            { key: "completed", label: "Completed", count: statusCounts.completed },
            { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={filterStatus === filter.key ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus(filter.key)}
              className="whitespace-nowrap"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">{statusCounts.confirmed}</div>
          <div className="text-sm text-green-600">Confirmed</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{statusCounts.completed}</div>
          <div className="text-sm text-blue-600">Completed</div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-700">{statusCounts.cancelled}</div>
          <div className="text-sm text-red-600">Cancelled</div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "calendar" ? (
        <AppointmentCalendar
          appointments={enrichedAppointments}
          onDateSelect={handleDateSelect}
          onAppointmentClick={handleAppointmentClick}
          onScheduleNew={handleScheduleNew}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Appointment List</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            {filteredAppointments.length === 0 ? (
              <div className="p-8">
                <Empty 
                  type={searchTerm ? "search" : "appointments"}
                  action={searchTerm ? () => setSearchTerm("") : handleScheduleNew}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {appointment.patientName.split(" ").map(n => n.charAt(0)).join("")}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patientName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.patientPhone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(appointment.dateTime), "MMM dd, yyyy")}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(appointment.dateTime), "h:mm a")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.type}</div>
                          <div className="text-sm text-gray-500">{appointment.duration} min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.staffName}</div>
                          <div className="text-sm text-gray-500">{appointment.staffRole}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={appointment.status} type="appointment" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Eye"
                              onClick={() => handleAppointmentClick(appointment)}
                            />
                            {appointment.status?.toLowerCase() === "pending" && (
                              <Button
                                variant="success"
                                size="sm"
                                icon="Check"
                                onClick={() => handleStatusChange(appointment.Id, "confirmed")}
                              />
                            )}
                            {appointment.status?.toLowerCase() !== "cancelled" && (
                              <Button
                                variant="danger"
                                size="sm"
                                icon="X"
                                onClick={() => handleStatusChange(appointment.Id, "cancelled")}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Appointments;