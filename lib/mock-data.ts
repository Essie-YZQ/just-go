import type { TripFormData, TravelResult, Restaurant, Activity, DayPlan } from './types'
import { SOURCES } from './constants'

const SOURCE_LABELS: Record<string, string> = Object.fromEntries(
  SOURCES.map((s) => [s.value, s.name])
)

function getPrimarySource(sources: string[]): string {
  if (sources.includes('rednote')) return 'rednote'
  if (sources.includes('michelin')) return 'michelin'
  if (sources.includes('eater')) return 'eater'
  if (sources.includes('reddit')) return 'reddit'
  if (sources.includes('local-blogs')) return 'local-blogs'
  return 'general'
}

function buildItinerary(days: number, morning: string, afternoon: string, evening: string): DayPlan[] {
  return Array.from({ length: Math.min(days, 5) }, (_, i) => ({
    day: i + 1,
    morning,
    afternoon,
    evening,
  }))
}

const DESTINATION_DATA: Record<string, (source: string, days: number) => TravelResult> = {
  tokyo: (source, days) => {
    const sourceLabel = SOURCE_LABELS[source] || 'General'
    const restaurantsBySource: Record<string, Restaurant[]> = {
      rednote: [
        { name: 'Ichiran Ramen Shibuya', cuisine: 'Ramen', description: 'Solo dining booths, ultra-concentrated tonkotsu broth — a must-photograph moment.', priceRange: '¥', source: sourceLabel },
        { name: 'Fuglen Tokyo', cuisine: 'Café', description: 'Norwegian coffee shop beloved on RedNote for its aesthetics and specialty brews.', priceRange: '¥', source: sourceLabel },
        { name: 'Afuri Ramen', cuisine: 'Yuzu Ramen', description: 'Light citrus broth trending heavily — perfect for the aesthetic food shot.', priceRange: '¥¥', source: sourceLabel },
      ],
      michelin: [
        { name: 'Sukiyabashi Jiro Honten', cuisine: 'Sushi', description: 'Three Michelin stars, world-famous omakase. Book 3 months in advance.', priceRange: '¥¥¥¥', source: sourceLabel },
        { name: 'Narisawa', cuisine: 'Innovative Japanese', description: 'Two stars, nature-inspired cuisine from chef Yoshihiro Narisawa.', priceRange: '¥¥¥¥', source: sourceLabel },
        { name: 'Den', cuisine: 'Modern Japanese', description: 'Two Michelin stars, playful kaiseki with a focus on Japanese produce.', priceRange: '¥¥¥', source: sourceLabel },
      ],
      reddit: [
        { name: 'Kikanbo Ramen', cuisine: 'Spicy Ramen', description: 'Reddit\'s top pick in Kanda — fiery miso broth, serious heat levels. Go early.', priceRange: '¥', source: sourceLabel },
        { name: 'Nakamura Tokichi', cuisine: 'Matcha Sweets', description: 'Hidden gem recommended by r/JapanTravel for matcha desserts near Senso-ji.', priceRange: '¥', source: sourceLabel },
        { name: 'Gonpachi Nishi-Azabu', cuisine: 'Izakaya', description: 'The "Kill Bill restaurant" — great food, great atmosphere, lesser-known by tourists.', priceRange: '¥¥', source: sourceLabel },
      ],
      general: [
        { name: 'Tsukiji Outer Market', cuisine: 'Seafood', description: 'Fresh sushi and tamagoyaki for breakfast — the classic Tokyo experience.', priceRange: '¥', source: sourceLabel },
        { name: 'Ichiran Ramen', cuisine: 'Ramen', description: 'Iconic solo ramen booths, perfect for first-time visitors.', priceRange: '¥', source: sourceLabel },
        { name: 'Tempura Kondo', cuisine: 'Tempura', description: 'Upscale tempura in Ginza, excellent quality and service.', priceRange: '¥¥¥', source: sourceLabel },
      ],
    }

    const restaurants = restaurantsBySource[source] ?? restaurantsBySource.general

    const activities: Activity[] = [
      { name: 'Shibuya Crossing', type: 'Landmark', description: 'The world\'s busiest pedestrian crossing — best experienced at rush hour.', duration: '30 min' },
      { name: 'Senso-ji Temple', type: 'Cultural', description: 'Tokyo\'s oldest temple in Asakusa, stunning at dawn before crowds arrive.', duration: '1–2 hours' },
      { name: 'teamLab Borderless', type: 'Art & Tech', description: 'Immersive digital art museum unlike anything else in the world.', duration: '3–4 hours' },
      { name: 'Shinjuku Golden Gai', type: 'Nightlife', description: 'Maze of tiny bars, each with a distinct personality. Best after 9pm.', duration: 'Evening' },
      { name: 'Harajuku Takeshita Street', type: 'Shopping', description: 'Youth fashion, crepes, and pop culture in one pedestrian street.', duration: '1–2 hours' },
    ]

    const itinerary = buildItinerary(
      days,
      'Tsukiji market breakfast → Senso-ji temple in Asakusa',
      'teamLab Borderless → Harajuku shopping',
      'Shibuya Crossing → Dinner in Shinjuku → Golden Gai bar-hopping'
    )

    return {
      destination: 'Tokyo',
      goNoGo: 'GO',
      goNoGoReason: `Tokyo is one of the most visitor-ready cities in the world — exceptional public transit, world-class food at every price point, and an infinite variety of neighborhoods to explore. Based on your trusted sources (${SOURCE_LABELS[source] || 'General'}), you'll find curated spots that match exactly what you're looking for.`,
      bestArea: {
        name: 'Shinjuku',
        description: 'Central, walkable, and packed with food, nightlife, and transit connections.',
        whyStayHere: 'Direct train access to all major attractions. Something happening at every hour.',
      },
      transportation: {
        fromAirport: 'Narita Express (NEX) to Shinjuku: ~90 min, ¥3,250. Haneda Airport: Keikyu Line or monorail, ~30 min.',
        gettingAround: 'Get a Suica card and use the metro. It goes everywhere and runs until midnight.',
        tip: 'Download the Google Maps Tokyo transit view — it\'s surprisingly accurate for trains.',
      },
      restaurants,
      thingsToDo: activities,
      itinerary,
      backupPlan: 'If teamLab Borderless is sold out, visit the Mori Art Museum in Roppongi Hills instead — stunning city views and world-class contemporary art.',
      bookingChecklist: [
        'Book flights to Tokyo (Narita or Haneda)',
        'Reserve hotel in Shinjuku or Shibuya',
        'Get travel insurance',
        'Order a Suica card or plan to get one on arrival',
        'Book teamLab Borderless in advance (sells out fast)',
        source === 'michelin' ? 'Book Sukiyabashi Jiro 3 months in advance' : 'Research top restaurants from your trusted sources',
        'Check Japan entry requirements & tourist SIM card options',
      ],
    }
  },

  paris: (source, days) => {
    const sourceLabel = SOURCE_LABELS[source] || 'General'
    const restaurantsBySource: Record<string, Restaurant[]> = {
      rednote: [
        { name: 'Café de Flore', cuisine: 'French Café', description: 'Most photographed café in Paris — art deco interior, iconic terrace. Perfect for content.', priceRange: '€€', source: sourceLabel },
        { name: 'Pierre Hermé', cuisine: 'Patisserie', description: 'The "Picasso of Pastry" — must try the Ispahan macaron.', priceRange: '€', source: sourceLabel },
        { name: 'Chez L\'Ami Jean', cuisine: 'Basque Bistro', description: 'Loved on Chinese travel communities for generous portions and authentic atmosphere.', priceRange: '€€', source: sourceLabel },
      ],
      michelin: [
        { name: 'Guy Savoy', cuisine: 'Modern French', description: 'Three stars in Monnaie de Paris. One of the greatest dining experiences in the world.', priceRange: '€€€€', source: sourceLabel },
        { name: 'Le Cinq', cuisine: 'Classic French', description: 'Three stars at Four Seasons George V — the ultimate Parisian luxury dining.', priceRange: '€€€€', source: sourceLabel },
        { name: 'Septime', cuisine: 'Modern Bistro', description: 'One star, natural wines, seasonal menu. The hardest reservation in Paris.', priceRange: '€€€', source: sourceLabel },
      ],
      reddit: [
        { name: 'L\'As du Fallafel', cuisine: 'Falafel', description: 'r/Paris calls this the best falafel in Europe. Cash only, always a line, always worth it.', priceRange: '€', source: sourceLabel },
        { name: 'Bouillon Chartier', cuisine: 'Traditional French', description: 'Classic brasserie, antique decor, incredible prices. Reddit\'s unanimous budget pick.', priceRange: '€', source: sourceLabel },
        { name: 'Frenchie Bar à Vins', cuisine: 'Modern French', description: 'No reservations, great natural wine, small plates — a Reddit favorite in the Sentier area.', priceRange: '€€', source: sourceLabel },
      ],
      general: [
        { name: 'Café de Flore', cuisine: 'French Café', description: 'Iconic Saint-Germain café, great for a classic Parisian morning.', priceRange: '€€', source: sourceLabel },
        { name: 'Breizh Café', cuisine: 'Crêpes', description: 'Best buckwheat galettes in Paris, sourced from Brittany.', priceRange: '€', source: sourceLabel },
        { name: 'Le Grand Véfour', cuisine: 'Classic French', description: 'Historic restaurant in the Palais-Royal arcades, a true Parisian institution.', priceRange: '€€€€', source: sourceLabel },
      ],
    }

    const restaurants = restaurantsBySource[source] ?? restaurantsBySource.general

    const itinerary = buildItinerary(
      days,
      'Croissant at a local boulangerie → Louvre Museum (book tickets in advance)',
      'Stroll through Le Marais → visit Sainte-Chapelle',
      'Sunset at Trocadéro → dinner in Saint-Germain → evening walk along the Seine'
    )

    return {
      destination: 'Paris',
      goNoGo: 'GO',
      goNoGoReason: `Paris rewards visitors who go with a plan. Crowds can be intense at major landmarks, but the city's neighborhoods have an energy that\'s impossible to replicate. Based on ${SOURCE_LABELS[source] || 'General'} recommendations, you'll find spots beyond the tourist trail.`,
      bestArea: {
        name: 'Le Marais (3rd/4th arrondissement)',
        description: 'Historic, walkable, and centrally located. Mix of museums, galleries, and great food.',
        whyStayHere: 'Walking distance to the Louvre, Notre-Dame, and some of the best restaurants in the city.',
      },
      transportation: {
        fromAirport: 'CDG: RER B train to central Paris, ~35 min, €11.80. Orly: Orlyval + RER B, ~35 min.',
        gettingAround: 'Buy a carnet of 10 metro tickets or use a Navigo weekly pass if you\'re staying 5+ days.',
        tip: 'Walk whenever the distance is under 20 minutes — you\'ll discover more than any tourist map shows.',
      },
      restaurants,
      thingsToDo: [
        { name: 'The Louvre', type: 'Museum', description: 'Book skip-the-line tickets. Go early, focus on one wing per visit.', duration: '3–4 hours' },
        { name: 'Musée d\'Orsay', type: 'Museum', description: 'Impressionist masterpieces in a stunning converted railway station.', duration: '2–3 hours' },
        { name: 'Montmartre & Sacré-Cœur', type: 'Neighborhood', description: 'Climb at sunrise for a crowd-free view of Paris.', duration: 'Half day' },
        { name: 'Seine River Cruise', type: 'Experience', description: 'The Bateaux Mouches evening cruise is one of the most romantic things in Paris.', duration: '1.5 hours' },
        { name: 'Palace of Versailles', type: 'Day Trip', description: 'Take the RER C train (~40 min) — a full day trip for the gardens alone.', duration: 'Full day' },
      ],
      itinerary,
      backupPlan: 'If the Louvre feels overwhelming, the Musée de l\'Orangerie is smaller, quieter, and houses Monet\'s Water Lilies in a breathtaking oval room.',
      bookingChecklist: [
        'Book flights to Paris (CDG or ORY)',
        'Book hotel in Le Marais or Saint-Germain',
        'Pre-purchase Louvre tickets online',
        'Get travel insurance',
        source === 'michelin' ? 'Reserve Septime at least 4 weeks ahead' : 'Research restaurants from your trusted sources',
        'Check France entry requirements',
        'Download the SNCF app for train bookings',
      ],
    }
  },

  bali: (source, days) => {
    const sourceLabel = SOURCE_LABELS[source] || 'General'
    const restaurantsBySource: Record<string, Restaurant[]> = {
      rednote: [
        { name: 'Potato Head Beach Club', cuisine: 'International', description: 'The most photographed beach club in Seminyak — iconic infinity pool, great cocktails.', priceRange: '$$', source: sourceLabel },
        { name: 'Locavore', cuisine: 'Modern Indonesian', description: 'Trending on Chinese travel communities — farm-to-table, stunning presentation.', priceRange: '$$$', source: sourceLabel },
        { name: 'Sari Organik', cuisine: 'Organic Balinese', description: 'Rice field café in Ubud — walk through paddy fields to get there.', priceRange: '$', source: sourceLabel },
      ],
      reddit: [
        { name: 'Warung Babi Guling Ibu Oka', cuisine: 'Balinese', description: 'r/Bali\'s #1 pick — suckling pig, the definitive Balinese dish. Get there at 11am.', priceRange: '$', source: sourceLabel },
        { name: 'Naughty Nuri\'s Warung', cuisine: 'BBQ Ribs', description: 'Famous for pork ribs and martinis. Reddit says the hype is 100% justified.', priceRange: '$$', source: sourceLabel },
        { name: 'Warung Mak Beng', cuisine: 'Balinese Seafood', description: 'One dish only — fried fish with sambal. Line out the door, done by 2pm.', priceRange: '$', source: sourceLabel },
      ],
      general: [
        { name: 'Warung Babi Guling Ibu Oka', cuisine: 'Balinese', description: 'The most famous suckling pig restaurant in Bali — a must-try.', priceRange: '$', source: sourceLabel },
        { name: 'Locavore', cuisine: 'Modern Indonesian', description: 'Best fine dining in Ubud, local ingredients, creative menu.', priceRange: '$$$', source: sourceLabel },
        { name: 'Merah Putih', cuisine: 'Modern Indonesian', description: 'Beautiful open-air restaurant in Seminyak serving elevated Indonesian classics.', priceRange: '$$', source: sourceLabel },
      ],
    }

    const restaurants = restaurantsBySource[source] ?? restaurantsBySource.general

    const itinerary = buildItinerary(
      days,
      'Sunrise at Mount Batur (if hiking) or morning yoga in Ubud',
      'Tegallalang Rice Terraces → Sacred Monkey Forest Sanctuary',
      'Sunset at Tanah Lot Temple → dinner in Seminyak'
    )

    return {
      destination: 'Bali',
      goNoGo: 'GO',
      goNoGoReason: `Bali consistently delivers for all types of travelers — spiritual retreats, beach clubs, world-class food, and rice terrace hikes are all within reach. Based on ${SOURCE_LABELS[source] || 'General'} recommendations, there\'s an experience perfectly matched to your style.`,
      bestArea: {
        name: 'Ubud (for culture) or Seminyak (for beach & nightlife)',
        description: 'Ubud is the cultural and spiritual center. Seminyak is beach clubs and sunsets.',
        whyStayHere: 'Split your stay between both — 2–3 nights in Ubud, the rest in Seminyak or Canggu.',
      },
      transportation: {
        fromAirport: 'Ngurah Rai Airport is 30 min from Seminyak, 1.5 hours from Ubud. Use a pre-booked taxi or Grab app.',
        gettingAround: 'Rent a scooter if comfortable (~$5/day). Otherwise use Grab (like Uber) or hire a driver for the day (~$35–50).',
        tip: 'Google Maps works well in Bali. Traffic in Seminyak can be brutal 4–7pm — plan around it.',
      },
      restaurants,
      thingsToDo: [
        { name: 'Tegallalang Rice Terraces', type: 'Nature', description: 'UNESCO-recognized terraces north of Ubud — go before 8am to avoid crowds.', duration: '2 hours' },
        { name: 'Tanah Lot Temple', type: 'Cultural', description: 'Sea temple at sunset — one of Bali\'s most iconic images.', duration: '2 hours' },
        { name: 'Sacred Monkey Forest', type: 'Nature', description: 'Ancient forest with 700+ long-tailed macaques. Keep your belongings secure.', duration: '1.5 hours' },
        { name: 'Mount Batur Sunrise Hike', type: 'Adventure', description: 'Active volcano hike, departs at 2am, spectacular sunrise at the summit.', duration: 'Full day' },
        { name: 'Ubud Traditional Market', type: 'Shopping', description: 'Textiles, crafts, and local goods. Best in the early morning before tour groups arrive.', duration: '1 hour' },
      ],
      itinerary,
      backupPlan: 'If Mount Batur is cloudy, the Jatiluwih Rice Terraces (a UNESCO site) offer a longer, less-crowded walk through ancient irrigation systems.',
      bookingChecklist: [
        'Book flights to Denpasar (DPS)',
        'Book accommodation — villa in Ubud + beach resort or Canggu guesthouse',
        'Get travel insurance (include adventure activities)',
        'Pre-book Mount Batur sunrise hike with a guide',
        'Check Indonesia Visa on Arrival requirements',
        'Download Grab app before arriving',
        'Bring cash — many local spots are cash only',
      ],
    }
  },
}

