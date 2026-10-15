import 'server-only'

import { createGoogle } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'

import { env } from '@/env'

const defaultModels = { groq: 'openai/gpt-oss-120b', google: 'gemini-2.5-flash' } as const

export function assistantModel() {
  const modelId = env.AI_MODEL ?? defaultModels[env.AI_PROVIDER]

  if (env.AI_PROVIDER === 'google') {
    if (!env.GOOGLE_GENERATIVE_AI_API_KEY) return null
    return {
      model: createGoogle({ apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY })(modelId),
      providerOptions: undefined,
    }
  }

  if (!env.GROQ_API_KEY) return null
  return {
    model: createGroq({ apiKey: env.GROQ_API_KEY })(modelId),
    providerOptions: modelId.startsWith('openai/gpt-oss')
      ? { groq: { reasoningEffort: 'low' as const } }
      : undefined,
  }
}

export const isAssistantConfigured = () =>
  env.AI_PROVIDER === 'google'
    ? Boolean(env.GOOGLE_GENERATIVE_AI_API_KEY)
    : Boolean(env.GROQ_API_KEY)
