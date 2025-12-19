import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email-i duhet";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Formati i email-it nuk është i vlefshëm";

    if (!password) newErrors.password = "Fjalëkalimi duhet";
    else if (password.length < 6) newErrors.password = "Fjalëkalimi të paktën 6 karaktere";

    setErrors(newErrors);
    setServerError("");

    if (Object.keys(newErrors).length === 0) {
      const result = await login({ email, password });
      if (!result.success) {
        setServerError(result.message || "Hyrja dështoi. Provo përsëri.");
        return;
      }

      // Default redirect to feed; admin/mod go to dashboard.
      const isHardcodedAdmin =
        email.trim().toLowerCase() === "admin@admin.admin" &&
        password === "AdminAdmin";
      const nextRole = result.role || (isHardcodedAdmin ? "Admin" : undefined);
      const isAdminUser = nextRole === "Admin" || nextRole === "Moderator" || isHardcodedAdmin;

      navigate(isAdminUser ? "/dashboard" : "/posts");
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">Hyr</h1>
        <p className="text-sm text-gray-500">Shkruaj email-in dhe fjalëkalimin për t’u lidhur.</p>

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
            <Label>Fjalëkalimi <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Shkruaj fjalëkalimin"
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

          {serverError && <p className="text-error-500 text-sm mt-1">{serverError}</p>}

          <Button type="submit" className="w-full" size="sm" disabled={loading}>
            {loading ? "Duke u futur..." : "Hyr"}
          </Button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-700">
          Nuk ke llogari?{" "}
          <Link to="/signup" className="text-brand-500">Regjistrohu</Link>
        </p>
      </div>
    </div>
  );
}
