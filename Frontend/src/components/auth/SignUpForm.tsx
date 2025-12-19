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

    if (!form.username.trim()) newErrors.username = "Username duhet.";

    if (!form.email.trim()) {
      newErrors.email = "Email duhet.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Shkruaj një email të vlefshëm.";
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Fjalëkalimi të paktën 6 karaktere.";
    }

    if (!isChecked) {
      newErrors.terms = "Duhet të pranosh kushtet.";
    }

    if (!profileImage) {
      newErrors.profileImage = "Foto e profilit është e detyrueshme.";
    } else {
      if (!allowedTypes.includes(profileImage.type)) {
        newErrors.profileImage = "Lejohen vetëm JPG/PNG.";
      }
      if (profileImage.size > MAX_SIZE) {
        newErrors.profileImage = "Foto duhet < 2MB.";
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
      setServerError(result.message || "Regjistrimi dështoi.");
      return;
    }

    navigate("/signin");
  };

  // ===================== RENDER =====================
  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <Link to="/signin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon className="size-4" />
          Kthehu te hyrja
        </Link>

        <h1 className="mt-4 mb-2 font-semibold text-gray-800 text-title-sm">Regjistrohu</h1>
        <p className="text-sm text-gray-500">Fillo duke krijuar një llogari të re.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div>
            <Label>Username <span className="text-error-500">*</span></Label>
            <Input
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            {errors.username && <p className="text-error-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Input
              placeholder="info@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-error-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label>Fjalëkalimi <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Shkruaj fjalëkalimin"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          <div>
            <Label>Foto profili <span className="text-error-500">*</span></Label>
            <FileInput
              accept=".png,.jpg,.jpeg"
              onChange={(file) => setProfileImage(file)}
            />
            {errors.profileImage && <p className="text-error-500 text-sm mt-1">{errors.profileImage}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="text-gray-700 text-theme-sm">
              Pranoj kushtet dhe politikën e privatësisë.
            </span>
          </div>
          {errors.terms && <p className="text-error-500 text-sm mt-1">{errors.terms}</p>}

          {serverError && <p className="text-error-500 text-sm mt-1">{serverError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-700">
          Ke llogari?{" "}
          <Link to="/signin" className="text-brand-500">Hyr</Link>
        </p>
      </div>
    </div>
  );
}
