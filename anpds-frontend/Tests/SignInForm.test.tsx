import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInForm from "@/components/Auth/SignInForm";
import { auth } from "@/firebase/firebase-config";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import '@testing-library/jest-dom'

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SignInForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the sign-in form correctly", () => {
    render(<SignInForm />);

    // Check for input fields and buttons
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In with Google/i })).toBeInTheDocument();
  });

  test("allows the user to input email and password", () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the inputs have the expected values
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("handles successful sign-in", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    // Wait for the async function to complete
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/Dashboard");
    });
  });

  test("displays an error message on sign-in failure", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error("Sign-in failed"));

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    // Wait for the async function to complete
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password123"
      );
      expect(mockRouterPush).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Error signing in:", "Sign-in failed");
    });
  });

  test("handles successful Google sign-in", async () => {
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({});

    render(<SignInForm />);

    const googleSignInButton = screen.getByRole("button", { name: /Sign In with Google/i });

    fireEvent.click(googleSignInButton);

    // Wait for the async function to complete
    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("displays an error message on Google sign-in failure", async () => {
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(new Error("Google sign-in failed"));

    render(<SignInForm />);

    const googleSignInButton = screen.getByRole("button", { name: /Sign In with Google/i });

    fireEvent.click(googleSignInButton);

    // Wait for the async function to complete
    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(mockRouterPush).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Error with Google sign-in:", "Google sign-in failed");
    });
  });
});
