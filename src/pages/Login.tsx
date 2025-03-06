
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [userType, setUserType] = useState<'doctor' | 'patient'>('doctor');
  const { login, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await forgotPassword(forgotEmail);
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (value: string) => {
    if (value === 'doctor' || value === 'patient') {
      setUserType(value);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient ml-4">OPTM HealPro</h1>
          </div>
          
          {!showForgotPassword ? (
            <>
              <Tabs 
                defaultValue="doctor" 
                className="mb-6"
                onValueChange={handleTabChange}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="doctor" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Doctor</span>
                  </TabsTrigger>
                  <TabsTrigger value="patient" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Patient</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="doctor">
                  <h2 className="text-2xl font-bold mb-2">Doctor Login</h2>
                  <p className="text-muted-foreground mb-4">Access patient records and treatment plans</p>
                </TabsContent>
                <TabsContent value="patient">
                  <h2 className="text-2xl font-bold mb-2">Patient Login</h2>
                  <p className="text-muted-foreground mb-4">View your health data and treatment progress</p>
                </TabsContent>
              </Tabs>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder={userType === 'doctor' ? "doctor@example.com" : "patient@example.com"}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? 
                        <EyeOff className="h-5 w-5 text-muted-foreground" /> : 
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
              
              <p className="mt-8 text-center text-sm text-muted-foreground">
                {userType === 'doctor' 
                  ? 'Demo: doctor@example.com / password123' 
                  : 'Demo: patient@example.com / password123'}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-muted-foreground mb-8">Enter your email to receive a password reset link</p>
              
              <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                  <Label htmlFor="forgotEmail">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 py-2"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={isSubmitting}
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Link'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
      
      {/* Right side - Image Background */}
      <div className="hidden md:block w-1/2 bg-gradient-to-br from-primary to-accent p-10">
        <div className="h-full flex flex-col justify-center items-center">
          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-md text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Welcome to OPTM HealPro</h2>
            <p className="mb-4">
              {userType === 'doctor' 
                ? 'Access your patient records, biomarkers, and treatment plans all in one place.'
                : 'Monitor your health progress, treatment plans, and communicate with your doctor.'}
            </p>
            <ul className="space-y-2">
              {userType === 'doctor' ? (
                <>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Advanced patient tracking</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Interactive anatomical models</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Biomarker analysis and trends</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Secure and compliant platform</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Track your health progress</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>View your treatment plan</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Communication with your doctor</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Secure access to medical records</span>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
