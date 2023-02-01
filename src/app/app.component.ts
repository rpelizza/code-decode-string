import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	private secretKey!: ArrayBuffer;
	private iv!: Uint8Array;

	ngOnInit(): void {
		//! AQUI ESTOU GERANDO UMA CHAVE ALEATÓRIA, MAS VOCÊ PODE USAR UMA CHAVE QUE VOCÊ QUISER
		//! (EX: '12345678901234567890123456789012') de 32 caracteres (256 bits)
		//! além de gerar o IV (INITIALIZATION VECTOR)
		//! que é um vetor de inicialização que é usado para criptografar e descriptografar
		this.generateKeyAndIV().then((result) => {
			console.log(result);
		});
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
		this.decrypt(text).then((result) => {
			console.log(result);
		});
	}

	async generateKeyAndIV(): Promise<void> {
		try {
			const keyAndIv = await window.crypto.subtle.generateKey(
				{
					name: 'AES-GCM',
					length: 256,
				},
				true,
				['encrypt', 'decrypt']
			);
			const key = await window.crypto.subtle.exportKey('raw', keyAndIv);
			this.secretKey = new Uint8Array(key);
			this.iv = new Uint8Array(12);
			window.crypto.getRandomValues(this.iv);
			console.log('Key: ', this.secretKey);
			console.log('IV: ', this.iv);
		} catch (error) {
			console.error(error);
		}
	}

	async encrypt(plaintext: string): Promise<string> {
		try {
			const data = new TextEncoder().encode(plaintext);
			const key = await window.crypto.subtle.importKey(
				'raw',
				this.secretKey,
				{ name: 'AES-GCM', length: 256 },
				false,
				['encrypt']
			);
			const encryptedData = await window.crypto.subtle.encrypt(
				{
					name: 'AES-GCM',
					iv: this.iv,
				},
				key,
				data
			);
			return btoa(
				new Uint8Array(encryptedData).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					''
				)
			);
		} catch (error) {
			console.error(error);
			return error as unknown as string;
		}
	}

	async decrypt(ciphertext: string): Promise<string> {
		try {
			const decoder = new TextDecoder();
			const data = new Uint8Array(
				atob(ciphertext)
					.split('')
					.map((c) => c.charCodeAt(0))
			);
			const key = await window.crypto.subtle.importKey(
				'raw',
				this.secretKey,
				{ name: 'AES-GCM', length: 256 },
				false,
				['decrypt']
			);
			const decryptedData = await window.crypto.subtle.decrypt(
				{
					name: 'AES-GCM',
					iv: this.iv,
				},
				key,
				data
			);
			return decoder.decode(new Uint8Array(decryptedData));
		} catch (error) {
			console.error(error);
			return error as unknown as string;
		}
	}
}
