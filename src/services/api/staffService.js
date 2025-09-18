import staffData from "@/services/mockData/staff.json";

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.staff];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const staffMember = this.staff.find(s => s.Id === parseInt(id));
    if (!staffMember) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    return { ...staffMember };
  }

  async create(staffData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newStaffMember = {
      ...staffData,
      Id: Math.max(...this.staff.map(s => s.Id), 0) + 1
    };
    
    this.staff.push(newStaffMember);
    return { ...newStaffMember };
  }

  async update(id, staffData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    
    this.staff[index] = { ...this.staff[index], ...staffData };
    return { ...this.staff[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    
    const deletedStaffMember = this.staff.splice(index, 1)[0];
    return { ...deletedStaffMember };
  }

  async getByRole(role) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.staff.filter(s => 
      s.role?.toLowerCase() === role.toLowerCase()
    ).map(s => ({ ...s }));
  }

  async getByDepartment(department) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.staff.filter(s => 
      s.department?.toLowerCase().includes(department.toLowerCase())
    ).map(s => ({ ...s }));
  }

  async getOnDuty(date = null) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    return this.staff.filter(s => 
      s.schedule?.some(schedule => 
        schedule.date === targetDate && schedule.status === "on duty"
      )
    ).map(s => ({ ...s }));
  }

  async assignPatient(staffId, patientId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const staffMember = this.staff.find(s => s.Id === parseInt(staffId));
    if (!staffMember) {
      throw new Error(`Staff member with ID ${staffId} not found`);
    }
    
    if (!staffMember.assignedPatients) {
      staffMember.assignedPatients = [];
    }
    
    if (!staffMember.assignedPatients.includes(parseInt(patientId))) {
      staffMember.assignedPatients.push(parseInt(patientId));
    }
    
    return { ...staffMember };
  }

  async unassignPatient(staffId, patientId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const staffMember = this.staff.find(s => s.Id === parseInt(staffId));
    if (!staffMember) {
      throw new Error(`Staff member with ID ${staffId} not found`);
    }
    
    if (staffMember.assignedPatients) {
      staffMember.assignedPatients = staffMember.assignedPatients.filter(
        id => id !== parseInt(patientId)
      );
    }
    
    return { ...staffMember };
  }
}

export const staffService = new StaffService();