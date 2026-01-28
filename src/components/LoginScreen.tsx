import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';

export const LoginScreen = () => {
  const { login, loginWithEmail, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(true);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        
        // Redirect to the page they were trying to access, or stay on current page
        const from = (location.state as any)?.from?.pathname || location.pathname;
        if (from && from !== '/inventory/home') {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      
      // Redirect to the page they were trying to access, or stay on current page
      const from = (location.state as any)?.from?.pathname || location.pathname;
      if (from && from !== '/inventory/home') {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Email login failed:', err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-background/80">
      <div className="text-center space-y-6 p-8 max-w-md w-full">
        <div>
          <h1 className="text-4xl font-bold mb-2">Access Required</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to DICT Misamis Oriental <br />  Inventory System. 
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg space-y-3 text-sm">
          <ul className="text-left space-y-2">
            <li>✓ Please authenticate to access the inventory features.</li>
            <li>✓ Your account will be created automatically on first sign-in.</li>
          </ul>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-200 text-left">{error}</p>
          </div>
        )}

        {showEmailLogin ? (
          <>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  size="large"
                  theme="outline"
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  text="signin_with"
                  size="large"
                  theme="outline"
                />
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={() => setShowEmailLogin(true)}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Sign in with Email
            </Button>
          </>
        )}

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded text-xs text-left">
          <p className="text-blue-900 dark:text-blue-100">
            <span className="font-semibold">💡 Tip:</span> {showEmailLogin ? 'Use your registered email and password.' : 'Make sure pop-ups are enabled for this site.'}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Your data is secure and authenticated via {showEmailLogin ? 'secure token' : 'Google OAuth2'}.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
