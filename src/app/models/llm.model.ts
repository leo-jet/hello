/**
 * LLM Model interface
 */
export interface LlmModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  maxTokens?: number;
  isAvailable: boolean;
  has_reasoning?: boolean;
  reasoning_level?: ('low' | 'medium' | 'high')[];
}
