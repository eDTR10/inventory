import axios from "axios";

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => { requestAccessToken: (options?: { prompt?: string }) => void };
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_API_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

console.log('🔧 Google Client ID configured:', GOOGLE_CLIENT_ID ? '✓ Present' : '✗ Missing');
console.log('📊 API Scope:', GOOGLE_API_SCOPE);

if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️ WARNING: VITE_GOOGLE_CLIENT_ID is not set! Add it to .env.local');
}

axios.defaults.baseURL = `https://sheets.googleapis.com/v4/spreadsheets/`;
axios.defaults.headers.get['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add access token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('google_access_token');
  
  console.log('Axios Request:', {
    url: config.url,
    hasToken: !!token,
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message,
      code: error.response?.data?.error?.code,
      url: error.response?.config?.url
    });
    return Promise.reject(error);
  }
);

// Initialize Google API
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    console.log('📡 Initializing Google API...');
    
    if (document.querySelector('script[src*="gsi/client"]')) {
      console.log('✓ Google script already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✓ Google API script loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('✗ Failed to load Google API script');
      reject(new Error('Failed to load Google API'));
    };
    document.head.appendChild(script);
  });
};

// Login with Google
export const loginWithGoogle = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    console.log('🔐 Attempting to login with Google...');
    console.log('📱 Client ID:', GOOGLE_CLIENT_ID);
    
    if (!GOOGLE_CLIENT_ID) {
      const error = 'VITE_GOOGLE_CLIENT_ID is not configured in .env.local';
      console.error('✗', error);
      reject(new Error(error));
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      const error = 'Google API not loaded. Make sure initializeGoogleAuth() was called.';
      console.error('✗', error);
      reject(new Error(error));
      return;
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_API_SCOPE,
        callback: async (response: any) => {
          console.log('📞 Google OAuth Callback received:', {
            hasAccessToken: !!response.access_token,
            error: response.error
          });
          
          if (response.access_token) {
            localStorage.setItem('google_access_token', response.access_token);
            
            // Try to get user info with the token
            try {
              const userInfoResponse = await fetch(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                {
                  headers: {
                    'Authorization': `Bearer ${response.access_token}`
                  }
                }
              );
              const userInfo = await userInfoResponse.json();
              if (userInfo.email) {
                localStorage.setItem('user_email', userInfo.email);
                console.log('✓ User email stored:', userInfo.email);
              }
            } catch (err) {
              console.warn('Could not fetch user info:', err);
            }
            
            console.log('✓ Access token saved successfully:', response.access_token.substring(0, 20) + '...');
            resolve(response.access_token);
          } else {
            const errorMsg = response.error || 'Unknown error';
            console.error('✗ No access token in response:', errorMsg);
            reject(new Error('Failed to get access token: ' + errorMsg));
          }
        },
        error_callback: (error: any) => {
          console.error('✗ Google OAuth Error:', error);
          reject(new Error(error?.error_description || error?.error || 'OAuth error'));
        }
      });

      console.log('🔘 Requesting access token with prompt...');
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (error) {
      console.error('✗ Exception during OAuth setup:', error);
      reject(error);
    }
  });
};

// Check if user is authenticated
export const isGoogleAuthenticated = (): boolean => {
  return !!localStorage.getItem('google_access_token');
};

export default axios;