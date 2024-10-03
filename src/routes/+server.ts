import { json } from '@sveltejs/kit';

export async function GET() {
	return json({
		note: 'Please refer to the docs for info: https://github.com/packify-dev/github-release/blob/main/api.md'
	}, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
