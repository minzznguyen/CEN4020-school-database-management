import { useState } from 'react';
import NavBar from '../NavBar.jsx';

const Staff = () => {
  const handleManageDepartment = () => {
    alert('Manage Department functionality here');
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 lg:px-16 py-8">
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
        <button
          onClick={handleManageDepartment}
          className="btn-grad px-4 py-2 text-sm font-medium rounded-md"
        >
          Manage Department
        </button>
      </div>
    </div>
  );
};

export default Staff;
