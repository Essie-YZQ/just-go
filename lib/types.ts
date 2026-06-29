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

export interface DayActivity {
  name: string
  category: string
  whyFits: string
  sources: string[]
}

export interface DayPlan {
  day: number
  morning: DayActivity
  afternoon: DayActivity
  evening: DayActivity
}

export interface SourceInsight {
  sourceValue: string
  role: string
  insight: string
  impact: 'High' | 'Medium' | 'Low'
}

export interface AlternativeVersion {
  title: string
  description: string
  tag?: string
}

export interface TravelResult {
  destination: string
  goNoGo: 'GO' | 'NO-GO'
  goNoGoReason: string
  confidence: 'High' | 'Solid' | 'Good'
  whyThisPlan: {
    summary: string
    bullets: string[]
  }
  sourceIntelligence: SourceInsight[]
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
  alternativeVersions: AlternativeVersion[]
  justGoRecommendation: string
  backupPlan: string
  bookingChecklist: string[]
}

export interface TravelProfile {
  id: string
  name: string
  trustedSources: string[]
  budget: string
  hotelStyle: string
  foodStyle: string
  activityStyle: string[]
  transportationPreference: string
}
