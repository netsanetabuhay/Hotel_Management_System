import React from "react";
import {link} from "react-router-dom";

function Login(){
    return(
        <div style={{padding:"2rem"}}>
            <h2>Login</h2>
               <form action="">
               <div>
                 <label >Email</label>
                <input type="email" placeholder="Enter email"  />
               </div>
               <div>
                <label>Password</label>
                <input type="password" placeholder="Enter password" />
               </div>
               <button type="submit">submit</button>
            </form>
            <p>don't have an account? <link to="/register">Register</link>  </p>
         

        </div>
    )
}
export default Login;

// import React from "react";
// import { Link } from "react-router-dom";

// function Login() {
//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Login</h2>

//       <form>
//         <div>
//           <label>Email</label><br />
//           <input type="email" placeholder="Enter email" />
//         </div>

//         <div>
//           <label>Password</label><br />
//           <input type="password" placeholder="Enter password" />
//         </div>

//         <button type="submit">Login</button>
//       </form>

//       <p>
//         Don’t have an account?{" "}
//         <Link to="/register">Register</Link>
//       </p>
//     </div>
//   );
// }

// export default Login;
