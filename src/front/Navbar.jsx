import React from 'react';
import Select from 'react-select';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import './styles/Navbar.css';
import { IoDocumentTextOutline } from "react-icons/io5";
const Navbar = ({ userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize }) => {
     const languages = [
          { value: "c", label: "C" },
          { value: "cpp", label: "C++" },
          { value: "python", label: "Python" },
          { value: "java", label: "Java" },
     ];

     const customStyles = {
          option: (provided, state) => ({
               ...provided,
               color: state.isSelected ? 'white' : 'black',
               backgroundColor: state.isSelected ? 'blue' : 'white',
          }),
          control: (provided) => ({
               ...provided,
               backgroundColor: 'black',
               color: 'white',
          }),
          singleValue: (provided) => ({
               ...provided,
               color: 'white',
          }),
          menu: (provided) => ({
               ...provided,
               backgroundColor: 'gray',
          }),
     };

     return (
          <div className="navbar">
               <h1>Syntax Studio</h1>
               <Select className='options' options={languages} value={userLang}
                    onChange={(e) => setUserLang(e.value)}
                    placeholder={userLang} styles={customStyles} />
               <div className="theme-icons">
                    {userTheme === 'light' ? (
                         <FaMoon className="icon" onClick={() => setUserTheme('vs-dark')} />
                    ) : (
                         <FaSun className="icon" onClick={() => setUserTheme('light')} />
                    )}
               </div>
               
               <label>Font Size</label>
               <input type="range" min="18" max="30"
                    value={fontSize} step="2"
                    onChange={(e) => { setFontSize(e.target.value) }} />
               <Link to="/dash">
                    <IoDocumentTextOutline className="icon" />
                    <span>Switch to Text Editor</span>
               </Link>
          </div>
     )
}

export default Navbar;