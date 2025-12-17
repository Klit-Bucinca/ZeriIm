import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  // Përdor environment variable për BASE_URL ose default
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7038";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    setServerError("");

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(`${BASE_URL}/scalar/v1/auth/login`, {
          email,
          password,
        });

        // Supozojmë që backend kthen diçka si: { token: "...", role: "Admin" }
        const { token, role } = response.data;

        // Ruaj token dhe role në localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        // Ridrejtimi sipas role-it
        if (role === "Admin") navigate("/dashboard/Home");
        else if (role === "Citizen") navigate("/pages/UserHome");
        else if (role === "Moderator") navigate("/pages/ModeratorHome");
        else setServerError("Unknown user role");

      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Login failed. Please try again.");
        }
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">Sign In</h1>
        <p className="text-sm text-gray-500">Enter your email and password to sign in!</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input
              placeholder="info@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label>Password <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
              </span>
            </div>
            {errors.password && <p className="text-error-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-gray-700 text-theme-sm">Keep me logged in</span>
            </div>
            <Link to="/reset-password" className="text-sm text-brand-500">Forgot password?</Link>
          </div>

          {serverError && <p className="text-error-500 text-sm mt-1">{serverError}</p>}

          <Button type="submit" className="w-full" size="sm">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brand-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
