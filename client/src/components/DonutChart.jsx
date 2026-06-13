function DonutChart({ percentage }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-chart">
      <svg width="120" height="120">
        <circle
          className="donut-bg"
          cx="60"
          cy="60"
          r={radius}
        />
        <circle
          className="donut-fill"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="donut-label">{percentage}%</div>
    </div>
  );
}

export default DonutChart;