function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
      <p className="text-gray-600 mb-4">Our Dear : {user.role} or Customer</p>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="text-gray-700">This is your dashboard. More features coming soon!</p>
      </div>
    </div>
  );
}

export default Home;