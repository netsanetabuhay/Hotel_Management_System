import { Link } from "react-router-dom";    
 
function Register() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register</h2>

      <form>
        <div>
          <label>Username</label><br />
          <input type="text" placeholder="Enter username" />
        </div>

        <div>
          <label>Email</label><br />
          <input type="email" placeholder="Enter email" />
        </div>

        <div>
          <label>Password</label><br />
          <input type="password" placeholder="Enter password" />
        </div>
        <div>
            <label>Confirm Password</label><br />
            <input type="password" placeholder="Confirm password" />
        </div>
        <div>
            <label>first name 
            </label>
            <input type="text" placeholder="Enter first name" />
        </div>
        <div>
            <label>last name 
            </label>
            <input type="text" placeholder="Enter last name" /> 
        </div>
        <div>
            <label>Phone Number
            </label>
            <input type="text" placeholder="Enter phone number" />      
        </div>

        <button type="submit">Register</button>
      </form>
      </div>);}