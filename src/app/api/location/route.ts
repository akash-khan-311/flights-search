/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/location/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    // Access token request
    const tokenResponse = await fetch(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.NEXT_PUBLIC_API_KEY || '',
          client_secret: process.env.NEXT_PUBLIC_API_SECRET || '',
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch token' },
        { status: 500 }
      );
    }

    const token = tokenData.access_token;

    if (!token) {
      return NextResponse.json(
        { error: 'Access token not found' },
        { status: 500 }
      );
    }

    // Call location API
    const locationResponse = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const locationData = await locationResponse.json();

    if (!locationResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      );
    }

    return NextResponse.json(locationData);
  } catch (error) {
    return NextResponse.json(
      { error: (error as any)?.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
