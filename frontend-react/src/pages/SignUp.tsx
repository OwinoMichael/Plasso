import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Eye, EyeOff, Loader2, Shield, Terminal, Mail, Sparkles } from 'lucide-react';
import AuthService from '@/services/AuthService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SignUp = () => {
  const navigate = useNavigate();
  
  // Magic Link State
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState('');
  
  // Traditional Signup State
  const [showTraditional, setShowTraditional] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Magic Link Handler
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!magicLinkEmail.trim()) {
      setMagicLinkError('Email is required.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(magicLinkEmail)) {
      setMagicLinkError('Please enter a valid email address.');
      return;
    }

    setIsMagicLinkLoading(true);
    setMagicLinkError('');

    try {
      // TODO: Replace with your actual magic link service
      // await MagicLinkService.sendSignUpLink(magicLinkEmail.trim());
      
      // Simulated API call - remove this in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMagicLinkSent(true);
    } catch (error: any) {
      console.error("Magic link failed:", error);
      setMagicLinkError(error.response?.data?.message || 'Failed to send magic link. Please try again.');
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  // Traditional Signup Handler (unchanged logic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await AuthService.signup(
        username,
        email.trim(),
        password
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email.trim(),
          verified: false,
          firstName: username,
          lastName: '',
        })
      );

      navigate('/unverified-email', { replace: true });

    } catch (error: any) {
      console.error("Signup failed:", error);
      
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('email') || error.response?.data?.message?.includes('Email')) {
          setErrorMessage('Email already exists. Please use a different email.');
        } else if (error.response?.data?.message?.includes('username') || error.response?.data?.message?.includes('Username')) {
          setErrorMessage('Username already exists. Please choose a different username.');
        } else {
          setErrorMessage(error.response?.data?.message || 'Invalid signup data.');
        }
      } else if (error.response?.status === 409) {
        setErrorMessage('An account with this email already exists.');
      } else {
        const fallback = error.response?.data?.message || error.message || 'An error occurred during signup.';
        setErrorMessage(fallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (errorMessage) setErrorMessage('');
    if (magicLinkError) setMagicLinkError('');
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
                  <Terminal className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">CodeSync</span>
              </div>
              
              <CardTitle className="text-2xl mb-2">Create your account</CardTitle>
              <CardDescription>
                {magicLinkSent 
                  ? "Check your email for the magic link"
                  : showTraditional 
                    ? "Sign up with email and password" 
                    : "Get started in seconds with a magic link"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              {/* Magic Link Success Message */}
              {magicLinkSent && (
                <div className="text-center space-y-4 py-8">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      We've sent a magic link to
                    </p>
                    <p className="text-sm font-medium text-foreground mb-4">
                      {magicLinkEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click the link in the email to complete your signup. The link expires in 15 minutes.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMagicLinkSent(false);
                      setMagicLinkEmail('');
                    }}
                    className="w-full"
                  >
                    Send another link
                  </Button>
                </div>
              )}

              {/* Magic Link Form */}
              {!magicLinkSent && !showTraditional && (
                <>
                  {magicLinkError && (
                    <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-xl mb-6">
                      {magicLinkError}
                    </div>
                  )}

                  <form onSubmit={handleMagicLinkSubmit} className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground mb-1">No password needed</p>
                        <p className="text-muted-foreground">We'll send you a secure link to sign up instantly.</p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="magic-email" className="font-medium">Email address</Label>
                      <Input
                        id="magic-email"
                        type="email"
                        placeholder="you@example.com"
                        value={magicLinkEmail}
                        onChange={(e) => handleInputChange(setMagicLinkEmail, e.target.value)}
                        className="h-12 px-4 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                      disabled={isMagicLinkLoading}
                    >
                      {isMagicLinkLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending magic link...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Continue with magic link
                        </>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11"
                      onClick={() => setShowTraditional(true)}
                    >
                      Sign up with email & password
                    </Button>
                  </form>
                </>
              )}

              {/* Traditional Signup Form */}
              {!magicLinkSent && showTraditional && (
                <>
                  {errorMessage && (
                    <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-xl mb-6">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="username" className="font-medium">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => handleInputChange(setUsername, e.target.value)}
                        className="h-12 px-4 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className="font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => handleInputChange(setEmail, e.target.value)}
                        className="h-12 px-4 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password" className="font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => handleInputChange(setPassword, e.target.value)}
                          className="h-12 px-4 pr-12 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => handleInputChange(setConfirmPassword, e.target.value)}
                          className="h-12 px-4 pr-12 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setShowTraditional(false)}
                    >
                      ← Back to magic link
                    </Button>
                  </form>
                </>
              )}

              {!magicLinkSent && (
                <div className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors">
                    Sign in
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Secure & encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-500" />
              <span>Privacy protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;