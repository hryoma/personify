import { json } from '@sveltejs/kit';
import { askGpt } from '$lib/server/openai';

export async function POST({ request }) {
	const prompt: string = `Do not add your own embellishments and simply package your understanding of this product/service into the following categories, prioritizing brevity and accuracy. Collect target customer demographic information - if multiple target demographics are provided, create a separate summary for each. Output in the following format:
    1. Product Overview: 
    - Name, Function & Price: [Brief description of what it does and its price point.] 
    - Key Features: [Brief description of key features.]
    - Design Features: [Brief description of the design and user experience.]
    2. Target Demographic (separated by bullet point if there are multiple): [Key characteristics of this type of customer.]

    If you did not receive explicit information for any of the categories above, please ask follow-up questions to ensure you have all of the information needed. Do not make up information!

    The following is the user's provided description:`;

	try {
		const { userInput } = await request.json();
		const gptMsg = await askGpt(prompt, userInput);
		return json({ gptMsg });
	} catch (error) {
		console.error('Error:', error);
		return json({ error: error }, { status: 500 });
	}

	return json({ error: 'No response from OpenAI' }, { status: 500 });
}
