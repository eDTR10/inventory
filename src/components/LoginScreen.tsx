import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const LoginScreen = () => {
  const { login, googleTokenReceived, emailInput, setEmailInput, confirmEmail, error, isLoading } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-background/80">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div>
          <h1 className="text-4xl font-bold mb-2">Access Required</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to DICT Misamis Oriental <br />  Inventory System. 
          </p>
        </div>

        {!googleTokenReceived ? (
          <>
            <div className="bg-muted p-6 rounded-lg space-y-3 text-sm">
              <ul className="text-left space-y-2">
                <li> Please authenticate with Google to access the inventory features.</li>
              </ul>
            </div>

            <Button
              onClick={login}
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In with Google'}
            </Button>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded text-xs text-left">
              <p className="text-blue-900 dark:text-blue-100">
                <span className="font-semibold">💡 Tip:</span> Check your browser console (F12) for detailed login information.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Your data is secure because ...
            </p>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Google Authentication Successful</span>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm text-left mb-4">
                  <span className="font-semibold">We need your email address to complete the setup and track your actions.</span>
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-200 text-left">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-left">Your Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                  onKeyPress={(e) => e.key === 'Enter' && confirmEmail()}
                />
              </div>

              <Button
                onClick={confirmEmail}
                size="lg"
                className="w-full"
                disabled={!emailInput.trim() || isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue to System'}
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Sign In Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
