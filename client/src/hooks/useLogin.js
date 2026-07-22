import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    await login(formData);
    navigate("/dashboard");
  };

  return { handleLogin };
}