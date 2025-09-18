import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Staff from "@/components/pages/Staff";
import Reports from "@/components/pages/Reports";
import Patients from "@/components/pages/Patients";
import PatientRegistration from "@/components/pages/PatientRegistration";
import Appointments from "@/components/pages/Appointments";
import Departments from "@/components/pages/Departments";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
<Route path="patients" element={<Patients />} />
            <Route path="patients/new" element={<PatientRegistration />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="staff" element={<Staff />} />
            <Route path="departments" element={<Departments />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="toast-custom"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;