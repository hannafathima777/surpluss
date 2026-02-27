import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      const role = docSnap.data()?.role;
      role === "vendor" ? navigate("/vendor") : navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Authentication</h2>
        <div className="line thin" style={{backgroundColor: 'var(--odin-black)', height: '1px', marginBottom: '2rem'}}></div>
        
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-submit">Sign In ↗</button>
        </form>
        <a href="/register" className="auth-switch">No account? Register here</a>
      </div>
    </div>
  );
}

export default Login;