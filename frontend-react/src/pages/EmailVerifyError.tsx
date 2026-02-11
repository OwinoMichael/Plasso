import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, AlertCircle, Loader2, CheckCircle, Mail } from 'lucide-react';
import AuthService from '@/services/AuthService';

const EmailVerifyError = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Get email from localStorage or sessionStorage (from signup/login)
  const getStoredEmail = () => {
    try {
      // Check localStorage first (from signup)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.email) return user.email;
      }
      
      // Check sessionStorage (from login)
      const unverifiedEmail = sessionStorage.getItem('unverifiedEmail');
      if (unverifiedEmail) return unverifiedEmail;
      
      // Return empty string if no email found
      return '';
    } catch (error) {
      console.error('Error retrieving stored email:', error);
      return '';
    }
  };

  const handleResend = async () => {
    const email = getStoredEmail();
    
    if (!email) {
      setStatusMessage('No email address found. Please try signing up or logging in again.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setStatusMessage('');
    setIsSuccess(false);

    try {
      // TODO: Import your AuthService
      // import { AuthService } from '@/services/auth-service';
      
      await AuthService.resendVerification(email);
      
      setStatusMessage('Verification email sent successfully! Please check your inbox and spam folder.');
      setIsSuccess(true);
      
    } catch (error: any) {
      console.error('Resend verification error:', error);
      
      // Handle different error cases
      if (error.response?.status === 404) {
        setStatusMessage('No account found with this email address. Please sign up again.');
      } else if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('already verified')) {
          setStatusMessage('This account is already verified. You can now log in.');
        } else {
          setStatusMessage('Invalid request. Please try again.');
        }
      } else if (error.response?.status === 429) {
        setStatusMessage('Too many requests. Please wait a few minutes before trying again.');
      } else if (error.response?.status === 500) {
        setStatusMessage('Server error. Please try again later.');
      } else {
        const fallback = error.response?.data?.message || error.message || 'Failed to send verification email. Please try again.';
        setStatusMessage(fallback);
      }
      
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="backdrop-blur-sm bg-card/80 border-border/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            
            <CardHeader className="text-center relative z-10 pb-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CodeSync</span>
              </div>
              
              <CardTitle className="text-2xl mb-2">Verification Required</CardTitle>
              <CardDescription>
                Your verification token has expired. Click the button below to receive a new verification email.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Error!</AlertTitle>
                <AlertDescription className="text-red-700">
                  Verification token expired, click the button below to receive another email verification message
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleResend}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>

              {statusMessage && (
                <Alert className={
                  isSuccess 
                    ? 'border-green-200 bg-green-50/80 backdrop-blur-sm' 
                    : 'border-red-200 bg-red-50/80 backdrop-blur-sm'
                }>
                  <AlertDescription className={
                    isSuccess 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }>
                    {statusMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Secure verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-green-500" />
              <span>Email protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyError;