import { useAuth } from "../../context/AuthContext";
import DashboardCard from "./DashboardCard";

function DashboardHome() {

  const { user } = useAuth();

  return (

    <div className="flex-1 p-8 bg-slate-950">

      <h1 className="text-4xl font-bold text-white">

        Welcome,

        <span className="text-blue-400">

          {" "}{user?.name}

        </span>

      </h1>

      <p className="text-slate-400 mt-2">

        Enterprise AI Document Assistant

      </p>

      <div className="grid grid-cols-3 gap-6 mt-10">

        <DashboardCard
          title="Documents"
          value="0"
          color="bg-blue-700"
        />

        <DashboardCard
          title="Chats"
          value="0"
          color="bg-green-700"
        />

        <DashboardCard
          title="Notifications"
          value="0"
          color="bg-purple-700"
        />

      </div>

    </div>

  );

}

export default DashboardHome;