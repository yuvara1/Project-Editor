import { useState } from 'react';
import './styles/code.css';
import Editor from "@monaco-editor/react";
import Navbar from './Navbar.jsx';
import axios from 'axios';
import { FaPlay, FaTrash, FaSpinner } from 'react-icons/fa';

function Code() {
     const [userCode, setUserCode] = useState(``);
     const [userLang, setUserLang] = useState("python");
     const [userTheme, setUserTheme] = useState("vs-light");
     const [fontSize, setFontSize] = useState(20);
     const [userInput, setUserInput] = useState("");
     const [userOutput, setUserOutput] = useState("");
     const [loading, setLoading] = useState(false);

     const options = {
          fontSize: fontSize
     };

     function compile() {
          setLoading(true);
          if (userCode === ``) {
               setLoading(false);
               return;
          }

          axios.post(`http://localhost:8000/compile`, {
               code: userCode,
               language: userLang,
               input: userInput
          }).then((res) => {
               setUserOutput(res.data.stdout || res.data.stderr);
          }).then(() => {
               setLoading(false);
          }).catch((err) => {
               console.error(err);
               setUserOutput("Error: " + (err.response ? err.response.data.error : err.message));
               setLoading(false);
          });
     }

     function clearOutput() {
          setUserOutput("");
     }

     return (
          <>
               <div className="App">
                    <Navbar
                         userLang={userLang} setUserLang={setUserLang}
                         userTheme={userTheme} setUserTheme={setUserTheme}
                         fontSize={fontSize} setFontSize={setFontSize}
                    />
                    <div className="main">
                         <div className="left-container">
                              <Editor
                                   options={options}
                                   height="calc(100vh - 50px)"
                                   width="100%"
                                   theme={userTheme}
                                   language={userLang}
                                   defaultLanguage="python"
                                   defaultValue="# Enter your code here"
                                   onChange={(value) => { setUserCode(value) }}
                                   className='editor'
                              />
                              <button className="run-btn" onClick={() => compile()} disabled={loading}>
                                   {loading ? <FaSpinner className="spinner" /> : <FaPlay />} Run
                              </button>
                         </div>
                         <div className="right-container">
                              <h4>Input:</h4>
                              <div className="input-box">
                                   <textarea id="code-inp" onChange={(e) => setUserInput(e.target.value)}>
                                   </textarea>
                              </div>
                              <h4>Output:</h4>
                              <div className="output-box">
                                   {loading ? (
                                        <div className="spinner-box">
                                             <FaSpinner className="spinner" />
                                        </div>
                                   ) : (
                                        <pre>{userOutput}</pre>
                                   )}
                                   <button onClick={() => { clearOutput() }} className="clear-btn">
                                        <FaTrash /> Clear
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}

export default Code;