import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';

export const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-background/80">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div>
          <h1 className="text-4xl font-bold mb-2">Access Required</h1>
          <p className="text-lg text-muted-foreground">
            You need to authenticate with Google to access the inventory system.
          </p>
        </div>

        <div className="bg-muted p-6 rounded-lg space-y-3 text-sm">
          <p className="text-left">
            <span className="font-semibold">Benefits:</span>
          </p>
          <ul className="text-left space-y-2">
            <li>✓ Secure access to your inventory data</li>
            <li>✓ Real-time synchronization with Google Sheets</li>
            <li>✓ Full CRUD operations</li>
            <li>✓ Automatic data backup</li>
          </ul>
        </div>

        <Button
          onClick={login}
          size="lg"
          className="w-full"
        >
          Sign In with Google
        </Button>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded text-xs text-left">
          <p className="text-blue-900 dark:text-blue-100">
            <span className="font-semibold">💡 Tip:</span> Check your browser console (F12) for detailed login information.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Your data is secure and we only access what you allow.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
