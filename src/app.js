const fs = require('fs').promises;
const path = require('path');
const readline = require('node:readline').promises
const OpenAI = require('openai');

const client = new OpenAI();

async function readFile(fileName) {
    return await fs.readFile(path.join(__dirname, fileName), 'utf-8');
}

function clearDocument(document) {
    return document
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
}

async function prepareDocument(document) {
        const file = await readFile(document);
        return clearDocument(file);
}

function createChunks(document, chunkSize, chunkOverlap) {
    const chunks = [];

    for (let i = 0; i < document.length; i += chunkSize - chunkOverlap) {
        const end = Math.min(i + chunkSize, document.length);
        chunks.push(document.substring(i, end));
    }

    return chunks
}

async function getEmbeddings(chunk) {
    const embedding = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
    });

    return embedding.data[0].embedding;
}

async function getUserPrompt() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const userPrompt = await rl.question("Ask a question about the document: ");
    rl.close();
    
    return userPrompt;
}

function zip(a, b) {
    return a.map((value, i) => [value, b[i]])
}

function dot(a, b) {
    const zipped = zip(a, b);

    return zipped.reduce((acc, [i1, i2]) => acc + i1 * i2, 0)
}

function magnitude(vect) {
    const sqSum = vect.reduce((acc, cur) => acc + cur ** 2, 0);

    return Math.sqrt(sqSum);
}

function cosineSimilarity(vectA, vectB) {
    const dotProduct = dot(vectA, vectB);
    const magnitudeA = magnitude(vectA);
    const magnitudeB = magnitude(vectB);

    return dotProduct / (magnitudeA * magnitudeB);
}

async function retrieve(query, documentEmbeddings, top_k = 5) {
    const userPromptEmbedding = await getEmbeddings(query);
    const similarities = documentEmbeddings.map(([chunk, embedding]) => [chunk, cosineSimilarity(userPromptEmbedding, embedding)]);

    similarities.sort((a, b) => b[1] - a[1]);;

    return similarities.slice(0, top_k);
}

async function generateResponse(userPrompt, mostRelevantChunks) {
    const response = await client.responses.create({
        model: 'gpt-4o-mini',
        input: [
            {
                role: 'system',
                content: 'Odpowiadaj na pytania korzystając tylko z dostarczonych fragmentów tesktu. Jeśli nie masz wystarczających informacji, powiedz "Nie wiem".'
            },
            {
                role: 'user',
                content: `
                    Pytanie uzytkownika: ${userPrompt}.
                    Fragmenty tekstu: ${mostRelevantChunks}.
                    Odpowiedz na pytanie korzystając tylko dostarczonych fragmentów tekstu.
                    Jeśli nie masz wystarczających informacji, powiedz "Nie wiem".
                `
            }
        ]
    })

    return response.output[0].content[0].text;
}

(async () => {
    try {
        const prepared = await prepareDocument('zemsta.txt');
        const chunks = createChunks(prepared, 500, 80);
        const documentEmbeddings = await Promise.all(
            chunks.map(async (chunk) => [chunk, await getEmbeddings(chunk)])
        );
        const userPrompt = await getUserPrompt();

        const retrieved = await retrieve(userPrompt, documentEmbeddings);
        const mostRelevantChunks = retrieved.map(([chunk]) => chunk).join(', ');

        const responseModel = await generateResponse(userPrompt, mostRelevantChunks);
        console.log(responseModel);

    } catch (err) {
        console.error(err);
    }
})()

