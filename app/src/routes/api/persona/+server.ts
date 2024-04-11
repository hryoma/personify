import { json } from '@sveltejs/kit';
import { openai } from '$lib/server/openai';

export async function POST({ request }) {
	const prompt: string = `You are a potential customer within the specified customer demographic(s) for a new product/service as described below. Your feedback will simulate a genuine consumer reaction. If there are multiple target demographics provided, please respond separately by adopting the perspective of a potential customer within each demographic. Ensure that your responses reflect the specific needs, preferences, and experiences of the demographic mentioned. Use first-person narration to provide authentic insights.
    In your evaluations, address the following points:

    1. Interest Level and Usage: Does this product/service’s features and design interest you at the price point provided? Can you envision regular usage for yourself? Why or why not?
    2. If any, what are some improvements you would make to the product/service’s features, design, user experience, price, etc. to make it more appealing to you?
    3. How might others in your demographic respond? Is there another demographic that you believe would enjoy it equally or more?

    Please aim for concise insights. Specific, yet brief explanations are valued to understand your perspective better while optimizing token use. The following is the business and target demographic description:`;

	const { businessDesc } = await request.json();

	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: businessDesc }
			],
			model: 'gpt-3.5-turbo'
		});
		return json({ gptMsg: completion.choices[0].message.content });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: error }, { status: 500 });
	}

	return json({ error: 'No response from OpenAI' }, { status: 500 });
}
