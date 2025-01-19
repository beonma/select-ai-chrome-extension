/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// const key = crypto.randomBytes(16).toString("hex");

export default {
	async fetch(request: Request, env: Env, _ctx): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('bad request !', { status: 400 });
		}

		const urlPathname = new URL(request.url).pathname;
		const encryptionKey = await getEncryptionKey(env.ENCRYPTION_KEY);

		switch (urlPathname) {
			case '/encrypt':
				const { data } = await request.json<{ data?: string }>();

				if (typeof data !== 'string') {
					return new Response('bad request !', { status: 400 });
				}

				const textEncoder = new TextEncoder();

				const dataBuffer = textEncoder.encode(data);
				const iv = crypto.getRandomValues(new Uint8Array(12));

				const result = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, encryptionKey, dataBuffer);

				const response = {
					encryptedData: btoa(String.fromCharCode(...new Uint8Array(result))),
					iv: btoa(String.fromCharCode(...iv)),
				};

				return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });

			case '/decrypt':
				const { encryptedData, iv: iVector } = await request.json<{ encryptedData?: string; iv?: string }>();

				if (typeof encryptedData !== 'string' || typeof iVector !== 'string') {
					return new Response('bad request !', { status: 400 });
				}

				const encryptedDataBuffer = new Uint8Array(
					atob(encryptedData)
						.split('')
						.map((c) => c.charCodeAt(0))
				);

				const iVectorBuffer = new Uint8Array(
					atob(iVector)
						.split('')
						.map((c) => c.charCodeAt(0))
				);

				const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iVectorBuffer }, encryptionKey, encryptedDataBuffer);
				const decodedDecryptedData = new TextDecoder().decode(decryptedData);

				return new Response(JSON.stringify({ decryptedData: decodedDecryptedData }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});

			default:
				return new Response('bad request !', { status: 400 });
		}
	},
} satisfies ExportedHandler<Env>;

function getEncryptionKey(encryption_key: string): Promise<CryptoKey> {
	const textEncoder = new TextEncoder();
	return crypto.subtle.importKey('raw', textEncoder.encode(encryption_key), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}
