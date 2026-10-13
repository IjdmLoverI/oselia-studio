import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

function revalidateSite(context: Record<string, unknown>) {
  if (context.disableRevalidate) return
  revalidatePath('/', 'layout')
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateSite(req.context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req.context)
  return doc
}
