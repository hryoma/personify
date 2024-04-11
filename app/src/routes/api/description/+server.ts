import { json } from '@sveltejs/kit';
import { openai } from '$lib/server/openai';

export async function POST({ request }) {
	const prompt: string = `Do not add your own embellishments and simply package your understanding of this product/service into the following categories, prioritizing brevity and accuracy. Collect target customer demographic information - if multiple target demographics are provided, create a separate summary for each. Output in the following format:
  1. Product Overview: 
  - Name, Function & Price: [Brief description of what it does and its price point.] 
  - Key Features: [Brief description of key features.]
  - Design Features: [Brief description of the design and user experience.]
  2. Target Demographic (separated by bullet point if there are multiple): [Key characteristics of this type of customer.]

  If you did not receive explicit information for any of the categories above, please ask follow-up questions to ensure you have all of the information needed. Do not make up information!

  The following the user's provided description:`;

	const { userInput } = await request.json();

	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: userInput }
			],
			model: 'gpt-3.5-turbo'
		});
		return json({ gptMsg: completion.choices[0].message.content });
	} catch (error) {
		// console.error('Error:', error);
		return json({ error: error }, { status: 500 });
	}

	return json({ error: 'No response from OpenAI' }, { status: 500 });
}
