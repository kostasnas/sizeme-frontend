import { supabase } from '../lib/supabase'

export async function saveScan(userId, scanData) {
  const { data, error } = await supabase
    .from('body_scans')
    .insert({ user_id: userId, ...scanData })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function saveResults(scanId, userId, results) {
  const rows = results.map(r => ({ scan_id: scanId, user_id: userId, ...r }))
  const { data, error } = await supabase.from('size_results').insert(rows).select()
  if (error) throw error
  return data
}

export async function getLatestScans(userId, limit = 10) {
  const { data, error } = await supabase
    .from('body_scans')
    .select('*, size_results(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function incrementFreeScans(userId) {
  const { error } = await supabase.rpc('increment_free_scans', { uid: userId })
  if (error) throw error
}
