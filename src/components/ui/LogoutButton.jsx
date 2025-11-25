import { LogOut } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const LogoutButton = () => {
  const { setIsLoggedIn } = useAppContext()

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-300 hover:bg-red-700 hover:text-white transition"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
