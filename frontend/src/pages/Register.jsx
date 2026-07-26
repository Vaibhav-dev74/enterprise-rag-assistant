import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {

  const navigate = useNavigate();

  const [form,setForm]=useState({
    name:"",
    email:"",
    password:"",
  });

  const register = async(e)=>{

    e.preventDefault();

    try{

      await api.post("/auth/register",form);

      alert("Registration Successful");

      navigate("/");

    }catch(err){

      alert(err.response?.data?.detail);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <form
        onSubmit={register}
        className="w-96 bg-slate-900 p-8 rounded-xl shadow-xl"
      >

        <h1 className="text-3xl text-white font-bold mb-8">

          Create Account

        </h1>

        <input
          placeholder="Name"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-3 rounded bg-slate-800 text-white mb-6"
          value={form.password}
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <button className="w-full bg-green-600 p-3 rounded text-white">

          Register

        </button>

        <p className="mt-5 text-gray-400">

          Already have an account?

          <Link
            to="/"
            className="text-blue-400 ml-2"
          >

            Login

          </Link>

        </p>

      </form>

    </div>

  );
}

export default Register;