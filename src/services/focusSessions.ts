import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit as limitFn } from 'firebase/firestore'
import type { FocusSession } from '@/entities/focusSession'

export async function saveFocusSession(session: Partial<FocusSession>) {
  const col = collection(db, 'focusSessions')
  const doc = await addDoc(col, {
    ...session,
    createdAt: serverTimestamp(),
  })
  return doc.id
}

export async function getFocusSessionsForUser(userId: string) {
  const col = collection(db, 'focusSessions')
  const q = query(col, where('userId', '==', userId))
  const snap = await getDocs(q)
  const results: Array<FocusSession & { id: string }> = []
  snap.forEach((doc) => {
    const data = doc.data() as any
    const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt
    const startTime = data.startTime && typeof data.startTime.toDate === 'function' ? data.startTime.toDate() : data.startTime
    const endTime = data.endTime && typeof data.endTime.toDate === 'function' ? data.endTime.toDate() : data.endTime

    results.push({
      id: doc.id,
      userId: data.userId,
      topic: data.topic,
      startTime,
      endTime,
      durationSeconds: data.durationSeconds,
      createdAt,
    })
  })

  return results
}


export async function getFocusSessionsForUserBetween(
  userId: string,
  start: Date,
  end: Date,
  options?: { limit?: number },
) {
  if (!userId) throw new Error('getFocusSessionsForUserBetween: userId is required')
  if (!(start instanceof Date) || isNaN(start.getTime())) throw new Error('getFocusSessionsForUserBetween: valid start Date is required')
  if (!(end instanceof Date) || isNaN(end.getTime())) throw new Error('getFocusSessionsForUserBetween: valid end Date is required')
  if (start.getTime() > end.getTime()) throw new Error('getFocusSessionsForUserBetween: start must be <= end')

  const col = collection(db, 'focusSessions')
  const parts: any[] = [where('userId', '==', userId), where('startTime', '>=', start), where('startTime', '<=', end), orderBy('startTime', 'asc')]
  if (options?.limit && options.limit > 0) parts.push(limitFn(options.limit))
  const q = query(col, ...parts)

  try {
    const snap = await getDocs(q)
    const results: Array<FocusSession & { id: string }> = []
    snap.forEach((doc) => {
      const data = doc.data() as any

      const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt
      const startTime = data.startTime && typeof data.startTime.toDate === 'function' ? data.startTime.toDate() : data.startTime
      const endTime = data.endTime && typeof data.endTime.toDate === 'function' ? data.endTime.toDate() : data.endTime

      results.push({
        id: doc.id,
        userId: data.userId,
        topic: data.topic,
        startTime,
        endTime,
        durationSeconds: data.durationSeconds,
        createdAt,
      })
    })

    return results
  } catch (err: any) {
    const e = new Error(`getFocusSessionsForUserBetween failed: ${err?.message ?? err}`)
    ;(e as any).original = err
    throw e
  }
}





