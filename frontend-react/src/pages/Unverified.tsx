import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Mail, Loader2, CheckCircle } from 'lucide-react';

const Unverified = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const userEmail = "user@example.com"; // TODO: Get from auth context

  const handleResend = async () => {
    setLoading(true);
    // TODO: Implement resend verification email logic
    setTimeout(() => {
      setStatusMessage('Verification email sent successfully!');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="backdrop-blur-sm bg-card/80 border-border/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            
            <CardHeader className="text-center relative z-10 pb-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">CodeSync</span>
              </div>
              
              <CardTitle className="text-2xl mb-2">Verify Your Email</CardTitle>
              <CardDescription>
                We've sent a verification email to your address
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <Alert className="border-primary/20 bg-primary/5 backdrop-blur-sm">
                <Mail className="h-4 w-4 text-primary" />
                <AlertTitle>Verify your email!</AlertTitle>
                <AlertDescription>
                  We have sent an email to <strong>{userEmail}</strong> to verify your email address and activate your account.
                  <br /><br />
                  Click below if you did not receive an email or want us to resend the verification email.
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
                <Alert className="border-green-200 bg-green-50/80">
                  <AlertDescription className="text-green-700">
                    {statusMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Email verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-green-500" />
              <span>Secure delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unverified;