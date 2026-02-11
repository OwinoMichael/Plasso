import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Terminal } from 'lucide-react';
import AuthService from '@/services/AuthService';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    
    // Basic password validation (minimum 8 characters)
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // TODO: Replace with your actual AuthService import
      // import { AuthService } from '@/services/auth-service';
      
      // Assuming your AuthService.signup expects (firstName, lastName, email, password)
      // For now, using username as both first and last name
      await AuthService.signup(
        username, // firstName
        
        email.trim(),
        password
      );

      // Store user data for unverified email page
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: email.trim(),
          verified: false,
          firstName: username,
          lastName: '',
        })
      );

      // Navigate to unverified email page
      navigate('/unverified-email', { replace: true });

    } catch (error: any) {
      console.error("Signup failed:", error);
      
      // Handle different error cases
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

  // Helper function to clear error when user starts typing
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Error Message */}
        {errorMessage && (
          <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <Terminal className="w-12 h-12 text-primary" />
          <h1 className="text-3xl font-bold">CodeSync</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => handleInputChange(setUsername, e.target.value)}
              className="h-12 px-4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => handleInputChange(setEmail, e.target.value)}
              className="h-12 px-4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                className="h-12 px-4 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handleInputChange(setConfirmPassword, e.target.value)}
                className="h-12 px-4 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12"
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
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
