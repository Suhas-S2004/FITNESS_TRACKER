import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { AtSignIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Toaster } from "react-hot-toast";

const Login = () => {

  const [state, setState] = useState('sign up')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);
    if (state === 'login') {
      await login({ email, password })
    } else {
      await signup({ username, email, password })
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <>
    <Toaster />
      <main className="login-page-container">
        <form onSubmit={handleSubmit}className="login-form">

          <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
            {state === 'login' ? "Sign In" : "Sign up"}
          </h2>

          <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
            {state === 'login'
              ? 'Please enter email and password to access.'
              : 'Please enter your details to create an account.'}
          </p>

          {/* Username */}
          {state !== 'login' && (
            <div className="mt-4">
              <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
                Username
              </label>

              <div className="relative mt-2">
                <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />

                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="enter a username"
                  className="login-input"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>

            <div className="relative mt-2">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="enter email"
                className="login-input"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>

            <div className="relative mt-2">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Please enter your password"
                className="login-input pr-10"
                type={showPassword ? 'text' : 'password'}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button mt-6"
          >
            {isSubmitting ? "Signing in..." : state === "login" ? "Login" : "Sign up"}
          </button>
          {state === 'login' ? (
            <p className="mt-4 text-sm text-gray-500/90 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                onClick={() => setState('signup')}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-500/90 dark:text-gray-400">
              Already have an account?{' '}
              <button
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                onClick={() => setState('login')}
              >
                Sign in
              </button>
            </p>
          )}
        </form>
      </main>
    </>
  )
}

export default Login;