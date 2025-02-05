import React from 'react';

interface IconButtonProps {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className,
  text,
}) => (
  <button
    onClick={onClick}
    className={`mx-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-grey-500 ${className} cursor-pointer`}
  >
    {icon && <span>{icon}</span>}
      {text}
    </button>
  );

export default IconButton;