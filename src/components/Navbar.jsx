import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Bell, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
  };

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchActive(false);
      setQuery('');
      if (isMenuOpen) toggleMenu();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      navigate(`/search?q=${encodeURIComponent(val.trim())}`);
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <span className="logo-text">TORIN</span>
            </Link>
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tv-shows">TV Shows</Link></li>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/new-popular">New & Popular</Link></li>
              <li><a href="#my-list">My List</a></li>
            </ul>
          </div>

          <div className="navbar-right">
            <div className={`search-box ${isSearchActive ? 'active' : ''}`}>
              <form onSubmit={handleSearch}>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Titles, actors, genres"
                  value={query}
                  onChange={handleInputChange}
                />
              </form>
              <div className="nav-icon" onClick={handleSearchToggle}>
                {isSearchActive ? <X size={20} /> : <SearchIcon size={20} />}
              </div>
            </div>
            <div className="nav-icon"><Bell size={20} /></div>
            <div className="nav-profile">
              <User size={20} />
              <span className="profile-name">Konarch</span>
            </div>
            <div className="nav-mobile-menu" onClick={toggleMenu}>
              <Menu size={24} color="white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className={`mobile-menu-content ${isMenuOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <Link to="/" className="logo-text" onClick={toggleMenu}>TORIN</Link>
            <button className="close-menu" onClick={toggleMenu}>&times;</button>
          </div>

          <div className="mobile-search-padding">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleInputChange}
              />
              <button type="submit"><SearchIcon size={18} /></button>
            </form>
          </div>

          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/tv-shows" onClick={toggleMenu}>TV Shows</Link></li>
            <li><Link to="/movies" onClick={toggleMenu}>Movies</Link></li>
            <li><a href="#new" onClick={toggleMenu}>New & Popular</a></li>
            <li><a href="#my-list" onClick={toggleMenu}>My List</a></li>
          </ul>
          <div className="mobile-menu-footer">
            <div className="nav-profile">
              <User size={20} />
              <span className="profile-name">Konarch</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
