import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

const Dashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`)
      setBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed'
      case 'pending':
        return 'status-pending'
      case 'failed':
        return 'status-failed'
      default:
        return ''
    }
  }

  if (loading) {
    return <div className="loading">Loading your bookings...</div>
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <Link to="/events">
              <button className="btn btn-primary">Browse Events</button>
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3>{booking.event?.title}</h3>
                    <p className="booking-date">
                      Booked on {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span>Event Date:</span>
                    <span>{formatDate(booking.event?.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Time:</span>
                    <span>{booking.event?.time}</span>
                  </div>
                  <div className="detail-row">
                    <span>Venue:</span>
                    <span>{booking.event?.venue?.name}, {booking.event?.venue?.city}</span>
                  </div>
                  <div className="detail-row">
                    <span>Tickets:</span>
                    <span>{booking.tickets}</span>
                  </div>
                  <div className="detail-row">
                    <span>Total Amount:</span>
                    <span className="amount">${booking.totalAmount}</span>
                  </div>
                </div>

                {booking.paymentStatus === 'pending' && (
                  <div className="booking-actions">
                    <Link to={`/booking/${booking.event?._id}?bookingId=${booking._id}`}>
                      <button className="btn btn-primary">Complete Payment</button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

