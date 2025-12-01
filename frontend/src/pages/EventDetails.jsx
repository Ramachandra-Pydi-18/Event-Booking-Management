import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './EventDetails.css'

const EventDetails = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`)
      setEvent(response.data.data)
    } catch (error) {
      console.error('Error fetching event:', error)
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

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      navigate(`/booking/${id}`)
    }
  }

  if (loading) {
    return <div className="loading">Loading event details...</div>
  }

  if (!event) {
    return <div className="loading">Event not found</div>
  }

  return (
    <div className="event-details-page">
      <div className="container">
        <Link to="/events" className="back-link">← Back to Events</Link>

        <div className="event-details-content">
          <div className="event-details-main">
            {event.image && (
              <div className="event-details-image">
                <img src={event.image} alt={event.title} />
              </div>
            )}

            <div className="event-details-info">
              <span className="event-category">{event.category}</span>
              <h1>{event.title}</h1>
              <p className="event-description-full">{event.description}</p>

              <div className="event-details-grid">
                <div className="detail-item">
                  <strong>Date:</strong>
                  <p>{formatDate(event.date)}</p>
                </div>
                <div className="detail-item">
                  <strong>Time:</strong>
                  <p>{event.time}</p>
                </div>
                <div className="detail-item">
                  <strong>Venue:</strong>
                  <p>{event.venue.name}</p>
                  <p className="venue-address">{event.venue.address}, {event.venue.city}</p>
                </div>
                <div className="detail-item">
                  <strong>Organizer:</strong>
                  <p>{event.organizer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="event-booking-card">
            <div className="booking-header">
              <span className="event-price-large">${event.price}</span>
              <span className="price-label">per ticket</span>
            </div>

            <div className="availability-info">
              <p>
                <strong>{event.availableTickets}</strong> tickets available out of{' '}
                <strong>{event.totalTickets}</strong>
              </p>
            </div>

            {event.availableTickets > 0 ? (
              <button onClick={handleBookNow} className="btn btn-primary btn-large btn-block">
                Book Now
              </button>
            ) : (
              <button disabled className="btn btn-secondary btn-large btn-block">
                Sold Out
              </button>
            )}

            {!isAuthenticated && (
              <p className="login-prompt">
                <Link to="/login">Login</Link> to book tickets
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails

