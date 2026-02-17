import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Terminal } from 'lucide-react';
import AuthService from '@/services/AuthService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VerifyMagicLink = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('No verification token provided');
        return;
      }

      try {
        const response = await AuthService.verifyMagicLink(token);
        
        setStatus('success');
        
        // Wait a moment to show success state
        setTimeout(() => {
          // Check if user needs to set username
          if (!response.user.hasUsername) {
            navigate('/setup-username', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
        }, 1500);
        
      } catch (error: any) {
        console.error('Magic link verification failed:', error);
        setStatus('error');
        
        if (error.name === 'INVALID_MAGIC_LINK') {
          setErrorMessage(error.message || 'Invalid or expired magic link');
        } else {
          setErrorMessage('Failed to verify magic link. Please try again.');
        }
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-card/80 border-border/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <CardHeader className="text-center relative z-10 pb-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Terminal className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">CodeSync</span>
            </div>
            
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Verifying...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="text-center py-8">
              {status === 'loading' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Verifying your magic link...
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to CodeSync!</h3>
                    <p className="text-sm text-muted-foreground">
                      Redirecting you to your dashboard...
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {errorMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mb-6">
                      Magic links expire after 15 minutes and can only be used once.
                    </p>
                    <Button
                      onClick={handleRetry}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      Request New Magic Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyMagicLink;