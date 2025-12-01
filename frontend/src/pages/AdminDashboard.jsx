import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('events')
  const [showEventForm, setShowEventForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concert',
    date: '',
    time: '',
    venue: { name: '', address: '', city: '' },
    totalTickets: '',
    price: '',
    organizer: '',
    image: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/events?status=active`),
        axios.get(`${import.meta.env.VITE_API_URL}/bookings/all`),
      ])
      setEvents(eventsRes.data.data)
      setBookings(bookingsRes.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('venue.')) {
      const venueField = name.split('.')[1]
      setFormData({
        ...formData,
        venue: { ...formData.venue, [venueField]: value },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/events`, {
        ...formData,
        availableTickets: formData.totalTickets,
        totalTickets: parseInt(formData.totalTickets),
        price: parseFloat(formData.price),
        date: new Date(formData.date),
      })
      setShowEventForm(false)
      setFormData({
        title: '',
        description: '',
        category: 'concert',
        date: '',
        time: '',
        venue: { name: '', address: '', city: '' },
        totalTickets: '',
        price: '',
        organizer: '',
        image: '',
      })
      fetchData()
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error creating event')
    }
  }

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/events/${eventId}`)
        fetchData()
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Error deleting event')
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === 'events' ? 'active' : ''}
            onClick={() => setActiveTab('events')}
          >
            Events ({events.length})
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Manage Events</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowEventForm(!showEventForm)}
              >
                {showEventForm ? 'Cancel' : '+ Add New Event'}
              </button>
            </div>

            {showEventForm && (
              <div className="card event-form-card">
                <h3>Create New Event</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="concert">Concert</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="sports">Sports</option>
                        <option value="theater">Theater</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Venue Name</label>
                    <input
                      type="text"
                      name="venue.name"
                      value={formData.venue.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Venue Address</label>
                      <input
                        type="text"
                        name="venue.address"
                        value={formData.venue.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="venue.city"
                        value={formData.venue.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Total Tickets</label>
                      <input
                        type="number"
                        name="totalTickets"
                        value={formData.totalTickets}
                        onChange={handleChange}
                        required
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Price per Ticket ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Organizer</label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Create Event
                  </button>
                </form>
              </div>
            )}

            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="admin-event-card">
                  <h3>{event.title}</h3>
                  <p className="event-category">{event.category}</p>
                  <p className="event-date">{formatDate(event.date)}</p>
                  <p className="event-tickets">
                    {event.availableTickets} / {event.totalTickets} tickets available
                  </p>
                  <div className="admin-actions">
                    <Link to={`/events/${event._id}`} className="btn btn-outline">
                      View
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-section">
            <h2>All Bookings</h2>
            <div className="bookings-table">
              {bookings.map((booking) => (
                <div key={booking._id} className="admin-booking-card">
                  <div className="booking-info">
                    <h4>{booking.event?.title}</h4>
                    <p>User: {booking.user?.name} ({booking.user?.email})</p>
                    <p>Tickets: {booking.tickets} | Amount: ${booking.totalAmount}</p>
                    <p>Status: {booking.paymentStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

