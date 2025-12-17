// ===================== IMPORTS =====================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import FileInput from "../form/input/FileInput";
import { useAuth } from "../../context/AuthContext";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // FORM STATE
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, loading } = useAuth();

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  // ===================== VALIDATION =====================
  const validate = () => {
    let newErrors: any = {};

    if (!form.username.trim()) newErrors.username = "Username is required.";

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!isChecked) {
      newErrors.terms = "You must agree with Terms & Conditions.";
    }

    if (!profileImage) {
      newErrors.profileImage = "Profile picture is required.";
    } else {
      if (!allowedTypes.includes(profileImage.type)) {
        newErrors.profileImage = "Only JPG/PNG images allowed.";
      }
      if (profileImage.size > MAX_SIZE) {
        newErrors.profileImage = "Image must be less than 2MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===================== HANDLE SUBMIT =====================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    const data = new FormData();
    data.append("Username", form.username);
    data.append("Email", form.email);
    data.append("Password", form.password);
    if (profileImage) data.append("ProfileImage", profileImage);

    const result = await register(data);
    if (!result.success) {
      setServerError(result.message || "Server error. Provo përsëri.");
      return;
    }
    navigate("/signin");
  };

  // ===================== JSX =====================
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username, email and password to sign up!
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">

              {/* USERNAME */}
              <div>
                <Label>
                  Username<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* FILE INPUT */}
              <div>
                <Label>
                  Profile Photo<span className="text-error-500">*</span>
                </Label>
                <FileInput
                  onChange={(event) =>
                    setProfileImage(event.target.files?.[0] ?? null)
                  }
                />
                {errors.profileImage && (
                  <p className="text-red-500 text-sm">{errors.profileImage}</p>
                )}
              </div>

              {/* TERMS */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account you agree to{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-gray-800 dark:text-white">
                    Privacy Policy
                  </span>
                </p>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm">{errors.terms}</p>
              )}

              {/* SERVER ERROR */}
              {serverError && (
                <p className="text-red-500 text-sm">{serverError}</p>
              )}

              {/* SUBMIT */}
              <div>
                <button
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-70"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Duke u regjistruar..." : "Regjistrohu"}
                </button>
              </div>
            </div>
          </form>

          {/* FOOTER */}
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
