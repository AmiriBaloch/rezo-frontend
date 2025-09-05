"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation } from "../../features/auth/authApiSlice";
import { toast } from "react-hot-toast";
import Container from "../Container";
import Input from "../Input";
import AuthBtn from "../AuthBtn";

export default function VerifyEmail() {
  const router = useRouter();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError("OTP code is required");
      return;
    }

    setError("");

    try {
      const res = await verifyEmail(JSON.stringify(code)).unwrap();
      toast.success(res?.message || "Email verified successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed");
    }
  };

  return (
    <Container>
      <h2 className="text-center text-4xl font-semibold text-primary mb-1">
        Verify Email
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Enter the OTP sent to your email
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            label="OTP Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <AuthBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 font-semibold disabled:opacity-70"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </AuthBtn>
      </form>
    </Container>
  );
}
