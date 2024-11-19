import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Use Link for routing

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Summary", href: "/summary" },
  { label: "What-if Analysis", href: "/what-if" }
];

const NavBar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    setActiveSection(location.pathname); // Update active section based on the route
  }, [location.pathname]);

  return (
    <nav className="bg-[#f9fafb]/30 sticky top-0 z-50 py-3 backdrop-blur-lg shadow-sm border-gray-100">
      <div className="container mx-auto px-4 md:px-8 relative text-sm"> {/* Added horizontal padding */}
        <div className="flex justify-between items-center">
          {/* <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <img className="h-10 w-15 mr-2" src={logo} alt="logo" />
            </Link>
          </div> */}

          {/* Desktop and tablet view */}
          <ul className="hidden md:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  className={`hover-effect relative font-semibold text-gray-900 uppercase ${
                    activeSection === item.href ? "text-blue-500" : ""
                  }`}
                  to={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger menu */}
          <div className="md:hidden sm:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-blue-50 w-full p-12 flex flex-col justify-center items-center md:hidden">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    className={`hover:underline relative font-semibold text-gray-900 uppercase ${
                      activeSection === item.href ? "text-blue-500" : ""
                    }`}
                    to={item.href}
                    onClick={() => setMobileDrawerOpen(false)} // Close drawer on click
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
