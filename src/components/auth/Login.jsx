"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  useLoginMutation,
  useGoogleAuthMutation,
} from "@/features/auth/authApiSlice";
import { setCredentials } from "@/features/auth/authSlice";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import Container from "../Container";
import Input from "../Input";
import AuthBtn from "../AuthBtn";
import { RiEyeCloseLine, RiEyeCloseFill } from "react-icons/ri";
import Cookies from "js-cookie";
import axios from "axios";


export default function Login() {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await login({ email, password }).unwrap();
      console.log('Login response:', result); // Debug log
      
      // Handle both response formats
      const responseData = result.data || result;
      const accessToken = responseData?.accessToken || responseData?.token;
      const refreshToken = responseData?.refreshToken;
      const user = responseData?.user;
      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 30 });
        Cookies.set("refreshToken", refreshToken, { expires: 30 });
        dispatch(setCredentials({ accessToken, refreshToken, user }));
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("userEmail", email);
        if (rememberMe) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("userEmail", email);
          // Normalize and save user info for dropdown
          const normalizedUser = {
            firstName: user.firstName || user.profile?.firstName || "",
            lastName: user.lastName || user.profile?.lastName || "",
            email: user.email || user.profile?.email || "",
            avatarUrl: user.avatarUrl || user.profile?.avatarUrl || "",
            // ...add any other fields you need
          };
          localStorage.setItem("user", JSON.stringify(normalizedUser));
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userEmail");
        }
        toast.success("Login successful!");
        // Try to fetch latest profile after login, but don't fail if it doesn't work
        try {
          console.log("Attempting to fetch user profile...");
          const profileRes = await axios.get("/api/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 10000, // 10 second timeout
          });
          
          console.log("Profile fetch successful:", profileRes.data);
          const latestUser = profileRes?.data?.data || profileRes?.data || user;
          if (latestUser) {
            // Update credentials with latest user data
            dispatch(setCredentials({ accessToken, refreshToken, user: latestUser }));
            
            // Normalize and save user info for dropdown
            const normalizedUser = {
              firstName: latestUser.firstName || latestUser.profile?.firstName || "",
              lastName: latestUser.lastName || latestUser.profile?.lastName || "",
              email: latestUser.email || latestUser.profile?.email || "",
              avatarUrl: latestUser.avatarUrl || latestUser.profile?.avatarUrl || "",
            };
            localStorage.setItem("user", JSON.stringify(normalizedUser));
            console.log("User profile updated and saved to localStorage");
          }
        } catch (profileErr) {
          // Profile fetch failed, but this is not critical - user is already logged in
          console.warn("Profile fetch failed (non-critical):", profileErr.message);
          console.warn("Profile fetch response:", profileErr.response?.data);
          console.warn("Profile fetch status:", profileErr.response?.status);
          // Continue with the user data from login response
        }
        
        // Always redirect to dashboard after successful login
        console.log("=== LOGIN SUCCESS - REDIRECTING TO DASHBOARD ===");
        router.replace("/");
      } else {
        toast.error("Invalid login response");
        console.error("Missing token in response:", result);
      }
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.error || "Login failed. Please try again.";
      setServerError(errMsg);
      toast.error(errMsg);
      
      // If account is not verified, provide specific guidance
      if (errMsg.includes("Account not verified")) {
        toast.error("Please verify your email address first. Check your inbox for verification code.");
      }
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <Container className="font-secondary">
      <h2 className="text-center text-4xl font-semibold text-primary mb-1 font-primary">
        LogIn
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="email"
            label="Email"
            placeholder=""
            name="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-b-2 border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <Input
            type={visible ? "text" : "password"}
            label="Password"
            placeholder=""
            name="password"
            autoComplete="new-password"
            value={password}
            suffix={
              visible ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(false);
                  }}
                >
                  <RiEyeCloseFill />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(true);
                  }}
                >
                  <RiEyeCloseLine />
                </button>
              )
            }
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-b-2 border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember for 30 days
          </label>
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Signing In..." : "Sign in"}
        </AuthBtn>
      </form>

      <div className="mt-4 space-y-2 ">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-secondary flex items-center justify-center border py-2 rounded-lg hover:bg-hoversecondary"
        >
          <FcGoogle className="h-5 mr-2" />
          Sign in with Google
        </button>
      </div>

      <p className="text-center text-gray-600 mt-4">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </a>
      </p>

      {serverError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {serverError}
        </div>
      )}
    </Container>
  );
}
