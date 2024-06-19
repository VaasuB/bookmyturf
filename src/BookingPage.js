import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { Card, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';

const BookingPage = () => {
    const [turf, setTurf] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [selectedTime, setSelectedTime] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        const turfId = localStorage.getItem('selectedTurfId'); // Retrieve turf ID from local storage
        if (!turfId) {
            console.error("No turf ID provided");
            return;
        }

        axios.get(`http://localhost:3001/turfs/${turfId}`)
            .then(response => {
                setTurf(response.data);
            })
            .catch(error => console.error('Error fetching turf:', error));
    }, []);

    useEffect(() => {
        if (!turf || !date) {
            return;
        }

        axios.get(`http://localhost:3001/turfs/${turf.id}/availability?date=${date}`)
            .then(response => {
                setBookedSlots(response.data);
            })
            .catch(error => console.error('Error fetching availability:', error));
    }, [turf, date]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!paymentProof) {
            console.error('Please select payment proof');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('date', date);
        formData.append('time_slot', selectedTime);
        formData.append('paymentProof', paymentProof);
        formData.append('numberOfPeople', numberOfPeople);
        formData.append('turfId', turf.id);

        axios.post('http://localhost:3001/bookings', formData)
            .then(response => {
                console.log('Booking successful:', response.data);
                setBookedSlots([...bookedSlots, parseInt(selectedTime)]);

                setName('');
                setEmail('');
                setDate(moment().format('YYYY-MM-DD'));
                setSelectedTime('');
                setPaymentProof(null);
                setNumberOfPeople(1);
            })
            .catch(error => console.error('Error making booking:', error));
    };

    const handlePaymentProofChange = (event) => {
        const file = event.target.files[0];
        setPaymentProof(file);
    };

    const renderAvailabilityGrid = () => {
        const gridStyle = {
            width: '25%',
            textAlign: 'center',
        };
        return (
            <Card title="6 AM to 12 AM Availability">
                {[...Array(18)].map((_, index) => {
                    const timeSlot = index + 6;
                    const isBooked = bookedSlots.includes(timeSlot);
                    return (
                        <Card.Grid key={index} style={{ ...gridStyle, backgroundColor: isBooked ? 'red' : 'green' }}>
                            {timeSlot}:00 - {timeSlot + 1}:00
                        </Card.Grid>
                    );
                })}
            </Card>
        );
    };

    if (!turf) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div id="titlediv"></div>
            <div className="booking-page-container">
                <div className="left-half-container" style={{ backgroundImage: `url('path_to_your_background_image.jpg')` }}>
                    <div className="image-container">
                        <img src={turf.imageUrl} alt={turf.name} />
                    </div>
                    <div className="qr-code-container">
                        {renderAvailabilityGrid()}
                    </div>
                </div>
                <div className="right-half-container">
                    <div className="upper-right-half-container">
                        <div className="details-container">
                            <h2>{turf.name}</h2>
                            <p>Description: {turf.detailed_info}</p>
                            <p>Price: {turf.price}</p>
                            <p>Area: {turf.area}</p>
                            <p>Sports: {turf.cricket && "Cricket"} {turf.football && "Football"} {turf.badminton && "Badminton"}</p>
                        </div>
                    </div>
                    <div className="lower-right-half-container">
                        <div className="booking-form-container">
                            <h3>Book Now</h3>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />

                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                <label htmlFor="date">Date:</label>
                                <DatePicker
                                    id="date"
                                    name="date"
                                    value={date ? moment(date) : null}
                                    onChange={(date, dateString) => setDate(dateString)}
                                    required
                                />

                                <label htmlFor="selectedTime">Select Time:</label>
                                <select
                                    id="selectedTime"
                                    name="selectedTime"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    required
                                >
                                    <option value="">Select Time</option>
                                    {[...Array(18)].map((_, index) => {
                                        const timeSlot = index + 6;
                                        return !bookedSlots.includes(timeSlot) ? (
                                            <option key={timeSlot} value={timeSlot}>
                                                {timeSlot}:00 - {timeSlot + 1}:00
                                            </option>
                                        ) : null;
                                    })}
                                </select>

                                <label htmlFor="paymentProof">Payment Proof (Image):</label>
                                <input type="file" id="paymentProof" name="paymentProof" onChange={handlePaymentProofChange} required accept="image/*" />

                                <label htmlFor="numberOfPeople">Number of People:</label>
                                <input type="number" id="numberOfPeople" name="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumberOfPeople(parseInt(e.target.value))} required />

                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookingPage;
