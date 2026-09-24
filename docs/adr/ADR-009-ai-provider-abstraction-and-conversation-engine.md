# ADR-009: AI Provider Abstraction & Conversation Engine

## Status
Accepted

## Context
Voice AI agents require conversational reasoning, tool calling, and post-call intelligence extraction across various LLM providers (OpenAI, Anthropic, Google Gemini, local models). Direct coupling to a specific LLM SDK creates rigidity.

## Decision
Create an `LLMProvider` interface in `@p2d/ai` supporting:
1. Streaming next-turn generation with conversational context and active tools.
2. Structured output parsing for post-call intelligence (intent, entities, actions, summaries).
3. Adapters for OpenAI (`OpenAIProvider`), Gemini (`GeminiProvider`), Anthropic (`AnthropicProvider`), and a deterministic mock provider (`MockLLMProvider`) for tests.

## Consequences
- **Pros:** Model agility; cost optimization by routing low-complexity tasks to smaller models; fast deterministic unit testing.
- **Cons:** Must normalize tool-calling parameter formats across differing provider APIs.
