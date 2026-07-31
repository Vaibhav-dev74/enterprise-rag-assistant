function DashboardCard({ title, value, color }) {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${color}`}
    >
      <h3 className="text-white text-lg">
        {title}
      </h3>

      <p className="text-4xl font-bold text-white mt-4">
        {value}
      </p>
    </div>
  );
}

export default DashboardCard;