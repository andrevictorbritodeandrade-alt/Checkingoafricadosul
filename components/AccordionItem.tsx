import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeColor } from '../types';

interface AccordionItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  themeColor?: ThemeColor;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  id, 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children,
  themeColor = 'green'
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
        setTimeout(() => {
             contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
  }, [isOpen]);

  const getThemeClasses = (color: ThemeColor, isActive: boolean) => {
    const base = {
      green: {
        border: 'border-l-sa-green',
        bgActive: 'bg-green-50',
        text: 'text-sa-green',
        iconBg: isActive ? 'bg-sa-green text-white' : 'bg-green-50 text-sa-green',
        title: isActive ? 'text-sa-green' : 'text-gray-700'
      },
      gold: {
        border: 'border-l-sa-gold',
        bgActive: 'bg-yellow-50',
        text: 'text-yellow-700',
        iconBg: isActive ? 'bg-sa-gold text-sa-black' : 'bg-yellow-50 text-yellow-700',
        title: isActive ? 'text-yellow-800' : 'text-gray-700'
      },
      red: {
        border: 'border-l-sa-red',
        bgActive: 'bg-red-50',
        text: 'text-sa-red',
        iconBg: isActive ? 'bg-sa-red text-white' : 'bg-red-50 text-sa-red',
        title: isActive ? 'text-sa-red' : 'text-gray-700'
      },
      blue: {
        border: 'border-l-sa-blue',
        bgActive: 'bg-blue-50',
        text: 'text-sa-blue',
        iconBg: isActive ? 'bg-sa-blue text-white' : 'bg-blue-50 text-sa-blue',
        title: isActive ? 'text-sa-blue' : 'text-gray-700'
      },
      black: {
        border: 'border-l-sa-black',
        bgActive: 'bg-gray-100',
        text: 'text-sa-black',
        iconBg: isActive ? 'bg-sa-black text-white' : 'bg-gray-100 text-sa-black',
        title: isActive ? 'text-sa-black' : 'text-gray-700'
      },
      white: { // Fallback for 'white' theme, usually not used for border
        border: 'border-l-gray-300',
        bgActive: 'bg-gray-50',
        text: 'text-gray-800',
        iconBg: isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800',
        title: isActive ? 'text-gray-900' : 'text-gray-700'
      }
    };
    return base[color];
  };

  const theme = getThemeClasses(themeColor as ThemeColor, isOpen);

  return (
    <div className={`mb-3 overflow-hidden rounded-2xl transition-all duration-300 ease-in-out border-l-[6px] ${theme.border} ${isOpen ? 'bg-white shadow-lg ring-1 ring-black/5' : 'bg-white shadow-md hover:shadow-lg'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none touch-manipulation group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl transition-colors duration-300 shadow-sm ${theme.iconBg} group-hover:opacity-90`}>
            {icon}
          </div>
          <span className={`text-lg font-display font-bold transition-colors tracking-wide ${theme.title} group-hover:opacity-80`}>
            {title}
          </span>
        </div>
        <ChevronDown 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? `transform rotate-180 ${theme.text}` : 'text-gray-300'}`} 
        />
      </button>

      <div 
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out overflow-hidden bg-white`}
        style={{ 
          maxHeight: isOpen ? contentRef.current?.scrollHeight ? `${contentRef.current.scrollHeight}px` : '1000px' : '0px',
          opacity: isOpen ? 1 : 0.8
        }}
      >
        <div className="p-5 pt-0 border-t border-dashed border-gray-100 mt-1">
          <div className="pt-4 font-sans max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;