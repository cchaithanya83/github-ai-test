# OpenAI Chat API

This is an Express.js-based API for interacting with the OpenAI GPT-4 model. It allows developers to send questions to the AI and receive responses.

## Features

- Simple and clean API endpoint to ask questions and get AI responses.
- Easy integration with frontend or other backend systems.

## Prerequisites

- Node.js installed on your system.
- OpenAI API access and API key.
- GitHub Developer Token for API key storage.

## Setup Instructions

### 1. Clone the Repository

```bash
# Clone this repository
git clone <repository-url>

# Navigate into the directory
cd <repository-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Your API Key

1. Go to [GitHub Developer Settings](https://github.com/settings/tokens).
2. Generate a Personal Access Token with sufficient permissions.
3. Save this token as an environment variable.

For example, add the following line to your `.env` file or directly into your shell configuration:

```bash
export GITHUB_TOKEN="<your_api_key>"
```

### 4. Start the Server

```bash
node index.js
```

The server will start and listen on port `3000`.

## API Endpoints

### 1. `GET /`

- **Description:** Basic endpoint to test if the server is running.
- **Response:**
  ```
  Hello World
  ```

### 2. `POST /ask`

- **Description:** Accepts a user question and responds with the AI-generated answer.
- **Request Body:**
  ```json
  {
    "question": "<your_question_here>"
  }
  ```
- **Response:**
  ```json
  {
    "answer": "<AI_generated_answer>"
  }
  ```
- **Error Response:**
  ```json
  {
    "error": "An error occurred while processing your request."
  }
  ```

### Request Example

```bash
curl -X POST http://localhost:3000/ask \
-H "Content-Type: application/json" \
-d '{ "question": "What is the capital of France?" }'
```

### Response Example

```json
{
  "answer": "The capital of France is Paris."
}
```

## Additional Notes

- The OpenAI GPT model can be adjusted with parameters like `temperature` and `top_p` for better response tuning. Update the respective values in `index.js` as per your needs.
- Use this project as a starting point to build more complex AI-driven applications!

---

**Happy Coding!** 🚀
