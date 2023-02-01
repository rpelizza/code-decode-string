import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	private secretKey!: string;
	private iv!: string;

	ngOnInit(): void {
		this.generateKeyAndIV().then((result) => {
			console.log(result);
			this.secretKey = result.secretKey;
			this.iv = result.iv;
		});

		console.log(`SecretKey: ${this.secretKey}`);
		console.log(`IV: ${this.iv}`);
	}

	criptografar() {
		const text = (document.getElementById('input') as HTMLInputElement)
			.value;
		this.encrypt(text).then((result) => {
			(document.getElementById('output') as HTMLInputElement).value =
				result;
		});
	}

	descriptografar() {
		const text = (document.getElementById('output') as HTMLInputElement)
			.value;
		if (text) {
			this.decrypt(text).then((result) => {
				(document.getElementById('output') as HTMLInputElement).value =
					result;
			});
		}
	}

	async generateKeyAndIV(): Promise<{ secretKey: string; iv: string }> {
		try {
			const key = await window.crypto.subtle.generateKey(
				{
					name: 'AES-GCM',
					length: 256,
				},
				true,
				['encrypt', 'decrypt']
			);

			const exportedKey = await window.crypto.subtle.exportKey(
				'raw',
				key
			);
			const secretKey = this.arrayBufferToHexString(exportedKey);

			const iv = window.crypto.getRandomValues(new Uint8Array(12));
			const ivHex = this.arrayBufferToHexString(iv);

			return { secretKey, iv: ivHex };
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async encrypt(data: string): Promise<string> {
		try {
			const key = await window.crypto.subtle.importKey(
				'raw',
				this.hexStringToArrayBuffer(this.secretKey),
				{
					name: 'AES-GCM',
				},
				false,
				['encrypt']
			);

			const iv = this.hexStringToArrayBuffer(this.iv);

			const encrypted = await window.crypto.subtle.encrypt(
				{
					name: 'AES-GCM',
					iv,
				},
				key,
				new TextEncoder().encode(data)
			);

			return this.arrayBufferToHexString(encrypted);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async decrypt(encryptedData: string): Promise<string> {
		try {
			const key = await window.crypto.subtle.importKey(
				'raw',
				this.hexStringToArrayBuffer(this.secretKey),
				{
					name: 'AES-GCM',
				},
				false,
				['decrypt']
			);

			const iv = this.hexStringToArrayBuffer(this.iv);

			const decryptedArray = await window.crypto.subtle.decrypt(
				{
					name: 'AES-GCM',
					iv,
				},
				key,
				this.hexStringToArrayBuffer(encryptedData)
			);

			return new TextDecoder().decode(decryptedArray);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	arrayBufferToHexString(buffer: ArrayBuffer): string {
		return Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	hexStringToArrayBuffer(hexString: string): ArrayBuffer {
		return new Uint8Array(
			hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
		).buffer;
	}
}
