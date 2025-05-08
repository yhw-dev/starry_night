import React from 'react';
import { cn } from '../../utils/cn';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavLinksProps {
  links: NavLink[];
  className?: string;
  itemClassName?: string;
  mobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ 
  links, 
  className, 
  itemClassName,
  mobile = false 
}) => {
  return (
    <ul className={cn('flex gap-1', mobile ? 'flex-col' : 'flex-row', className)}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors relative block',
              link.active 
                ? 'text-indigo-600' 
                : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80',
              itemClassName
            )}
          >
            {link.label}
            {link.active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full transform origin-left" />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;