import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  className?: string;
}

const variants = {
  basico: "bg-white text-black border-black dark:bg-black dark:text-white dark:border-white",
  intermedio: "bg-[#ff3344] text-white border-black dark:border-white",
  avanzado: "bg-black text-white border-white dark:bg-white dark:text-black dark:border-black",
};

export default function Badge({ difficulty, className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 text-[10px] font-black tracking-widest uppercase border-2 shadow-[2px_2px_0px_0px_#ff3344]",
      variants[difficulty] || variants.basico,
      className
    )}>
      {difficulty}
    </span>
  );
}
