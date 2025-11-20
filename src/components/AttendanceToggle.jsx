import { ToggleLeft, ToggleRight } from 'lucide-react';


// Attendance Toggle (Kept from previous version)
const AttendanceToggle = ({ isPresent, onClick, disabled }) => {
  const Icon = isPresent ? ToggleRight : ToggleLeft;
  const colorClass = isPresent ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  const label = isPresent ? 'Present' : 'Absent';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white font-medium text-xs shadow-md transition-all duration-200 ${colorClass} disabled:opacity-50`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};


export default AttendanceToggle;
