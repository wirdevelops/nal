// app/lib/api.ts

export interface ApiError {
    error: string;
  }
  
  export async function postRequest(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData: ApiError = await response.json(); // Expect error to be JSON
      throw new Error(errorData.error || 'An unexpected error occurred'); // Use more specific error
    }
  
    return await response.json();
  }