import React from 'react';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MonthDropdown = ({ selectedMonth, handleMonthChange }) => {
  return (
    <select value={selectedMonth} onChange={handleMonthChange}>
      {months.map((month, index) => (
        <option key={index} value={month}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default MonthDropdown;
