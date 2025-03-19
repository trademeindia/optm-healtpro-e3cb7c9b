
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Add logging to debug visibility issues
  useEffect(() => {
    console.log('Login component mounted, theme:', theme);
    // Check if container is visible
    const container = document.querySelector('.min-h-screen');
    if (container) {
      console.log('Login container found in DOM');
    } else {
      console.warn('Login container not found in DOM');
    }
  }, [theme]);

  const handleDemoLogin = (role: 'doctor' | 'patient' | 'admin') => {
    console.log(`Logging in as ${role}`);
    // Simulate login with a demo account
    const demoUser = {
      id: `demo-${role}-${Date.now()}`,
      name: role === 'doctor' ? 'Dr. Demo Account' : role === 'admin' ? 'Admin Demo' : 'Patient Demo',
      email: `${role}@example.com`,
      role: role,
      provider: 'email'
    };
    
    // Store in localStorage to persist through page refresh
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    
    // Redirect to appropriate dashboard
    navigate(role === 'doctor' ? '/dashboard' : '/patient-dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative">
      <Card className="max-w-md w-full border shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Medical Dashboard Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your medical dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-center text-foreground">Demo Accounts</h3>
            <div className="grid gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('doctor')}
                className="w-full bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-foreground dark:text-white"
              >
                Continue as Doctor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('patient')}
                className="w-full bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-foreground dark:text-white"
              >
                Continue as Patient
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('admin')}
                className="w-full bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-foreground dark:text-white"
              >
                Continue as Admin
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button className="w-full" disabled={false}>
              Email & Password Login (Disabled in Demo)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
