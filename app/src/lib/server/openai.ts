import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { MOCK_ENABLED } from '$env/static/private';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function askGpt(prompt: string, userContent: string, model: string = 'gpt-3.5-turbo') {
	const res = MOCK_ENABLED
		? {
				choices: [
					{ message: { content: `Dummy response based on input: ${userContent.substring(0, 30)}` } }
				]
			}
		: await openai.chat.completions.create({
				messages: [
					{ role: 'system', content: prompt },
					{ role: 'user', content: userContent }
				],
				model
			});

	return res.choices[0].message.content;
}
