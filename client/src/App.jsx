import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    budget: '',
    subjects: '',
    goals: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Backend server or gemini is offline!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>DIU Career Navigator (Offline AI)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>আপনার ৪ বছরের মোট বাজেট (BDT):</label>
          <input 
            type="number" 
            placeholder="e.g. 700000"
            required
            style={inputStyle}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
          />
        </div>

        <div>
          <label>কোন কোন সাবজেক্টে আপনি ভালো বা আগ্রহী?</label>
          <input 
            type="text" 
            placeholder="e.g. Math, Programming, Design"
            required
            style={inputStyle}
            onChange={(e) => setFormData({...formData, subjects: e.target.value})}
          />
        </div>

        <div>
          <label>ভবিষ্যতে আপনি কী হতে চান?</label>
          <input 
            type="text" 
            placeholder="e.g. Software Engineer, Manager"
            style={inputStyle}
            onChange={(e) => setFormData({...formData, goals: e.target.value})}
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'AI চিন্তাভাবনা করছে...' : 'সাজেশন দেখুন'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #3498db' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>AI Recommendation:</h3>
          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{result.aiOutput}</p>
          {result.department && (
            <div style={{ fontSize: '0.9em', color: '#7f8c8d', marginTop: '10px' }}>
              <strong>Suggested Dept:</strong> {result.department.department} ({result.department.short_name})
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '5px',
  border: '1px solid #ddd'
};

const buttonStyle = {
  padding: '12px',
  background: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default App;