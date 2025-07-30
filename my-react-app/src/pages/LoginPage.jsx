import LoginForm from '../components/auth/login-form';

export default function LoginPage({ onAuth }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <LoginForm onAuth={onAuth} />
    </div>
  );
}