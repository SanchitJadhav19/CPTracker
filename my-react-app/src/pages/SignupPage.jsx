import SignupForm from '../components/auth/signup-form';

export default function SignupPage({ onAuth }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <SignupForm onAuth={onAuth} />
    </div>
  );
}