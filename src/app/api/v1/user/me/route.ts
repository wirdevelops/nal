// app/api/v1/user/me/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const backendURL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/user/me'; // Go backend endpoint

    const response = await axios.get(backendURL, {
      withCredentials: true, // IMPORTANT: Forward cookies!
      // You might need to forward headers, especially authorization-related ones
      headers: {
         Cookie: request.headers.get('cookie') || '', // Forward cookies
      }
    });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    console.error("Proxy error:", error);
      if (axios.isAxiosError(error)) {
        return NextResponse.json(
              { message: error.response?.data?.error || "An error occurred" },
              { status: error.response?.status || 500 }
          );
      } else {
          return NextResponse.json(
              { message: "An unexpected error occurred" },
              { status: 500 }
          );
      }
  }
}