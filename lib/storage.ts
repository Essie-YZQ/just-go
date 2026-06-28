import type { TripFormData, TravelProfile } from './types'

const TRIP_DATA_KEY = 'just_go_trip_data'
const PROFILES_KEY = 'just_go_profiles'

// ─── Default profiles (seeded on first access) ───────────────────────────────

const DEFAULT_PROFILES: TravelProfile[] = [
  {
    id: 'profile-china-food',
    name: 'China Food Trip',
    trustedSources: ['rednote', 'michelin'],
    budget: 'midrange',
    hotelStyle: 'boutique',
    foodStyle: 'street-food',
    activityStyle: ['food', 'art', 'photography'],
    transportationPreference: 'public',
  },
  {
    id: 'profile-europe-luxury',
    name: 'Europe Luxury',
    trustedSources: ['michelin', 'eater'],
    budget: 'luxury',
    hotelStyle: 'luxury',
    foodStyle: 'fine-dining',
    activityStyle: ['museums', 'art', 'history'],
    transportationPreference: 'rideshare',
  },
  {
    id: 'profile-weekend',
    name: 'Weekend Getaway',
    trustedSources: ['reddit', 'google-reviews'],
    budget: 'budget',
    hotelStyle: 'any',
    foodStyle: 'any',
    activityStyle: ['nature', 'adventure', 'beach'],
    transportationPreference: 'rental',
  },
]

// ─── Trip data ────────────────────────────────────────────────────────────────

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

// ─── Travel Profiles ──────────────────────────────────────────────────────────

export function getProfiles(): TravelProfile[] {
  if (typeof window === 'undefined') return DEFAULT_PROFILES
  const raw = localStorage.getItem(PROFILES_KEY)
  if (!raw) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(DEFAULT_PROFILES))
    return DEFAULT_PROFILES
  }
  return JSON.parse(raw) as TravelProfile[]
}

export function saveProfile(profile: TravelProfile): void {
  if (typeof window === 'undefined') return
  const profiles = getProfiles()
  const idx = profiles.findIndex((p) => p.id === profile.id)
  if (idx >= 0) {
    profiles[idx] = profile
  } else {
    profiles.push(profile)
  }
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function deleteProfile(id: string): void {
  if (typeof window === 'undefined') return
  const profiles = getProfiles().filter((p) => p.id !== id)
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}
