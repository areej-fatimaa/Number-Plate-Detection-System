import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentForm from '@/components/subscription/paymentform'; // Adjust the path based on your project structure
import { loadStripe } from '@stripe/stripe-js';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Mock Stripe.js
const mockStripe = {
  confirmCardPayment: jest.fn(),
} as unknown as Stripe;

const mockElements = {
  getElement: jest.fn(),
} as unknown as StripeElements;

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(() => mockStripe),
  useElements: jest.fn(() => mockElements),
  CardElement: () => <div data-testid="card-element" />,
}));

const stripePromise = loadStripe('test-publishable-key'); // Replace with your publishable key for testing

describe('PaymentForm Component', () => {
  const clientSecret = 'test-client-secret';
  const subscriptionId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CardElement and Pay Now button', () => {
    render(
      <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} subscriptionId={subscriptionId} />
      </Elements>
    );

    expect(screen.getByTestId('card-element')).toBeInTheDocument();
    expect(screen.getByText('Pay Now')).toBeDisabled(); // Button should be disabled initially
  });

  test('enables Pay Now button when Stripe.js is loaded', () => {
    jest.mock('@stripe/react-stripe-js', () => ({
      useStripe: jest.fn(() => mockStripe),
      useElements: jest.fn(() => mockElements),
    }));

    render(
      <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} subscriptionId={subscriptionId} />
      </Elements>
    );

    expect(screen.getByText('Pay Now')).not.toBeDisabled();
  });

  test('handles successful payment', async () => {
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: 'succeeded' },
    });

    mockElements.getElement.mockReturnValue({}); // Mock CardElement

    render(
      <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} subscriptionId={subscriptionId} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Pay Now' }));

    await waitFor(() =>
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument()
    );
  });

  test('handles payment failure', async () => {
    mockStripe.confirmCardPayment.mockResolvedValue({
      error: { message: 'Payment failed.' },
    });

    mockElements.getElement.mockReturnValue({}); // Mock CardElement

    render(
      <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} subscriptionId={subscriptionId} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Pay Now' }));

    await waitFor(() =>
      expect(screen.getByText('Payment failed.')).toBeInTheDocument()
    );
  });

  test('shows error if CardElement is not loaded', async () => {
    mockElements.getElement.mockReturnValue(null); // Mock missing CardElement

    render(
      <Elements stripe={stripePromise}>
        <PaymentForm clientSecret={clientSecret} subscriptionId={subscriptionId} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Pay Now' }));

    await waitFor(() =>
      expect(screen.getByText('CardElement is not loaded.')).toBeInTheDocument()
    );
  });
});
