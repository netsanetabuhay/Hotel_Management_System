import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../api/Axios";  // Fixed: removed the curly braces

function Register() {
  const navigate = useNavigate();
  
  const usernameDom = useRef(null);
  const emailDom = useRef(null);
  const passwordDom = useRef(null);
  const firstNameDom = useRef(null);
  const lastNameDom = useRef(null);
  const phoneDom = useRef(null);
  const roleDom = useRef(null);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const userData = {
      username: usernameDom.current.value,
      email: emailDom.current.value,
      password: passwordDom.current.value,
      first_name: firstNameDom.current.value,
      last_name: lastNameDom.current.value,
      phone: phoneDom.current.value,
      role: roleDom.current.value,
    };
    
    try {
      // Make API call to register user
      await Axios.post("/users/register", userData);
      
      // Navigate to login page after successful registration
      navigate("/login");
      
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <input type="text" ref={usernameDom} placeholder="Username" required className="w-full p-2 border rounded" />
        <input type="email" ref={emailDom} placeholder="Email" required className="w-full p-2 border rounded" />
        <input type="password" ref={passwordDom} placeholder="Password" required className="w-full p-2 border rounded" />
        <input type="text" ref={firstNameDom} placeholder="First Name" required className="w-full p-2 border rounded" />
        <input type="text" ref={lastNameDom} placeholder="Last Name" required className="w-full p-2 border rounded" />
        <input type="text" ref={phoneDom} placeholder="Phone Number" required className="w-full p-2 border rounded" />
        <input type="text" ref={roleDom} placeholder="Role" required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <button 
          type="button" 
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:underline"
        >
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;
