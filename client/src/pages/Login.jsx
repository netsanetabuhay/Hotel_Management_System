import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from  "../api/Axios";

function Login() {
  const navigate = useNavigate();
  
  const emailDom = useRef(null);
  const passwordDom = useRef(null);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const loginData = {
      email: emailDom.current.value,
      password: passwordDom.current.value,    
    };
    try {
      // Make API call to log in user
      const response = await axios.post("/login", loginData);
      console.log("Login response:", response.data);
      alert("Login successful!");
      
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      
      // Navigate to home page or dashboard after successful login
      navigate("./Home");
      
      
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");      
    }
  };
  
  return (
    <form onSubmit={submitHandler}>
      <input type="email" ref={emailDom} placeholder="please enter your email" required />
      <input type="password" ref={passwordDom} placeholder="please enter your password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login; 