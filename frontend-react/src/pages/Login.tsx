import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Eye, EyeOff, Loader2, CheckCircle, Shield, Mail, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AuthService from '@/services/AuthService';

const Login = () => {
  const navigate = useNavigate();
  
  // Magic Link State
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState('');
  
  // Traditional Login State
  const [showTraditional, setShowTraditional] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      await AuthService.sendMagicLink(magicLinkEmail.trim());
      setMagicLinkSent(true);
    } catch (error: any) {
      console.error("Magic link failed:", error);
      
      if (error.name === 'ACCOUNT_NOT_FOUND') {
        setMagicLinkError('No account found with this email. Please sign up first.');
      } else {
        setMagicLinkError(error.response?.data?.message || error.message || 'Failed to send magic link. Please try again.');
      }
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  // Traditional Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await AuthService.login(email.trim(), password.trim());
      console.log('Login successful:', response);

      const user = AuthService.getCurrentUser();

      if (user?.verified) {
        navigate('/home', { replace: true });
      } else if (user && !user.verified) {
        navigate('/unverified-email', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (error: any) {
      console.error('Login error:', error);

      if (error.name === 'ACCOUNT_NOT_VERIFIED') {
        const unverifiedEmail = error.data?.email || email;
        sessionStorage.setItem('unverifiedEmail', unverifiedEmail);
        navigate('/unverified-email', { replace: true });
        return;
      } else if (error.name === 'INVALID_CREDENTIALS' || error.response?.status === 401) {
        setErrorMessage('Invalid email or password.');
      } else {
        const fallback = error.response?.data?.message || error.message || 'An error occurred during login.';
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
              
              <CardTitle className="text-2xl mb-2">Welcome Back</CardTitle>
              <CardDescription>
                {magicLinkSent 
                  ? "Check your email for the magic link"
                  : showTraditional 
                    ? "Sign in with your credentials" 
                    : "Sign in instantly with a magic link"}
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
                      Click the link in the email to sign in. The link expires in 15 minutes.
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
                        <p className="font-medium text-foreground mb-1">Quick & secure access</p>
                        <p className="text-muted-foreground">Enter your email and we'll send you a link to sign in.</p>
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
                      Sign in with email & password
                    </Button>
                  </form>
                </>
              )}

              {/* Traditional Login Form */}
              {!magicLinkSent && showTraditional && (
                <>
                  {errorMessage && (
                    <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-xl mb-6">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
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

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
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
                    </div>
                  </form>
                </>
              )}

              {!magicLinkSent && (
                <div className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors">
                    Sign up
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

export default Login;