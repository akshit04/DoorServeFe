import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  actions?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  subtitle, 
  className = '',
  size = 'lg',
  align = 'left',
  actions
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className={`flex ${actions ? 'justify-between items-start' : ''} ${align === 'center' ? 'flex-col items-center' : ''}`}>
        <div className={align === 'center' ? 'text-center' : ''}>
          <h1 className={`font-bold text-gray-900 leading-tight ${sizeClasses[size]} ${alignClasses[align]}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-gray-600 mt-3 text-lg leading-relaxed max-w-3xl ${alignClasses[align]} ${align === 'center' ? 'mx-auto' : ''}`}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0 ml-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
