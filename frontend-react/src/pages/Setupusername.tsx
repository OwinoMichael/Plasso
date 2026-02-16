import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

const SetupUsername = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || '');
        
        // If user already has username, redirect to home
        if (user.hasUsername) {
          navigate('/home', { replace: true });
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    } else {
      // No user found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setErrorMessage('Username is required.');
      return;
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      setErrorMessage('Username must be between 3 and 20 characters.');
      return;
    }

    const usernameRegex = /^[a-z][a-z0-9_]{2,19}$/;
    if (!usernameRegex.test(username)) {
      setErrorMessage('Username must start with a letter and contain only lowercase letters, numbers, and underscores.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Get current user token
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('No user found');
      }
      
      const user = JSON.parse(userStr);
      
      // Update username via API
      const response = await axios.put(
        `${API_URL}/update-username`,
        { username: username.trim() },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Username updated:', response);

      // Update localStorage with new username and token
      const updatedUser = {
        ...user,
        username: username.trim(),
        hasUsername: true,
        // Update token if backend sends a new one (with username as subject)
        token: response.data.token || user.token
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Redirect to home
      navigate('/home', { replace: true });

    } catch (error: any) {
      console.error('Username update failed:', error);
      
      if (error.response?.status === 409 || 
          error.response?.data?.message?.toLowerCase().includes('already exists') ||
          error.response?.data?.message?.toLowerCase().includes('taken')) {
        setErrorMessage('This username is already taken. Please choose another one.');
      } else if (error.response?.status === 400) {
        setErrorMessage(error.response?.data?.message || 'Invalid username format.');
      } else {
        setErrorMessage('Failed to set username. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setUsername(value.toLowerCase()); // Auto-convert to lowercase
    if (errorMessage) setErrorMessage('');
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
            
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>

            <CardTitle className="text-2xl mb-2">Welcome to CodeSync!</CardTitle>
            <CardDescription>
              Let's get you set up with a username
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            {/* Welcome Message */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">You're almost there!</p>
                  <p className="text-muted-foreground">
                    Choose a unique username to complete your profile. This is how others will see you on CodeSync.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-xl mb-6">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="username" className="font-medium">
                  Choose your username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="h-12 px-4 bg-background/70 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary transition-all duration-200"
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  3-20 characters • lowercase letters, numbers, and underscores only
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue to CodeSync"
                )}
              </Button>
            </form>

            {userEmail && (
              <div className="text-center text-xs text-muted-foreground mt-6">
                Setting up account for <span className="font-medium">{userEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupUsername;