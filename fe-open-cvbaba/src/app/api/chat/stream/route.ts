import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_input, template_id } = body;

    if (!user_input) {
      return NextResponse.json({ error: 'user_input is required' }, { status: 400 });
    }

    // TODO: Implement the actual streaming logic here.
    // For now, just acknowledging that the data is in the expected format.

    const responseStream = new ReadableStream({
      start(controller) {
        const initialMessage = {
          type: 'status',
          message: 'Received request. Processing...',
        };
        controller.enqueue(`data: ${JSON.stringify(initialMessage)}\n\n`);

        // Simulate some work
        setTimeout(() => {
          const chunk = {
            type: 'chunk',
            content: 'This is a streamed response chunk.',
          };
          controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
        }, 1000);

        setTimeout(() => {
          const finalMessage = {
            type: 'complete',
            chat: {
              slug: 'new-chat-slug',
              pdf_content: `<html><body><h1>${user_input}</h1><p>Template: ${template_id}</p></body></html>`,
            },
          };
          controller.enqueue(`data: ${JSON.stringify(finalMessage)}\n\n`);
          controller.close();
        }, 2000);
      },
    });

    return new NextResponse(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat stream:', error);
    return NextResponse.json({ error: 'Failed to process chat stream' }, { status: 500 });
  }
}
