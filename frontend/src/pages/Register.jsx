import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export function Register() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Unlock AI-powered document intelligence & real-time citations"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;