// app/auth/register/loading.tsx
export default function LoadingPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
    );
}