import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Carousel from './Carousel';
import TurfCard from './TurfCard';
import Footer from './Footer';
import './App.css';
import axios from 'axios';
import { Row, Col, Select, Button } from 'antd';

const { Option } = Select;

const HomePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedPriceOrder, setSelectedPriceOrder] = useState('');
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        fetchAreas();
        fetchTurfs();
    }, []);

    const fetchTurfs = (filters = {}) => {
        setLoading(true);
        axios.get('http://localhost:3001/turfs', { params: filters })
            .then(response => {
                setData(response.data);
                setLoading(false);
                setError(null); // Reset error state on successful fetch
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError('Failed to fetch turfs');
                setLoading(false);
            });
    };

    const fetchAreas = () => {
        axios.get('http://localhost:3001/areas')
            .then(response => {
                setAreas(response.data);
            })
            .catch(error => {
                console.error('Fetch areas error:', error);
            });
    };

    const handleApplyFilters = () => {
        const filters = {
            area: selectedArea,
            priceOrder: selectedPriceOrder
        };
        fetchTurfs(filters);
    };

    const handleAreaChange = (value) => {
        setSelectedArea(value);
    };

    const handlePriceOrderChange = (value) => {
        setSelectedPriceOrder(value);
    };

    return (
        <div>
            <Navbar />
            <div id="titlediv">
                {/* Navigation links */}
            </div>
            <div className="carousel-container">
                <Carousel />
            </div>
            <div id="cardsbackground1">
                <div id="cardsbackground2">
                    <div className="filter-section">
                        <h2>Filters</h2>
                        <div className="filter-option">
                            <label htmlFor="area">Search Area:</label>
                            <Select
                                value={selectedArea}
                                onChange={handleAreaChange}
                                style={{ width: 200 }}
                            >
                                <Option value="">All Areas</Option>
                                {areas.map(area => (
                                    <Option key={area} value={area}>{area}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="filter-option">
                            <label htmlFor="priceOrder">Price Order:</label>
                            <Select
                                value={selectedPriceOrder}
                                onChange={handlePriceOrderChange}
                                style={{ width: 200 }}
                            >
                                <Option value="">Select price order</Option>
                                <Option value="highToLow">Price High to Low</Option>
                                <Option value="lowToHigh">Price Low to High</Option>
                            </Select>
                        </div>
                        <Button onClick={handleApplyFilters} type="primary">Apply</Button>
                    </div>
                    <div className="cardcontainer" id="cardscontainer">
                        <Row gutter={[16, 16]}>
                            {data.map(turf => (
                                <Col key={turf.id} xs={24} sm={12} md={8} style={{ marginBottom: '16px' }}>
                                    <TurfCard turf={turf} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
