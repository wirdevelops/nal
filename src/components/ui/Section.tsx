import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted';
}

export function Section({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}: SectionProps) {
  return (
    <section
      className={cn(
        'py-24',
        {
          'bg-background': variant === 'default',
          'bg-muted/50': variant === 'muted',
        },
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
