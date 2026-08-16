import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.action || !body.sentiment) {
            return NextResponse.json(
                { status: 'error', message: 'Missing required fields: action and sentiment' },
                { status: 400 }
            );
        }

        // Validate sentiment value
        if (!['positive', 'negative'].includes(body.sentiment)) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid sentiment value. Must be "positive" or "negative"' },
                { status: 400 }
            );
        }

        // Extract data from request
        const feedbackData = {
            action: body.action,
            sentiment: body.sentiment,
            category: body.category || null,
            comment: body.comment || null,
            timestamp: body.timestamp || new Date().toISOString(),
            user_agent: request.headers.get('user-agent') || null,
        };

        // Get user ID from session/cookie if available
        // This will depend on your authentication setup
        // For now, we'll extract it from cookies if available
        const cookies = request.cookies;
        const userId = cookies.get('user_id')?.value || null;

        // Forward to backend API
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiBaseUrl) {
            console.error('NEXT_PUBLIC_API_BASE_URL is not configured');
            return NextResponse.json(
                { status: 'error', message: 'API configuration error' },
                { status: 500 }
            );
        }

        const response = await fetch(`${apiBaseUrl}/api/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Forward authentication cookies
                'Cookie': request.headers.get('cookie') || '',
            },
            body: JSON.stringify({
                ...feedbackData,
                user_id: userId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Backend API error:', errorData);
            return NextResponse.json(
                { status: 'error', message: 'Failed to store feedback' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        console.error('Error processing feedback:', error);
        return NextResponse.json(
            { status: 'error', message: 'Internal server error' },
            { status: 500 }
        );
    }
}
