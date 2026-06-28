import type { TripFormData, UserPreferences } from './types'

const TRIP_DATA_KEY = 'just_go_trip_data'
const PREFERENCES_KEY = 'just_go_preferences'

export function saveTripData(data: TripFormData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TRIP_DATA_KEY, JSON.stringify(data))
}

export function getTripData(): TripFormData | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(TRIP_DATA_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearTripData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TRIP_DATA_KEY)
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs))
}

export function getPreferences(): UserPreferences | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(PREFERENCES_KEY)
  return raw ? JSON.parse(raw) : null
}
