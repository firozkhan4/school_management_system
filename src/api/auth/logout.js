import { useAppContext } from "../../context/AppContext";

export const logout = () => {
  const { setIsLoggedIn } = useAppContext()
  localStorage.setItem('token', "");
}
