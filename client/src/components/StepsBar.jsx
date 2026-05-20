export default function StepsBar({ current }) {
  const steps = ['Wish Type', 'Template', 'Details', 'Payment'];
  return (
    <div style={{ margin: '24px 0 32px', textAlign: 'center' }}>
      <div className="steps-bar">
        {steps.map((label, i) => {
          const num = i + 1;
          return (
            <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`step-dot ${num < current ? 'done' : num === current ? 'active' : ''}`}>
                {num < current ? '✓' : num}
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${num < current ? 'done' : ''}`} />
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
        Step {current} of {steps.length}: <strong>{steps[current - 1]}</strong>
      </p>
    </div>
  );
}