function buildGenericResult(destination: string, source: string, days: number): TravelResult {
  const sourceLabel = SOURCE_LABELS[source] || 'General'
  const itinerary = buildItinerary(
    days,
    'Explore the city center and main landmarks',
    'Visit local markets or museums in the afternoon',
    'Dinner at a recommended local restaurant'
  )

  return {
    destination,
    goNoGo: 'GO',
    goNoGoReason: `${destination} looks like a great choice. Based on ${sourceLabel} recommendations, you\'ll find plenty of experiences tailored to your preferences. This is a destination worth exploring.`,
    bestArea: {
      name: 'City Center',
      description: 'Stay centrally to maximize access to attractions, restaurants, and transit.',
      whyStayHere: 'Walking distance to major points of interest and easy access to local transportation.',
    },
    transportation: {
      fromAirport: 'Check airport transfer options in advance — taxi, public transit, or private transfer.',
      gettingAround: 'Public transit or rideshare apps are usually the most efficient options.',
      tip: 'Download offline maps before you arrive.',
    },
    restaurants: [
      { name: 'Local Market Food Stalls', cuisine: 'Local', description: 'The best way to eat like a local and discover regional specialties.', priceRange: '$', source: sourceLabel },
      { name: 'Top-rated Restaurant', cuisine: 'Regional', description: `Highly recommended by ${sourceLabel} for authentic cuisine and great atmosphere.`, priceRange: '$$', source: sourceLabel },
      { name: 'Popular Café', cuisine: 'Café', description: 'Great spot for breakfast or a midday break while exploring.', priceRange: '$', source: sourceLabel },
    ],
    thingsToDo: [
      { name: 'Main City Landmark', type: 'Sightseeing', description: 'The must-see attraction in the area.', duration: '2–3 hours' },
      { name: 'Local Neighborhood Walk', type: 'Exploration', description: 'Wander through the most authentic local neighborhoods.', duration: 'Half day' },
      { name: 'Cultural Experience', type: 'Cultural', description: 'Engage with the local culture through a museum, performance, or market.', duration: '2 hours' },
    ],
    itinerary,
    backupPlan: 'Research nearby day trips — most destinations have a hidden gem within 1–2 hours that most tourists miss.',
    bookingChecklist: [
      `Book flights to ${destination}`,
      'Reserve hotel in a central location',
      'Get travel insurance',
      'Check visa requirements',
      'Research local transportation options',
      'Identify top restaurants from your trusted sources',
    ],
  }
}

export function generateMockResult(tripData: TripFormData): TravelResult {
  const destination = tripData.destination.trim().toLowerCase()
  const source = getPrimarySource(tripData.trustedSources)
  const days = parseInt(tripData.tripLength) || 4

  const generator = DESTINATION_DATA[destination]
  if (generator) {
    return generator(source, days)
  }

  return buildGenericResult(tripData.destination.trim(), source, days)
}
