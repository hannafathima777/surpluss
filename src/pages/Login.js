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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        navigate(docSnap.data().role === "VENDOR" ? "/vendor" : "/home");
      }
    } catch (err) {
      setError("INVALID_CREDENTIALS");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">IDENTIFICATION</h1>
          <div className="line thin"></div>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="input-group">
            <label>ACCOUNT_EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="USER@DOMAIN.COM" 
              required 
            />
          </div>

          <div className="input-group">
            <label>ACCESS_KEY</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "INITIALIZING..." : "INITIALIZE_SESSION ↗"}
          </button>
        </form>

        <div className="auth-switch" onClick={() => navigate("/register")}>
          NEW_USER?_CREATE_IDENTITY_ENTRY
        </div>
      </div>
    </div>
  );
}

export default Login;