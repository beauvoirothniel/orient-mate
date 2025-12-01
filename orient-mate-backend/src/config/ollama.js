import fetch from 'node-fetch';

class OllamaConfig {
  constructor() {
    this.baseURL = 'http://localhost:11434/api';
    this.defaultModel = 'llama3.2:3b';
  }

  async chat(options) {
    const { model = this.defaultModel, messages, stream = false, options: generationOptions = {} } = options;

    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: stream,
        options: generationOptions
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${errorText}`);
    }

    return await response.json();
  }

  async generate(options) {
    const { model = this.defaultModel, prompt, stream = false, options: generationOptions = {} } = options;

    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: stream,
        options: generationOptions
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${errorText}`);
    }

    return await response.json();
  }
}

export default new OllamaConfig();