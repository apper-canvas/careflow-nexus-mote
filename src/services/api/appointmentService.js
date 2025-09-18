import appointmentData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.appointments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return { ...appointment };
  }

  async create(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...this.appointments.map(a => a.Id), 0) + 1
    };
    
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    
    const deletedAppointment = this.appointments.splice(index, 1)[0];
    return { ...deletedAppointment };
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.appointments.filter(a => 
      a.patientId === patientId.toString()
    ).map(a => ({ ...a }));
  }

  async getByStaff(staffId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.appointments.filter(a => 
      a.staffId === staffId.toString()
    ).map(a => ({ ...a }));
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.appointments.filter(a => {
      const appointmentDate = new Date(a.dateTime);
      return appointmentDate >= start && appointmentDate <= end;
    }).map(a => ({ ...a }));
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.appointments.filter(a => 
      a.status?.toLowerCase() === status.toLowerCase()
    ).map(a => ({ ...a }));
  }

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.update(id, { status });
  }
}

export const appointmentService = new AppointmentService();