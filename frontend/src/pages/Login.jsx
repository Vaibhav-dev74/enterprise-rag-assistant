import React from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to query your enterprise knowledge base"
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;