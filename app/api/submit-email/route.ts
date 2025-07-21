import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email,
          source: 'wait_list_page'
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('HubSpot API error:', error);
      if (response.status === 409 && error.category === 'CONFLICT') {
        return NextResponse.json({ message: "You're already on the waitlist." }, { status: 409 });
      }
      return NextResponse.json({ error: error.message || 'Failed to save email' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Email submission error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
} 