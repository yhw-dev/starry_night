import React from 'react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface AuthButtonsProps {
  isLoggedIn?: boolean;
  userName?: string;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  className?: string;
  mobile?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isLoggedIn = false,
  userName,
  onLogin,
  onSignup,
  onLogout,
  className,
  mobile = false,
}) => {
  return (
    <div className={cn('flex gap-2', mobile ? 'flex-col' : 'flex-row', className)}>
      {isLoggedIn ? (
        <>
          <div className="text-sm font-medium text-slate-700">
            Welcome, {userName || 'User'}
          </div>
          <Button 
            variant="danger" 
            size={mobile ? 'md' : 'sm'} 
            onClick={onLogout}
            fullWidth={mobile}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            size={mobile ? 'md' : 'sm'} 
            onClick={onLogin}
            fullWidth={mobile}
          >
            Log in
          </Button>
          <Button 
            variant="primary" 
            size={mobile ? 'md' : 'sm'} 
            onClick={onSignup}
            fullWidth={mobile}
          >
            Sign up
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;