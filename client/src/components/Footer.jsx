function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="font-bold">H</span>
              </div>
              <span className="text-xl font-bold">Hotel Manager</span>
            </div>
            <p className="text-gray-400 mt-2">Professional Hotel Management System</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400">© {new Date().getFullYear()} Hotel Manager. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-1">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;