// api/subscribe.ts
import { kv } from '@vercel/kv';

// This configures the function to run on Vercel's Edge Runtime,
// which is fast and uses standard Web APIs.
export const config = {
  runtime: 'edge',
};

// The main function that handles requests.
export default async function handler(request: Request) {
  // 1. Only allow POST requests.
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 2. Parse the JSON body from the request.
    const { email } = await request.json();

    // 3. Basic validation: check if email exists and is a string.
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ message: 'Email is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. More specific validation: check if it looks like an email.
    if (!/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ message: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Save the email to Vercel KV.
    // We use `hset` to store it in a "hash" (like a folder) called 'subscribers'.
    // The key is the email itself to prevent duplicates, and the value is the sign-up timestamp.
    await kv.hset('subscribers', { [email]: Date.now() });

    // 6. Send a success response back to the frontend.
    return new Response(JSON.stringify({ message: 'Success! You are on the list.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // 7. Handle errors, like if the request body isn't valid JSON.
    console.error(error);
    if (error instanceof SyntaxError) {
      return new Response(JSON.stringify({ message: 'Invalid request format.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ message: 'Something went wrong on our end.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
