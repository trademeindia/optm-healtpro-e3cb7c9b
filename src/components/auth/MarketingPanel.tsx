
import React from 'react';
import { motion } from 'framer-motion';

interface MarketingPanelProps {
  userType: 'doctor' | 'patient';
}

const MarketingPanel: React.FC<MarketingPanelProps> = ({ userType }) => {
  return (
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
  );
};

export default MarketingPanel;
