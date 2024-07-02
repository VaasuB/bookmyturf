import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { UserOutlined } from '@ant-design/icons'; // Import UserOutlined icon
import { Avatar, Space } from 'antd'; // Import Avatar and Space components from antd

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'; // Define URL for the user avatar

const Navbar = () => {
    return (
        <nav>
            <div className="navbar">
                <div className="conatainernav">
                    <Link to="/" id="sitetitle">Book My Turf</Link> {/* Replace anchor tag with Link */}
                    
                    {/* User Avatar as a Link */}
                    <Link to="/profile" className="avatar-link"> {/* Link to profile page */}
                        <div className="avatar-container"> {/* Container for the user avatar */}
                            <Space size={16} wrap>
                                <Avatar icon={<UserOutlined />} />
                            </Space>
                        </div>
                    </Link>
                </div>
            </div>
            <div id="titlediv">
                <ul className="navitems">
                    <li className="navitem">
                        <Link to="/home" className='navlink'>Home</Link> {/* Replace anchor tag with Link */}
                    </li>
                    <li className="navitem">
                        <Link to="/about" className="navlink">About</Link> {/* Replace anchor tag with Link */}
                    </li>
                    <li className="navitem">
                        <Link to="/contact" className="navlink">Contact</Link> {/* Replace anchor tag with Link */}
                    </li>
                    <li className="navitem">
                        <Link to="/addturf" className="navlink">Add Turf</Link> {/* Replace anchor tag with Link */}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
