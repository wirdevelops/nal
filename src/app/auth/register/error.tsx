// app/auth/register/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}