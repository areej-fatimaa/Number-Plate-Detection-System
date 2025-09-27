import SignUpForm from "../components/Auth/SignUpForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="max-w-md w-full p-6 bg-gray-700 rounded-lg">
        <h1 className="text-3xl mb-6 text-white">Sign In</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
