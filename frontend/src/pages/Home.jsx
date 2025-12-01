import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Discover Amazing Events</h1>
            <p>Book tickets for concerts, conferences, workshops, and more</p>
            <Link to="/events">
              <button className="btn btn-primary btn-large">Browse Events</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Easy Booking</h3>
              <p>Simple and secure ticket booking process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Safe and encrypted payment processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📧</div>
              <h3>Event Reminders</h3>
              <p>Get notified about your upcoming events</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

