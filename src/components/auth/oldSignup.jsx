"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "../../features/auth/authApiSlice";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import Container from "../Container";
import Input from "../Input";
import AuthBtn from "../AuthBtn";
import { RiEyeCloseLine, RiEyeCloseFill } from "react-icons/ri";

const Signup = () => {
  const router = useRouter();
  const [signup, { isLoading, isSuccess, error }] = useSignupMutation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "+923-",
    nationality: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration successful! Please check your email.");
      router.push("/verify-email");
    }
    if (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  }, [isSuccess, error, router]);

  const validatePassword = (pwd) => {
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      pwd
    );
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!validatePassword(formData.password))
      newErrors.password =
        "Password must be at least 8 characters, including a letter, a number, and a symbol.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required";
    return newErrors;
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (step === 1) {
      const step1Errors = validateStep1();
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      const step2Errors = validateStep2();
      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors);
        return;
      }
      try {
        await signup(formData).unwrap();
      } catch (_) {}
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    );
  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-1 font-primary">
        Sign up
      </h2>
      {step === 1 && (
        <Step1
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleNext}
          onGoogleAuth={handleGoogleLogin}
          renderError={renderError}
        />
      )}
      {step === 2 && (
        <Step2
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleNext}
          renderError={renderError}
        />
      )}
      {step === 3 && <Step3 email={formData.email} />}
    </Container>
  );
};

export default Signup;

const Step1 = ({
  formData,
  setFormData,
  errors,
  isLoading,
  onGoogleAuth,
  onSubmit,
  renderError,
}) => {
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            label="Name"
            required={true}
            placeholder=""
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-red-500" : "border-gray-300"}
          />
          {renderError("name")}
        </div>

        <div className="mb-4">
          <Input
            type="email"
            label="Email"
            required={true}
            placeholder=""
            autoComplete="off"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={errors.email ? "border-red-500" : "border-gray-300"}
          />
          {renderError("email")}
        </div>

        <div className="mb-4">
          <Input
            type={visible ? "text" : "password"}
            label="Create a password"
            required={true}
            autoComplete="new-password"
            suffix={
              visible ? (
                <RiEyeCloseFill onClick={() => setVisible(false)} />
              ) : (
                <RiEyeCloseLine onClick={() => setVisible(true)} />
              )
            }
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={errors.password ? "border-red-500" : "border-gray-300"}
          />
          {renderError("password")}
        </div>

        <div className="mb-4">
          <Input
            type={visibleConfirm ? "text" : "password"}
            label="Repeat password"
            required={true}
            value={formData.confirmPassword}
            suffix={
              visibleConfirm ? (
                <RiEyeCloseFill onClick={() => setVisibleConfirm(false)} />
              ) : (
                <RiEyeCloseLine onClick={() => setVisibleConfirm(true)} />
              )
            }
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className={
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }
          />
          {renderError("confirmPassword")}
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </AuthBtn>
      </form>
      <button
        onClick={onGoogleAuth}
        className="w-full bg-secondary flex items-center justify-center border py-2 rounded-lg hover:bg-hoversecondary mt-4"
      >
        <FcGoogle className="h-5 mr-2" />
        Sign in with Google
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
};

const Step2 = ({
  formData,
  setFormData,
  errors,
  isLoading,
  onSubmit,
  renderError,
}) => {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold text-hoversecondary">
        More Details...
      </h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            label="Phone Number"
            required={true}
            placeholder=""
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={errors.phone ? "border-red-500" : "border-gray-300"}
          />
          {renderError("phone")}
        </div>

        <div className="mb-4">
          <Input
            type="text"
            label="Nationality"
            required={true}
            placeholder=""
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            className={
              errors.nationality ? "border-red-500" : "border-gray-300"
            }
          />
          {renderError("nationality")}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="my-4 w-full rounded bg-primary py-2 text-white hover:bg-hoverprimary disabled:bg-opacity-70"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

const Step3 = ({ email }) => (
  <>
    <div className="w-12 h-12 bg-primary rounded-full mx-auto animate-ping" />
    <h2 className="text-2xl font-bold text-green-600 mb-4">Check your Email</h2>
    <p className="text-gray-700">We’ve sent a verification link to:</p>
    <p className="mt-2 font-semibold">{email}</p>
    <p className="mt-6 text-sm text-gray-500">
      Please verify to activate your account.
    </p>
  </>
);
