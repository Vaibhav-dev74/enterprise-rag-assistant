import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", form);

      login(
        res.data.access_token,
        res.data.user
      );

      navigate("/dashboard");

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.detail ||
        "Invalid email or password."
      );

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="w-96 bg-slate-900 p-8 rounded-xl shadow-xl"
      >

        <h1 className="text-3xl font-bold text-white mb-8">

          Enterprise RAG

        </h1>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          className="w-full mb-6 p-3 rounded bg-slate-800 text-white outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold"
        >

          Login

        </button>

        <p className="text-gray-400 mt-5 text-center">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >

            Register

          </Link>

        </p>

      </form>

    </div>

  );

}

export default Login;