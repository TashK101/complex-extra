import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="nav">
      <Link to="/" className="logo">ComplexLab</Link>
      
      {/* Menu toggle for mobile */}
      <input 
        className="menu-btn" 
        type="checkbox" 
        id="menu-btn" 
        checked={isMenuOpen} 
        onChange={handleMenuToggle} 
      />
      <label className="menu-icon" htmlFor="menu-btn">
        <span className="navicon"></span>
      </label>
      
      <ul className={`menu ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className="menu-link" onClick={closeMenu}>Главная</Link>
        </li>
        <li>
          <Link to="/about" className="menu-link" onClick={closeMenu}>О приложении</Link>
        </li>
        <li>
          <a href="https://forms.gle/vEg2ohW7HddUHPRAA" className="menu-link" onClick={closeMenu}>Обратная связь</a>
        </li>
        <li>
          <a href="https://github.com/TashK101/complex-extra" className="menu-link" onClick={closeMenu}>GitHub</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


// const Navbar = () => {
//   return (
//     <nav className="nav">
//     <Link to="/" className="logo">ComplexLab</Link>
//     <input className="menuBtn" type="checkbox" id="menu-btn" />
//     <label className="menuIcon" htmlFor="menuBtn"><span className="navicon"></span></label>
//     <ul className="menu">
//       <li><Link to="/">Главная</Link></li>
//       <li><Link to="/about">О приложении</Link></li>
//       <li><Link to="https://forms.gle/V31TnmqyMyaCtFcd7">Обратная связь</Link></li>
//       <li><Link to="https://github.com/TashK101/complex-extra">GitHub</Link></li>
//     </ul>
//   </nav>
//   )
// }

// export default Navbar;