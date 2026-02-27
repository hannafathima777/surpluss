import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CONSUMER"); // Default role
  const [orgName, setOrgName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save the user "Profile" with the specific ROLE
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: email,
        role: role, // "CONSUMER" or "SHELTER"
        orgName: role === "SHELTER" ? orgName : "INDIVIDUAL",
        createdAt: new Date()
      });

      alert("ACCOUNT_CREATED_SUCCESSFULLY");
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          
          <div className="input-group">
            <label>I AM A...</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="role-selector"
            >
              <option value="CONSUMER">FOOD SAVER (USER)</option>
              <option value="SHELTER">ORPHANAGE / SHELTER</option>
            </select>
          </div>

          {role === "SHELTER" && (
            <div className="input-group">
              <label>Organization Name</label>
              <input 
                type="text" 
                placeholder="E.G. KOCHI CHILDREN'S HOME" 
                value={orgName} 
                onChange={(e) => setOrgName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-submit">Register ↗</button>
        </form>
      </div>
    </div>
  );
}

export default Register;