import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), { email, role });
      alert("Account Created!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Design Element: Decorative Lines */}
        <div className="card-lines">
          <div className="line thick"></div>
          <div className="line thin"></div>
        </div>

        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Join the surplus network</p>
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Identification (Email)</label>
            <input 
              type="email" 
              placeholder="USER@DOMAIN.COM" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Security (Password)</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Sector (Role)</label>
            <select onChange={(e) => setRole(e.target.value)}>
              <option value="user">Individual User</option>
              <option value="vendor">Business Vendor</option>
            </select>
          </div>

          <button type="submit" className="auth-submit">Create Account ↗</button>
        </form>

        <div className="auth-footer">
          <a href="/login">Already Registered? Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default Register;