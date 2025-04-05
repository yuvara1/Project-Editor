import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../front/styles/styleDash.css'
import { BiHomeSmile, BiFolderOpen, BiSave, BiDownload, BiNotepad, BiFile, BiFontFamily, BiLogOut, BiUpArrowAlt, BiDownArrowAlt } from "react-icons/bi"
import { SiFusionauth } from "react-icons/si";
import { TbCodeDots } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { Link } from 'react-router-dom'
import Access from './Access'
import axios from 'axios'

function Dashboard() {
     const filepath = localStorage.getItem('filepath') || ''
     const name = localStorage.getItem('username') || ''
     const navigate = useNavigate()
     
     const [theme, setTheme] = useState('light')
     const [fileContent, setFileContent] = useState('')
     const [count, setCount] = useState(0)
     const [fontSize, setFontSize] = useState(16)

     const fontStyles = [
          "Arial",
          "Verdana",
          "Georgia",
          "Palatino",
          "Andale Mono",
          "Comic Sans MS, Comic Sans, cursive",
          "Helvetica, sans-serif"
     ]

     console.log('Filepath:', filepath)

     function changeFontStyle() {
          setCount(count + 1)
          console.log('Count:', count)
          let num = count / fontStyles.length - 1
          if (count === fontStyles.length - 1) {
               setCount(0)
          }
          document.getElementById('text').style.fontFamily = `${fontStyles.at(num)}`
     }

     function handleTheme() {
          if (theme === 'light') {
               setTheme('dark')
               document.body.style.backgroundColor = 'white'
               document.body.style.color = '#fff'
               document.querySelector('.navbar').style.backgroundColor = 'black'
               document.querySelector('.navbar').style.color = '#fff'
               document.querySelector('.sidebar').style.backgroundColor = 'black'
               document.querySelector('.sidebar').style.color = '#fff'
               document.querySelector('.workspace').style.backgroundColor = '#black'
               document.querySelector('.workspace').style.color = '#fff'
          } else {
               setTheme('light')
               document.body.style.backgroundColor = 'black'
               document.body.style.color = 'white'
               document.querySelector('.navbar').style.backgroundColor = '#f9f9f9'
               document.querySelector('.navbar').style.color = '#000'
               document.querySelector('.sidebar').style.backgroundColor = '#f9f9f9'
               document.querySelector('.sidebar').style.color = '#000'
               document.querySelector('.workspace').style.backgroundColor = '#f9f9f9'
               document.querySelector('.workspace').style.color = '#000'
          }
     }

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await fetch(`http://localhost:5000/read?fileName=${filepath}`)
                    if (!response.ok) {
                         throw new Error('Network response was not ok')
                    }
                    const data = await response.json()
                    console.log('Fetched data:', data)
                    setFileContent(data[0].content)
               } catch (error) {
                    console.error('Error fetching data:', error)
               }
          }

          fetchData()
     }, [filepath])

     function handleFontSizeIncrease() {
          setFontSize(fontSize + 1)
     }

     function handleFontSizeDecrease() {
          setFontSize(fontSize - 1)
     }

     const handleAppend = async (event) => {
          event.preventDefault()
          const newData = fileContent
          console.log('Saving file with content:', newData) // Debug: Log file content to be saved
          const res = await fetch('http://localhost:5000/updatefile', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                    content: newData,
                    fileName: filepath
               })
          })

          if (res.status === 200 || res.status === 500) {
               alert('File saved successfully!')
          } else {
               alert('Error saving file.')
          }
     }

     const handleDownload = () => {
          const element = document.createElement('a')
          const fileURL = URL.createObjectURL(new Blob([fileContent], { type: 'text/plain' }))
          element.href = fileURL
          element.download = `${filepath}`
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
     }

     const handleFileDiplay = () => {
          const dropDown = document.querySelector('.dropdown')
          if (dropDown.style.display === 'none') {
               dropDown.style.display = 'block'
          } else {
               dropDown.style.display = 'none'
          }
     }

     const handleLogout = () => {
          localStorage.clear()
          navigate('/')
     }

     const handleCreateNewFile = async (e) => {
          e.preventDefault()
          const fileName = window.prompt('Enter the file name', 'newfile')
          if (fileName) {
               try {
                    const response = await axios.post('http://localhost:5000/createnew', {
                         content: '',
                         fileName: fileName
                    })
                    if (response.status === 200) {
                         alert('File created successfully!')
                         localStorage.setItem('filepath', fileName)
                         setFileContent('')
                    } else {
                         throw new Error('Network response was not ok')
                    }
               } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error)
                    alert('Error creating file.')
               }
          }
     }

     async function handleAccess(e) {
          e.preventDefault()
          try {
               const response = await axios.get('http://localhost:5000/access')
               console.log('Fetched data:', response.data)
               const users = response.data.map(user => ({
                    username: user.Name,
                    access: user.access
               }))
               const name = window.prompt('Enter the username to change access:', 'username')
               const newAccess = window.prompt('zero for dennied, one for granted:', 0, 1)
               const user = users.find(user => user.username === name)
               console.log('User found:', user)
               if (user) {
                    const res = await axios.post('http://localhost:5000/updateaccess', {
                         name: name,
                         access: newAccess
                    })
                    console.log('Update access response:', res)
                    if (res.status === 200) {
                         alert('Access updated successfully!')
                    } else {
                         throw new Error('Network response was not ok')
                    }
               } else {
                    alert('User not found.')
               }
          } catch (error) {
               console.error('Error fetching data:', error)
               alert('Error fetching data.')
          }
     }

     async function handleDelete(e) {
          e.preventDefault();
          const filename = prompt('Enter the file name to delete:');
          if (!filename) {
               alert('Please enter a valid file name.');
               return;
          }

          try {
               const res = await axios.post('http://localhost:5000/deletefile', {
                    fileName: filename
               });

               if (res.status === 200) {
                    alert('File deleted successfully!');
                    localStorage.removeItem('filepath');
                    setFileContent('');
               } else {
                    alert('Error deleting file.');
               }
          } catch (error) {
               console.error('Error deleting file:', error);
               alert('Error deleting file.');
          }
     }

     
     return (
          <div>
               <nav className='navbar'>
                    <ul>
                         <li>
                              <BiNotepad className='icons' />
                              <span className='logofont'>Cloud pen</span>
                         </li>
                         <li>
                              <Link to='/code'>
                                   <TbCodeDots className='icons' />
                                   <span>Code Editor</span>
                              </Link>
                              <p>{name}</p>
                              <BiLogOut className='icons' onClick={handleLogout} />
                              <span>Logout</span>
                              <li>
                                   <MdOutlineDarkMode className='icons' onClick={handleTheme} />
                                   <span>dark</span>
                              </li>
                         </li>
                         
                    </ul>
               </nav>
               <aside className='sidebar'>
                    <div>
                         <ul>
                              <div className='components'>
                                   <BiHomeSmile className='icons' />
                                   <li>Home</li>
                              </div>

                              <div id='newfile' className='components' onClick={handleCreateNewFile}>
                                   <BiFile className='icons' />
                                   <li>Create New File</li>
                              </div>

                              <div className='components'>
                                   <BiSave className='icons' />
                                   <li onClick={handleAppend}>Save</li>
                              </div>
                              <div className='components'>
                                   <BiFolderOpen className='icons' />
                                   <li onClick={handleFileDiplay}>Files</li>
                              </div>
                              <div className='dropdown'>
                                   <Access />
                              </div>

                              <div className='components'>
                                   <AiOutlineDelete className='icons' />
                                   <li onClick={handleDelete}>Delete File</li>
                              </div>

                              <div className='components'>
                                   <BiDownload className='icons' />
                                   <li onClick={handleDownload}>Download</li>
                              </div>
                              <div className='components'>
                                   <BiFontFamily className='icons' />
                                   <li onClick={changeFontStyle}>change font</li>
                              </div>
                              <div className='components'>
                                   <BiUpArrowAlt className='icons' onClick={handleFontSizeIncrease} />
                                   <li>Font Size {fontSize}</li>
                                   <BiDownArrowAlt className='icons' onClick={handleFontSizeDecrease} />
                              </div>

                              {localStorage.getItem('admin') === 'True' && (
                                   <div className='components' onClick={handleAccess}>
                                        <SiFusionauth className='icons' />
                                        <li>Admin</li>
                                   </div>
                              )}
                         </ul>
                    </div>
               </aside>
               <main className="workspace">
                    <textarea
                         style={{ fontSize: `${fontSize}px`, fontFamily: `${fontStyles.at(count)}` }}
                         name="text"
                         id="text"
                         value={fileContent}
                         onChange={(e) => setFileContent(e.target.value)}
                         spellCheck={false}
                    />
               </main>
          </div>
     )
}

export default Dashboard