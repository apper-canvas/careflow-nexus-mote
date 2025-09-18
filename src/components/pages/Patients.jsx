import React, { useState, useEffect } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import PatientCard from "@/components/organisms/PatientCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { patientService } from "@/services/api/patientService";
import { toast } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError("Failed to load patients");
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === "" || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedRoom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.primaryPhysician?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || 
      patient.currentStatus?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handlePatientClick = (patient) => {
    toast.success(`Opening patient profile for ${patient.firstName} ${patient.lastName}`);
  };

  const handleQuickAction = (patientId, action) => {
    const patient = patients.find(p => p.Id === patientId);
    if (action === "records") {
      toast.info(`Opening medical records for ${patient.firstName} ${patient.lastName}`);
    } else if (action === "appointment") {
      toast.info(`Scheduling appointment for ${patient.firstName} ${patient.lastName}`);
    }
  };

  const handleNewPatient = () => {
    toast.success("Opening new patient registration form");
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  const statusCounts = {
    all: patients.length,
    critical: patients.filter(p => p.currentStatus?.toLowerCase() === "critical").length,
    urgent: patients.filter(p => p.currentStatus?.toLowerCase() === "urgent").length,
    stable: patients.filter(p => p.currentStatus?.toLowerCase() === "stable").length,
    observation: patients.filter(p => p.currentStatus?.toLowerCase() === "observation").length,
    discharge: patients.filter(p => p.currentStatus?.toLowerCase() === "discharge").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">Manage patient records and care coordination</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Download">
            Export List
          </Button>
          <Button variant="primary" icon="Plus" onClick={handleNewPatient}>
            New Patient
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar
            placeholder="Search by name, room, or physician..."
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={setSearchTerm}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Patients", count: statusCounts.all },
            { key: "critical", label: "Critical", count: statusCounts.critical },
            { key: "urgent", label: "Urgent", count: statusCounts.urgent },
            { key: "stable", label: "Stable", count: statusCounts.stable },
            { key: "observation", label: "Observation", count: statusCounts.observation },
            { key: "discharge", label: "Ready for Discharge", count: statusCounts.discharge }
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-700">{statusCounts.critical}</div>
          <div className="text-sm text-red-600">Critical</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-700">{statusCounts.urgent}</div>
          <div className="text-sm text-orange-600">Urgent</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-700">{statusCounts.stable}</div>
          <div className="text-sm text-green-600">Stable</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{statusCounts.observation}</div>
          <div className="text-sm text-blue-600">Observation</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">{statusCounts.discharge}</div>
          <div className="text-sm text-purple-600">Discharge Ready</div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-700">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total Patients</div>
        </div>
      </div>

      {/* Patient Cards */}
      {filteredPatients.length === 0 ? (
        <Empty 
          type={searchTerm ? "search" : "patients"}
          action={searchTerm ? () => setSearchTerm("") : handleNewPatient}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.Id}
              patient={patient}
              onClick={() => handlePatientClick(patient)}
              onQuickAction={handleQuickAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;