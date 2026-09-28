import { requireSupabase } from './supabase'

const TABLE = 'items'

export async function fetchItems() {
  const client = requireSupabase()
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchItem(id) {
  const client = requireSupabase()
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createItem(payload) {
  const client = requireSupabase()
  const { data: authData, error: authError } = await client.auth.getUser()
  if (authError) throw authError
  const user = authData.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { data, error } = await client
    .from(TABLE)
    .insert({ ...payload, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateItem(id, payload) {
  const client = requireSupabase()
  const { data, error } = await client
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteItem(id) {
  const client = requireSupabase()
  const { error } = await client.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
