// tests/__mocks__/react-chartjs-2.js
const Doughnut = ({ data }) => {
  // Render labels and percentages as text for testing
  const total = data.datasets[0].data.reduce((acc, cur) => acc + cur, 0);
  return (
    <div>
      Mocked Doughnut Chart
      <ul>
        {data.labels.map((label, i) => {
          const value = data.datasets[0].data[i];
          const percentage = ((value / total) * 100).toFixed(2);
          return (
            <li key={label}>
              {label}: {percentage}%
            </li>
          );
        })}
      </ul>
    </div>
  );
};
// Update Line mock to render date labels
const Line = ({ data }) => (
  <div>
    Mocked Line Chart
    <ul>
      {data.labels && data.labels.map((label, i) => <li key={i}>{label}</li>)}
    </ul>
  </div>
);
const Bar = () => <div>Mocked Bar Chart</div>;

// ES module exports
export { Doughnut, Line, Bar };

// CommonJS exports
module.exports = { Doughnut, Line, Bar };
