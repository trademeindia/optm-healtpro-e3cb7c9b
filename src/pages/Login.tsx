
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import MarketingPanel from '@/components/auth/MarketingPanel';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    setIsLoading(true);
    toast.success('Login successful', {
      description: 'Redirecting to dashboard...'
    });
    
    // Simulate a slight delay before navigation for better UX
    setTimeout(() => {
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <Card className="w-full max-w-md border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">OPTM HealPro</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="pt-4">
                  <LoginForm 
                    onLoginSuccess={handleLoginSuccess} 
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <MarketingPanel />
      </div>
    </div>
  );
};

export default Login;
