export interface TripFormData {
  destination: string
  departureCity: string
  arrivalDate: string
  tripLength: string
  hotelBudget: string
  transportationPreference: string
  foodPreference: string
  travelInterests: string[]
  travelPace: string
  trustedSources: string[]
}

export interface Restaurant {
  name: string
  cuisine: string
  description: string
  priceRange: string
  source?: string
}

export interface Activity {
  name: string
  type: string
  description: string
  duration: string
}

export interface DayPlan {
  day: number
  morning: string
  afternoon: string
  evening: string
}

export interface TravelResult {
  destination: string
  goNoGo: 'GO' | 'NO-GO'
  goNoGoReason: string
  bestArea: {
    name: string
    description: string
    whyStayHere: string
  }
  transportation: {
    fromAirport: string
    gettingAround: string
    tip: string
  }
  restaurants: Restaurant[]
  thingsToDo: Activity[]
  itinerary: DayPlan[]
  backupPlan: string
  bookingChecklist: string[]
}

export interface UserPreferences {
  budget: string
  favoriteCuisines: string[]
  travelPace: string
  transportationPreference: string
  trustedSources: string[]
  interests: string[]
}
