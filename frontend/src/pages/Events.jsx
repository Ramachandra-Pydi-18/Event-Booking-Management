import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [category])

  const fetchEvents = async () => {
    try {
      const params = { status: 'active' }
      if (category) params.category = category
      if (search) params.search = search

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/events`, { params })
      setEvents(response.data.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchEvents()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="loading">Loading events...</div>
  }

  return (
    <div className="events-page">
      <div className="container">
        <h1 className="page-title">Browse Events</h1>

        <div className="events-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
            <option value="other">Other</option>
          </select>
        </div>

        {events.length === 0 ? (
          <div className="no-events">
            <p>No events found. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                {event.image && (
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                  </div>
                )}
                <div className="event-content">
                  <span className="event-category">{event.category}</span>
                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description.substring(0, 100)}...</p>
                  <div className="event-details">
                    <p>📅 {formatDate(event.date)}</p>
                    <p>🕐 {event.time}</p>
                    <p>📍 {event.venue.city}</p>
                  </div>
                  <div className="event-footer">
                    <span className="event-price">${event.price}</span>
                    <span className="event-availability">
                      {event.availableTickets} tickets left
                    </span>
                  </div>
                  <Link to={`/events/${event._id}`}>
                    <button className="btn btn-primary btn-block">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events

