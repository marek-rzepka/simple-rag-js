# RAG (Retrieval-Augmented Generation) – Node.js
A simple RAG project written in Node.js using an OpenAI model.
It allows you to ask questions and get answers based on a provided document.


## Features
- Basic text cleaning
- Chunk generation with overlap
- Representing chunks as vectors
- Representing the user query as a vector
- Calculating cosine similarity to find text chunks similar to the user’s query
- Creating a prompt from the query and selected text fragments and sending it to the model to obtain an answer

## Requirements
- Node.js >= 18
- OpenAI account and API key (set as the OPENAI_API_KEY environment variable)

## Installation
```bash
npm install
```

## Usage
1. Place a text file (e.g., "zemsta.txt") in the `src/`.
2. Run the application:
```bash
node src/app.js
```
3. Enter a question related to the document content when prompted.

## Files
- `src/app.js` – main application file
- `src/zemsta.txt` – example text document

## How It Works
The application splits the document into chunks, generates embeddings, and then—based on the user’s query—retrieves the most relevant chunks and generates an answer using only those fragments.

## License
MIT
