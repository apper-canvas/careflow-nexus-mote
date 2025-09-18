import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "patient" }) => {
  const getStatusConfig = (status, type) => {
    if (type === "patient") {
      switch (status?.toLowerCase()) {
        case "critical":
          return { variant: "critical", label: "Critical" };
        case "urgent":
          return { variant: "urgent", label: "Urgent" };
        case "stable":
          return { variant: "stable", label: "Stable" };
        case "observation":
          return { variant: "observation", label: "Observation" };
        case "discharge":
          return { variant: "discharge", label: "Ready for Discharge" };
        default:
          return { variant: "default", label: status || "Unknown" };
      }
    }
    
    if (type === "appointment") {
      switch (status?.toLowerCase()) {
        case "confirmed":
          return { variant: "success", label: "Confirmed" };
        case "pending":
          return { variant: "warning", label: "Pending" };
        case "cancelled":
          return { variant: "danger", label: "Cancelled" };
        case "completed":
          return { variant: "info", label: "Completed" };
        default:
          return { variant: "default", label: status || "Unknown" };
      }
    }

    if (type === "staff") {
      switch (status?.toLowerCase()) {
        case "on duty":
        case "onduty":
          return { variant: "success", label: "On Duty" };
        case "off duty":
        case "offduty":
          return { variant: "default", label: "Off Duty" };
        case "break":
          return { variant: "warning", label: "On Break" };
        case "emergency":
          return { variant: "danger", label: "Emergency" };
        default:
          return { variant: "default", label: status || "Unknown" };
      }
    }

    return { variant: "default", label: status || "Unknown" };
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;