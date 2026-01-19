import QRCodeScanner from '@/components/QRCodeScanner';
import UserProfile from '@/components/UserProfile';
import LoginScreen from '@/components/LoginScreen';
import { useAuth } from '@/context/AuthContext';

const ScannerPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-full w-full max-w-[1468px] flex flex-col justify-center">
        <UserProfile />
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full max-w-[1468px] flex flex-col justify-center">
      <UserProfile />
      <QRCodeScanner />
    </div>
  );
};

export default ScannerPage;
