import React from "react";
import { Card, CardBody } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInYears } from "date-fns";

const PatientCard = ({ patient, onClick, onQuickAction }) => {
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));
  const admissionDate = patient.admissionDate ? format(new Date(patient.admissionDate), "MMM dd, yyyy") : null;

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPriorityColor = (status) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "from-red-500 to-red-600";
      case "urgent":
        return "from-orange-500 to-orange-600";
      case "stable":
        return "from-green-500 to-green-600";
      case "observation":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <Card hover onClick={onClick} className="cursor-pointer">
      <CardBody className="p-4">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getPriorityColor(patient.currentStatus)} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
            {getInitials(patient.firstName, patient.lastName)}
          </div>

          {/* Patient Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {patient.firstName} {patient.lastName}
              </h3>
              <StatusBadge status={patient.currentStatus} type="patient" />
            </div>

            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center">
                <ApperIcon name="User" className="h-4 w-4 mr-2" />
                <span>{age} years old • {patient.gender}</span>
              </div>
              
              {patient.assignedRoom && (
                <div className="flex items-center">
                  <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                  <span>Room {patient.assignedRoom}</span>
                </div>
              )}

              {patient.primaryPhysician && (
                <div className="flex items-center">
                  <ApperIcon name="Stethoscope" className="h-4 w-4 mr-2" />
                  <span>{patient.primaryPhysician}</span>
                </div>
              )}

              {admissionDate && (
                <div className="flex items-center">
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                  <span>Admitted {admissionDate}</span>
                </div>
              )}
            </div>

            {/* Medical History Summary */}
            {patient.medicalHistory && patient.medicalHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {patient.medicalHistory.slice(0, 3).map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {condition}
                    </span>
                  ))}
                  {patient.medicalHistory.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      +{patient.medicalHistory.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="FileText"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAction?.(patient.Id, "records");
                  }}
                >
                  Records
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Calendar"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAction?.(patient.Id, "appointment");
                  }}
                >
                  Schedule
                </Button>
              </div>

              <div className="flex items-center text-xs text-gray-400">
                <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
                <span>Updated 2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PatientCard;