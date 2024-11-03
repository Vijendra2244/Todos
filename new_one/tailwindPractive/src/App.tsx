import { useEffect, useState } from "react";
import "./App.css";
import Title from "./Title";
import CustomHooks from "./CustomHooks";

function App() {
  // State to manage the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle between true/false
  };

  const wi = CustomHooks();
  console.log(wi, "width of the component");
 
  return (
    <>
      <Title />
      <div className="p-2 border-solid border-2 border-sky-300 mt-1 border-r-2 m-1 flex justify-between items-center">
        <div className="text-lg font-bold">Logo</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-around w-8/12">
          <a
            className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
            href="#"
          >
            Home
          </a>
          <a
            className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
            href="#"
          >
            About
          </a>
          <a
            className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
            href="#"
          >
            Contact
          </a>
          <a
            className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
            href="#"
          >
            Blog
          </a>
          <a
            className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
            href="#"
          >
            Section
          </a>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button
            className="text-black hover:text-sky-500 focus:outline-none"
            id="navbarToggle"
            onClick={toggleMobileMenu} // Attach toggle function here
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobileMenu"
        className={`md:hidden flex flex-col w-full space-y-2 mt-2 ${
          isMobileMenuOpen ? "" : "hidden"
        }`} // Toggle hidden class based on state
      >
        <a
          className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
          href="#"
        >
          Home
        </a>
        <a
          className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
          href="#"
        >
          About
        </a>
        <a
          className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
          href="#"
        >
          Contact
        </a>
        <a
          className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
          href="#"
        >
          Blog
        </a>
        <a
          className="border-solid border-b-slate-900 rounded border-2 p-1 bg-black text-white hover:cursor-pointer hover:bg-black-100"
          href="#"
        >
          Section
        </a>
      </div>
    </>
  );
}

export default App;
