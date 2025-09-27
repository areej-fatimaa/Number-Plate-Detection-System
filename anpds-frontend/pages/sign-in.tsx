import SignInForm from "../components/Auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="max-w-md w-full bg-gray-700 shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Sign In</h1>
        <SignInForm />
      </div>
    </div>
  );
}
