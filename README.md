# Code-Decode-String

Esse é um pacote para codificar e decodificar strings usando AES. Ele foi criado com o objetivo de tornar mais fácil o processo de criptografia de dados sensíveis. Ele utiliza o framework Angular para gerenciar a parte de front-end e as bibliotecas crypto-js e aes-js para realizar as operações de criptografia.

## Instalação

Para instalar esse pacote, você precisa ter o Node.js e o Angular CLI instalados em sua máquina. Então, basta rodar o seguinte comando no terminal:

```sh
npm install code-decode-string
```

## Uso

Para usar esse pacote, você precisa importá-lo em seu arquivo Angular. Em seguida, você pode usar as seguintes funções:

-   `generateKeyAndIV()`: Essa função gera uma chave secreta de 32 caracteres e um vetor de inicialização (IV) aleatórios. Ela retorna um objeto com duas propriedades: secretKey e iv. (Ela pode ser capturada no console do navegador e salva no environments.)

-   `encrypt(text: string, secretKey: string, iv: string)`: Essa função recebe como parâmetros a string a ser criptografada, a chave secreta e o IV. Ela retorna a string criptografada.

-   `decrypt(encryptedText: string, secretKey: string, iv: string)`: Essa função recebe como parâmetros a string criptografada, a chave secreta e o IV. Ela retorna a string original.

## Exemplo

A seguir, mostramos um exemplo de como usar esse pacote:

````javascript
import { generateKeyAndIV, encrypt, decrypt } from 'code-decode-string';

 const text = 'Texto sensível';
 generateKeyAndIV().then(result => {
   const secretKey = result.secretKey;
   const iv = result.iv;
   const encryptedText = encrypt(text, secretKey, iv);
   console.log('Texto criptografado:', encryptedText);
   const decryptedText = decrypt(encryptedText, secretKey, iv);
   console.log('Texto original:', decryptedText);    });     ```

Esperamos que esse pacote seja útil para você! Se tiver alguma dúvida ou sugestão, por favor entre em contato.
````
