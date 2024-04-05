import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import { AiOutlineLogout } from "react-icons/ai";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <Button
      className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md w-100 h-50"
      onClick={handleLogout}
    >
      <AiOutlineLogout className="mr-2" /> Log Out
    </Button>
  );
};

export default Logout;
