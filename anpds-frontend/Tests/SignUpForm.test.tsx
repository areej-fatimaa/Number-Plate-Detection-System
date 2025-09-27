import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpForm from "@/components/Auth/SignUpForm";
import { auth } from "@/firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';
import '@testing-library/jest-dom'

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SignUpForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the sign-up form correctly", () => {
    render(<SignUpForm />);

    // Check for input fields and button
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("allows the user to input email and password", () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the inputs have the expected values
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("handles successful sign-up", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    // Wait for the async function to complete
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays an error message on sign-up failure", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error("Sign-up failed"));

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    // Wait for the async function to complete
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockRouterPush).not.toHaveBeenCalled();
      expect(screen.getByText(/Error signing up:/i)).toBeInTheDocument();
    });
  });
});
