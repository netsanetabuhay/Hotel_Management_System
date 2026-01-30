import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Our Hotel Management System</h1>
      <p>
        Explore our services and manage your bookings with ease.
      </p>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </div>
  );
}

export default Home;