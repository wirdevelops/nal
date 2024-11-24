import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ 
  title, 
  description, 
  align = 'left',
  className,
  ...props 
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12',
        {
          'text-center': align === 'center',
          'max-w-2xl mx-auto': align === 'center',
        },
        className
      )}
      {...props}
    >
      <h2 className="text-3xl font-display font-medium mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
