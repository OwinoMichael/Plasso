import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthService from '@/services/AuthService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    }
    
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setEmailError('');
    setStatusMessage('');

    try {
      // TODO: Replace with your actual AuthService import
      // import { AuthService } from '@/services/auth-service';
      
      // Assuming your AuthService has a forgotPassword method
      await AuthService.forgotPassword(email.trim());
      
      setStatusMessage('Password reset email sent successfully! Check your inbox for further instructions.');
      
    } catch (error: any) {
      console.error("Forgot password error:", error);
      
      // Handle different error cases
      if (error.response?.status === 404) {
        setEmailError('No account found with this email address.');
      } else if (error.response?.status === 400) {
        setEmailError('Invalid email format.');
      } else if (error.response?.status === 429) {
        setStatusMessage('Too many requests. Please wait before trying again.');
      } else {
        const fallback = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
        setStatusMessage(fallback);
      }
    } finally {
      setIsLoading(false);
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">CodeSync</span>
              </div>
              
              <CardTitle className="text-2xl mb-2">Forgot Password</CardTitle>
              <CardDescription>
                Provide the email address attached to your account and we will send a link to reset your password
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                        if (statusMessage) setStatusMessage('');
                      }}
                      className={cn(
                        "h-12 px-4 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200",
                        emailError ? "border-red-500 focus:border-red-500" : ""
                      )}
                      required
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 pl-1">{emailError}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending email...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  {statusMessage && (
                    <Alert className={cn(
                      "border-green-200 bg-green-50/80",
                      statusMessage.includes('error') || statusMessage.includes('Error') || statusMessage.includes('fail') 
                        ? "border-red-200 bg-red-50/80" 
                        : ""
                    )}>
                      <AlertDescription className={cn(
                        "text-green-700",
                        statusMessage.includes('error') || statusMessage.includes('Error') || statusMessage.includes('fail') 
                          ? "text-red-700" 
                          : ""
                      )}>
                        {statusMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    <Link to="/signup" className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors mr-4">
                      Sign up
                    </Link>
                    <Link to="/login" className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors">
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Secure & encrypted</span>
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

export default ForgotPassword;