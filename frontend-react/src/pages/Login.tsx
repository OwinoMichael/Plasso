import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Eye, EyeOff, Loader2, CheckCircle, Shield } from 'lucide-react';
import AuthService from '@/services/AuthService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // TODO: Replace with your actual AuthService import
      // import { AuthService } from '@/services/auth-service';
      const response = await AuthService.login(email.trim(), password.trim());
      console.log('Login successful:', response);

      const user = AuthService.getCurrentUser();

      if (user?.verified) {
        navigate('/home', { replace: true });
      } else if (user && !user.verified) {
        // If you have an unverified email page
        navigate('/unverified-email', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (error: any) {
      console.error('Login error:', error);

      // Handle different error cases
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
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10">
              {/* Error Message */}
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
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
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
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

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors">
                      Sign up
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