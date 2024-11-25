import FileUpload from '@/components/FileUpload';

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">R2 Upload Test</h1>
        <div className="bg-white rounded-lg shadow">
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
