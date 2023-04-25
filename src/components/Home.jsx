import React from 'react';
import { Outlet,NavLink } from 'react-router-dom';
import './main.css'

function Home() {
    const activeTab={
        fontSize:"1.7rem",
        color:"#00dbde",
        fontWeight:"800",
        backgroundColor:"#e35d5b",
        borderRadius:"1.5rem",
        padding:"1rem"
    }
    const inActiveTab={
        fontSize:"1.2rem",
        color:"white",
        fontWeight:"bold"
    }
  return (
    <div>
        <nav className="navbar navbar-expand-sm">
        <ul className='navbar-nav mx-auto '>
            <div className="collapse navbar-collapse">

            <li className='nav-item me-5 ms-3 pe-3 ps-3 pt-3 pb-3'>
                <NavLink to="/table1" className="nav-link" style={({isActive})=>{return isActive?(activeTab):(inActiveTab)}}>Table-1</NavLink>
            </li>
            <li className='nav-item me-5 ms-3 pe-3 ps-3 pt-3 pb-3'>
                <NavLink to="/table2" className="nav-link" style={({isActive})=>{return isActive?(activeTab):(inActiveTab)}}>Table-2</NavLink>
            </li>
            <li className='nav-item me-5 ms-3 pe-3 ps-3 pt-3 pb-3'>
                <NavLink to="/table3" className="nav-link" style={({isActive})=>{return isActive?(activeTab):(inActiveTab)}}>Table-3</NavLink>
            </li>
            <li className='nav-item me-5 ms-3 pe-3 ps-3 pt-3 pb-3'>
                <NavLink to="/table4" className="nav-link" style={({isActive})=>{return isActive?(activeTab):(inActiveTab)}}>Table-4</NavLink>
            </li>
            <li className='nav-item me-5 ms-3 pe-3 ps-3 pt-3 pb-3'>
                <NavLink to="/table5" className="nav-link" style={({isActive})=>{return isActive?(activeTab):(inActiveTab)}}>Table-5</NavLink>
            </li>
            </div>
            {/* <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                Disabled
                </Nav.Link>
            </Nav.Item> */}
        </ul>
        </nav>
        <Outlet/>
    </div>
  )
}

export default Home;