import departmentData from "@/services/mockData/departments.json";

class DepartmentService {
  constructor() {
    this.departments = [...departmentData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.departments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const department = this.departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error(`Department with ID ${id} not found`);
    }
    return { ...department };
  }

  async create(departmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newDepartment = {
      ...departmentData,
      Id: Math.max(...this.departments.map(d => d.Id), 0) + 1
    };
    
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    
    this.departments[index] = { ...this.departments[index], ...departmentData };
    return { ...this.departments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    
    const deletedDepartment = this.departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }

  async updateBedCount(id, totalBeds, occupiedBeds) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const department = await this.getById(id);
    const updatedData = {
      totalBeds: parseInt(totalBeds),
      occupiedBeds: parseInt(occupiedBeds)
    };
    
    return this.update(id, updatedData);
  }

  async getOccupancyStats() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const totalBeds = this.departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
    const occupiedBeds = this.departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
    const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100) : 0;
    
    return {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: Math.round(occupancyRate * 10) / 10
    };
  }

  async getByOccupancyThreshold(threshold = 80) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return this.departments.filter(dept => {
      const occupancyRate = dept.totalBeds > 0 ? (dept.occupiedBeds / dept.totalBeds) * 100 : 0;
      return occupancyRate >= threshold;
    }).map(d => ({ 
      ...d, 
      occupancyRate: Math.round((d.occupiedBeds / d.totalBeds) * 1000) / 10 
    }));
  }

  async addEquipment(id, equipment) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const department = this.departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error(`Department with ID ${id} not found`);
    }
    
    if (!department.equipment) {
      department.equipment = [];
    }
    
    if (!department.equipment.includes(equipment)) {
      department.equipment.push(equipment);
    }
    
    return { ...department };
  }
}

export const departmentService = new DepartmentService();