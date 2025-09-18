import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";

const AppointmentCalendar = ({ appointments = [], onDateSelect, onAppointmentClick, onScheduleNew }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };

  const getAppointmentsForDay = (date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.dateTime), date)
    ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appointment Calendar</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Week of {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateWeek(-1)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateWeek(1)}
            />
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={onScheduleNew}
            >
              Schedule
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 border-r border-gray-200 bg-gray-50">
            <span className="text-xs font-medium text-gray-500">Time</span>
          </div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-3 text-center border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                isToday(day) ? "bg-primary-50 text-primary-700" : "text-gray-700"
              }`}
              onClick={() => onDateSelect?.(day)}
            >
              <div className="text-xs font-medium text-gray-500">
                {format(day, "EEE")}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                isToday(day) ? "text-primary-600" : "text-gray-900"
              }`}>
                {format(day, "dd")}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getAppointmentsForDay(day).length} appts
              </div>
            </div>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-gray-100 min-h-[60px]">
              <div className="p-3 border-r border-gray-200 bg-gray-50 flex items-center">
                <span className="text-xs font-medium text-gray-500">{time}</span>
              </div>
              
              {weekDays.map((day) => {
                const dayAppointments = getAppointmentsForDay(day).filter(apt => 
                  format(new Date(apt.dateTime), "HH:mm") === time
                );
                
                return (
                  <div key={`${day.toISOString()}-${time}`} className="p-1 border-r border-gray-200 relative">
                    {dayAppointments.map((appointment) => (
                      <div
                        key={appointment.Id}
                        className={`p-2 rounded text-xs font-medium border cursor-pointer hover:shadow-md transition-all ${getStatusColor(appointment.status)}`}
                        onClick={() => onAppointmentClick?.(appointment)}
                      >
                        <div className="font-semibold truncate">
                          {appointment.patientName || `Patient #${appointment.patientId}`}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {appointment.type}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default AppointmentCalendar;