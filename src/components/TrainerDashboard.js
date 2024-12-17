import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'
import { MdGroups2, MdOutlineGrade } from 'react-icons/md'
import { PiStudentBold } from 'react-icons/pi'
import { RxDashboard } from 'react-icons/rx'
import { NavLink, Outlet } from 'react-router-dom'

export default function TrainerDashBoard() {
    const [isOpen,setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const trainerMenu = [
        {
            path:'/trainer-dashboard',
            name:'Dashboard',
            icon:<RxDashboard />
        },
        
        {
            path:'/Trainer-details',
            name:'Trainer',
            icon:<PiStudentBold />
        },
        
        {
            path:'/student-view-trainer',
            name:'Total Students',
            icon:<MdGroups2 />
        },
    ]

  return (
    <div>
      <Container fluid  className='flexbox p-0'>
        <div style={{width: isOpen ? "auto" : "50px"}} className="sidebar">
            <div className="top_section">
                <div><img src={require('../assets/img/logo (1).png')} style={{display: isOpen ? "block" : "none" , width : "60%"}} className="logo" /></div>
                <div style={{marginLeft: isOpen ? "auto" : "0px", cursor:"pointer", color : "#fff"}} className="bars">
                    <FaBars onClick={toggle} />
                </div>
            </div>
            {
                trainerMenu.map((items,index) =>(
                    <NavLink to={items.path} key={index} className='link' activeclassName='active'>
                        <div className="icon">{items.icon}</div>
                        <div style={{display : isOpen ? "block" : "none"}} className="link_text">{items.name}</div>
                    </NavLink>
                ))
            }
            
        </div>
        <main><Outlet /></main>
      </Container>
    </div>
  )
}
