import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  // FIXED: Added missing state declarations
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clears previous errors
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      const role = docSnap.data()?.role;

      // Logic: If vendor, go to dashboard. If user, go to home feed.
      if (role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("/home"); 
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Branding Lines from Reference */}
        <div className="card-lines">
          <div className="line thick" style={{backgroundColor: 'var(--odin-black)', height: '6px', marginBottom: '4px'}}></div>
          <div className="line thin" style={{backgroundColor: 'var(--odin-black)', height: '1px', marginBottom: '2rem'}}></div>
        </div>

        <h2 className="auth-title">Authentication</h2>
        
        {error && <p className="auth-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit">Sign In ↗</button>
        </form>
        <div className="auth-footer" style={{marginTop: '2rem'}}>
            <a href="/register" className="auth-switch">No account? Register here</a>
        </div>
      </div>
    </div>
  );
}

export default Login;