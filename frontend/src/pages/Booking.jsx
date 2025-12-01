import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'
import './Booking.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = ({ event, bookingId: initialBookingId, tickets, totalAmount }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [currentBookingId, setCurrentBookingId] = useState(initialBookingId)

  useEffect(() => {
    if (currentBookingId) {
      fetchPaymentIntent()
    } else {
      createBooking()
    }
  }, [currentBookingId])

  const createBooking = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, {
        eventId: event._id,
        tickets: parseInt(tickets),
      })
      const booking = response.data.data
      setCurrentBookingId(booking._id)
      await fetchPaymentIntent(booking._id)
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating booking')
    }
  }

  const fetchPaymentIntent = async (bid = currentBookingId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-intent`,
        { bookingId: bid }
      )
      setClientSecret(response.data.clientSecret)
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating payment intent')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    )

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
    } else if (paymentIntent.status === 'succeeded') {
      // Confirm payment on backend
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/payments/confirm`, {
          paymentIntentId: paymentIntent.id,
          bookingId: currentBookingId,
        })
        navigate('/dashboard')
      } catch (error) {
        setError('Payment succeeded but confirmation failed')
      }
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-summary">
        <h3>Booking Summary</h3>
        <div className="summary-row">
          <span>Event:</span>
          <span>{event.title}</span>
        </div>
        <div className="summary-row">
          <span>Tickets:</span>
          <span>{tickets}</span>
        </div>
        <div className="summary-row">
          <span>Price per ticket:</span>
          <span>${event.price}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${totalAmount}</span>
        </div>
      </div>

      {clientSecret && (
        <>
          <div className="form-group">
            <label>Card Details</label>
            <div className="card-element-wrapper">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!stripe || loading}
          >
            {loading ? 'Processing...' : `Pay $${totalAmount}`}
          </button>
        </>
      )}

      {!clientSecret && !error && (
        <div className="loading">Preparing payment...</div>
      )}
    </form>
  )
}

const Booking = () => {
  const { eventId } = useParams()
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [event, setEvent] = useState(null)
  const [tickets, setTickets] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    fetchEvent()
    if (bookingId) {
      setShowPayment(true)
    }
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${eventId}`)
      setEvent(response.data.data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTicketsChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= event.availableTickets) {
      setTickets(value)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!event) {
    return <div className="loading">Event not found</div>
  }

  const totalAmount = (event.price * tickets).toFixed(2)

  return (
    <div className="booking-page">
      <div className="container">
        <h1 className="page-title">Book Tickets</h1>

        <div className="booking-content">
          <div className="booking-event-info">
            <h2>{event.title}</h2>
            <p className="event-date">
              {new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="event-venue">{event.venue.name}, {event.venue.city}</p>
          </div>

          {!showPayment ? (
            <div className="booking-form">
              <div className="form-group">
                <label>Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max={event.availableTickets}
                  value={tickets}
                  onChange={handleTicketsChange}
                />
                <p className="ticket-info">
                  {event.availableTickets} tickets available
                </p>
              </div>

              <div className="booking-summary">
                <div className="summary-row">
                  <span>Price per ticket:</span>
                  <span>${event.price}</span>
                </div>
                <div className="summary-row">
                  <span>Number of tickets:</span>
                  <span>{tickets}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>${totalAmount}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => setShowPayment(true)}
              >
                Proceed to Payment
              </button>
            </div>
          ) : (
            <div className="payment-section">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  event={event}
                  bookingId={bookingId}
                  tickets={tickets}
                  totalAmount={totalAmount}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Booking

