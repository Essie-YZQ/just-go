import type { TripFormData, TravelResult, Restaurant, Activity, DayPlan, DayActivity, SourceInsight, AlternativeVersion } from './types'
import { SOURCES } from './constants'

const SOURCE_LABELS: Record<string, string> = Object.fromEntries(
  SOURCES.map((s) => [s.value, s.name])
)

// ─── Source intelligence templates ───────────────────────────────────────────

const SOURCE_INTEL: Record<string, Omit<SourceInsight, 'sourceValue'>> = {
  michelin: {
    role: 'Fine dining & premium restaurants',
    insight: 'Starred restaurants and quality benchmarks shaped every dining recommendation in this plan.',
    impact: 'High',
  },
  reddit: {
    role: 'Neighborhood advice & practical tips',
    insight: 'Community-vetted spots locals actually go to — cross-checked tourist traps and flagged what\'s genuinely worth it.',
    impact: 'High',
  },
  rednote: {
    role: 'Visual hotspots & trending picks',
    insight: 'Aesthetic-first recommendations from Chinese travel creators — cafés, photo spots, and what\'s trending right now.',
    impact: 'High',
  },
  eater: {
    role: 'Restaurants, cafés & cocktail bars',
    insight: 'Editorial food journalism picks — reliable for recent openings, neighborhood bests, and underrated spots.',
    impact: 'Medium',
  },
  'google-reviews': {
    role: 'Reliability & opening-hours confidence',
    insight: 'High-volume ratings cross-checked for consistency — filtered out anything with recent mixed reviews.',
    impact: 'Medium',
  },
  youtube: {
    role: 'Visual guides & creator walk-throughs',
    insight: 'Video content from creators who\'ve been there — used to validate logistics and get a feel before arriving.',
    impact: 'Medium',
  },
  'local-blogs': {
    role: 'Hyperlocal spots & hidden gems',
    insight: 'On-the-ground picks from people who live there — surfaces spots that don\'t show up on mainstream lists.',
    impact: 'High',
  },
  general: {
    role: 'Balanced mix of popular sources',
    insight: 'A blend of crowd-favorite ratings and editorial picks for a well-rounded experience.',
    impact: 'Medium',
  },
}

function buildSourceIntelligence(sources: string[]): SourceInsight[] {
  if (sources.length === 0) return [{ sourceValue: 'general', ...SOURCE_INTEL.general }]
  return sources
    .filter((s) => SOURCE_INTEL[s])
    .map((s) => ({ sourceValue: s, ...SOURCE_INTEL[s] }))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPrimarySource(sources: string[]): string {
  if (sources.includes('rednote')) return 'rednote'
  if (sources.includes('michelin')) return 'michelin'
  if (sources.includes('eater')) return 'eater'
  if (sources.includes('reddit')) return 'reddit'
  if (sources.includes('local-blogs')) return 'local-blogs'
  return 'general'
}

function buildItinerary(days: number, morning: DayActivity, afternoon: DayActivity, evening: DayActivity): DayPlan[] {
  return Array.from({ length: Math.min(days, 5) }, (_, i) => ({
    day: i + 1,
    morning,
    afternoon,
    evening,
  }))
}

function budgetLabel(budget: string): string {
  const map: Record<string, string> = {
    budget: 'budget-friendly',
    midrange: 'comfortable',
    premium: 'premium',
    luxury: 'luxury',
  }
  return map[budget] ?? 'comfortable'
}

// ─── Destination data ─────────────────────────────────────────────────────────

const DESTINATION_DATA: Record<string, (source: string, days: number, tripData: TripFormData) => TravelResult> = {

  tokyo: (source, days, tripData) => {
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

    const morning: DayActivity = {
      name: 'Tsukiji market breakfast → Senso-ji temple in Asakusa',
      category: 'Food & Culture',
      whyFits: source === 'michelin'
        ? 'Premium-grade seafood at Tsukiji — starred chefs source here. Senso-ji is the cultural anchor for any curated Tokyo visit.'
        : source === 'rednote'
        ? 'Senso-ji at dawn is one of the most-shared Tokyo shots on RedNote — misty, crowd-free, and endlessly photogenic.'
        : source === 'reddit'
        ? 'r/JapanTravel\'s unanimous Day 1 start — the market locals and food bloggers both love, plus Senso-ji before the tourist rush.'
        : 'The classic Tokyo morning — premium seafood, then the city\'s oldest temple.',
      sources: source === 'michelin' ? ['michelin', 'google-reviews'] : source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit'] : ['google-reviews'],
    }

    const afternoon: DayActivity = {
      name: 'teamLab Borderless → Harajuku shopping',
      category: 'Art & Shopping',
      whyFits: source === 'michelin'
        ? 'World-class immersive art — the kind of premium cultural experience your budget supports.'
        : source === 'rednote'
        ? 'Harajuku fashion and Shibuya streetwear are the most-documented aesthetic neighborhoods on RedNote.'
        : source === 'reddit'
        ? 'Reddit\'s top-voted Tokyo activity — book 2 weeks ahead, it sells out regularly.'
        : 'Two distinct Tokyo experiences back-to-back — digital art and street fashion.',
      sources: source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit', 'google-reviews'] : ['google-reviews'],
    }

    const evening: DayActivity = {
      name: source === 'michelin'
        ? 'Shibuya Crossing → Dinner at Narisawa or Den → Golden Gai'
        : source === 'rednote'
        ? 'Shibuya Sky observation deck → Dinner → Golden Gai'
        : 'Shibuya Crossing → Dinner in Shinjuku → Golden Gai bar-hopping',
      category: 'Dining & Nightlife',
      whyFits: source === 'michelin'
        ? 'Dinner at a two-star Michelin restaurant directly aligned with your trusted source — reserve weeks ahead.'
        : source === 'rednote'
        ? 'Shibuya Sky rooftop is RedNote\'s #1 Tokyo night view — city lights at dusk, endlessly shareable.'
        : source === 'reddit'
        ? 'Golden Gai is Reddit\'s most-recommended Tokyo nightlife — small bars, locals only, all character.'
        : 'The Shibuya-to-Shinjuku evening is the quintessential Tokyo night.',
      sources: source === 'michelin' ? ['michelin'] : source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit'] : ['google-reviews'],
    }

    const budget = budgetLabel(tripData.hotelBudget)

    const whyThisPlan = {
      summary: source === 'michelin'
        ? 'Built around your Michelin-focused profile: curated fine dining, premium cultural picks, and every restaurant decision backed by starred sources.'
        : source === 'rednote'
        ? 'Built around your RedNote-inspired profile: aesthetic hotspots, trending cafés, and the most-shared experiences among Chinese travel creators.'
        : source === 'reddit'
        ? 'Built around your Reddit-sourced profile: community-vetted restaurants, local neighborhoods over tourist zones, and honest tips from real travelers.'
        : 'Built around your travel profile: a balanced mix of popular sources and local picks for a well-rounded Tokyo experience.',
      bullets: source === 'michelin'
        ? [
            'Dining led by Michelin: every restaurant pick is starred or editorially curated by the guide.',
            `Budget set to ${budget}: supports tasting menus and premium hotel options without constraints.`,
            'Cultural picks elevated: teamLab Borderless and Senso-ji over generic tourist circuits.',
            'Logistics optimized: Shinjuku base gives direct metro access to every major neighborhood.',
          ]
        : source === 'rednote'
        ? [
            'Visual-first picks: cafés, temples, and streets that are proven content gold on RedNote.',
            `Budget set to ${budget}: covers trending spots without burning through your budget in two days.`,
            'Aesthetic neighborhoods: Harajuku, Shimokitazawa, and Yanaka — all RedNote-verified.',
            'Timing built in: dawn visits to shrines, afternoon café-hopping, rooftop views at dusk.',
          ]
        : source === 'reddit'
        ? [
            'Community-verified: every restaurant rated by r/JapanTravel, not paid review sites.',
            `Budget set to ${budget}: Reddit finds the best value at every price point.`,
            'Local neighborhoods first: Kanda, Golden Gai, Nakameguro — where residents actually eat.',
            'Practical tips embedded: queue timing, transit hacks, and what to skip entirely.',
          ]
        : [
            'Balanced source mix: popular ratings and editorial picks combined.',
            `Budget set to ${budget}: covers a full range of Tokyo experiences.`,
            'Walkable base: Shinjuku gives direct metro access to every major neighborhood.',
            'Classic and modern: temples, digital art, ramen, and contemporary dining in one plan.',
          ],
    }

    const alternativeVersions: AlternativeVersion[] = [
      { title: 'Save Money', tag: 'Budget', description: 'Ramen counters, conbini meals, free temples, covered markets. Tokyo rewards budget travelers more than almost any city in the world.' },
      { title: 'Food Lover Route', tag: 'Dining', description: 'Every half-day anchored by a meal: Tsukiji breakfast, depachika lunch, Kikanbo ramen, and one omakase dinner. No tourist sites required.' },
      { title: 'Instagram Route', tag: 'Visual', description: 'Senso-ji at dawn, Shibuya Sky at dusk, teamLab for the interior shots, and Harajuku for the street style. Tokyo is endlessly photogenic.' },
      { title: 'Rainy Day Version', tag: 'Indoor', description: 'teamLab Borderless, underground Shinjuku food halls, Akihabara, and covered shopping arcades. Tokyo is one of the best cities in the world on a rainy day.' },
    ]

    return {
      destination: 'Tokyo',
      justGoRecommendation: 'Spend more on food than your hotel. Tokyo\'s ¥3,000 ramen counters and ¥18,000 lunch omakase will outlast any hotel room in your memory. Shinjuku and Shibuya have excellent mid-range business hotels — save the budget for one truly great meal.',
      goNoGo: 'GO',
      confidence: 'High',
      goNoGoReason: `Tokyo is one of the most visitor-ready cities in the world — exceptional public transit, world-class food at every price point, and an infinite variety of neighborhoods. Based on your ${sourceLabel} profile, you'll find curated spots that match exactly what you're looking for.`,
      whyThisPlan,
      sourceIntelligence: buildSourceIntelligence(tripData.trustedSources),
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
      itinerary: buildItinerary(days, morning, afternoon, evening),
      alternativeVersions,
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

  paris: (source, days, tripData) => {
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

    const morning: DayActivity = {
      name: 'Croissant at a local boulangerie → Louvre Museum',
      category: 'Food & Culture',
      whyFits: source === 'michelin'
        ? 'A quality boulangerie breakfast — the Parisian standard every starred chef endorses. Book Louvre tickets in advance to skip the queues.'
        : source === 'rednote'
        ? 'The boulangerie corner shot is one of the most-shared Paris moments on RedNote — then the Louvre Pyramid for the classic photo.'
        : source === 'reddit'
        ? 'r/Paris recommends going to the Louvre at opening — shorter queues, better light, half the crowds.'
        : 'The quintessential Paris morning — fresh croissant, then the world\'s greatest museum.',
      sources: source === 'michelin' ? ['michelin', 'google-reviews'] : source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit'] : ['google-reviews'],
    }

    const afternoon: DayActivity = {
      name: 'Stroll through Le Marais → Sainte-Chapelle',
      category: 'Neighborhood & History',
      whyFits: source === 'michelin'
        ? 'Le Marais houses some of Paris\'s best boutique restaurants and galleries — your Michelin profile will find plenty to explore here.'
        : source === 'rednote'
        ? 'Le Marais is Paris\'s most-photographed neighborhood on RedNote — vintage shops, street art, and the Place des Vosges.'
        : source === 'reddit'
        ? 'r/Paris consistently recommends Le Marais as the best neighborhood to wander — great food, no bus tours, real Parisian energy.'
        : 'The most walkable afternoon in Paris — historic streets, great food, and Sainte-Chapelle\'s legendary stained glass.',
      sources: source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit', 'google-reviews'] : ['google-reviews'],
    }

    const evening: DayActivity = {
      name: source === 'michelin'
        ? 'Sunset at Trocadéro → Dinner at Septime or Guy Savoy → evening walk along the Seine'
        : 'Sunset at Trocadéro → dinner in Saint-Germain → evening walk along the Seine',
      category: 'Dining & Views',
      whyFits: source === 'michelin'
        ? 'Septime or Guy Savoy for dinner — Michelin-backed picks that justify an advance reservation weeks ahead.'
        : source === 'rednote'
        ? 'The Trocadéro Eiffel Tower view at golden hour is the most-shared Paris shot on any platform — and the Seine walk at night is equally beautiful.'
        : source === 'reddit'
        ? 'r/Paris\'s evening formula: Trocadéro at sunset (free, no crowds vs. the tower), then Saint-Germain for dinner with a neighbourhood vibe.'
        : 'The classic Paris evening — Eiffel Tower at sunset, dinner in a Saint-Germain bistro, walk along the Seine.',
      sources: source === 'michelin' ? ['michelin'] : source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit'] : ['google-reviews'],
    }

    const budget = budgetLabel(tripData.hotelBudget)

    const whyThisPlan = {
      summary: source === 'michelin'
        ? 'Built around your Michelin-focused profile: curated fine dining, walkable neighborhoods, and every restaurant decision backed by starred sources.'
        : source === 'rednote'
        ? 'Built around your RedNote-inspired profile: aesthetic hotspots, iconic cafés, and the most-photographed experiences in the city.'
        : source === 'reddit'
        ? 'Built around your Reddit-sourced profile: community-vetted bistros, real neighborhood walks, and the honest Paris that locals actually live in.'
        : 'Built around your travel profile: a balanced mix of cultural landmarks, great food, and the classic Parisian experience.',
      bullets: source === 'michelin'
        ? [
            'Dining led by Michelin: Septime, Guy Savoy, and Le Cinq — every pick is editorially verified.',
            `Budget set to ${budget}: supports starred dining and 4-star hotel options in Le Marais.`,
            'Walkable base: Le Marais puts you 10 minutes from the Louvre, Notre-Dame, and Septime.',
            'Cultural depth: Musée d\'Orsay and Sainte-Chapelle over tourist-circuit box-ticking.',
          ]
        : source === 'rednote'
        ? [
            'Visual-first picks: every café, corner, and viewpoint is proven content gold on RedNote.',
            `Budget set to ${budget}: covers the trending spots without overspending on tourist traps.`,
            'Most-photographed route: Pyramide du Louvre → Le Marais → Trocadéro at sunset.',
            'Timing built in: morning boulangeries, afternoon golden light, Eiffel Tower at dusk.',
          ]
        : source === 'reddit'
        ? [
            'Community-verified: every restaurant picked by r/Paris, not TripAdvisor.',
            `Budget set to ${budget}: Reddit finds the best Parisian value at every price point.`,
            'Real neighborhoods: Le Marais, Oberkampf, and Belleville — where Parisians actually go.',
            'Practical tips embedded: skip the tower, go to Trocadéro; Louvre at opening, not at noon.',
          ]
        : [
            'Balanced source mix: editorial picks and crowd favorites combined.',
            `Budget set to ${budget}: covers classic Paris without overpaying for the name.',`,
            'Central base: Le Marais gives easy access to every major landmark.',
            'Classic and contemporary: great museums, great bistros, and one unforgettable sunset.',
          ],
    }

    const alternativeVersions: AlternativeVersion[] = [
      { title: 'Save Money', tag: 'Budget', description: 'Bouillon Chartier for dinner, L\'As du Fallafel for lunch, free museum Sundays, and Seine picnics. Paris is shockingly affordable when you know where to go.' },
      { title: 'Food Lover Route', tag: 'Dining', description: 'Every day anchored by a destination restaurant: market breakfast, arrondissement bistro lunch, and a reservation at Septime or similar. No tourist sites — food only.' },
      { title: 'Instagram Route', tag: 'Visual', description: 'Louvre Pyramid at opening, boulangerie corner shot, Trocadéro at golden hour, and Montmartre at dusk. Paris is the most photographed city on earth for a reason.' },
      { title: 'Rainy Day Version', tag: 'Indoor', description: 'Covered passages of Paris, Musée d\'Orsay, and afternoon tea at Angelina. Paris has perfected the indoor afternoon — rain barely changes the plan.' },
    ]

    return {
      destination: 'Paris',
      justGoRecommendation: 'Skip the Eiffel Tower queue — go to the Trocadéro instead. Same view, better photo angle, free, and zero wait time. Use that hour for a second glass of wine at a Saint-Germain bistro. You\'ll enjoy the trip more.',
      goNoGo: 'GO',
      confidence: 'High',
      goNoGoReason: `Paris rewards visitors who go with a plan. Crowds at landmarks can be intense, but the city's neighborhoods have an energy that's impossible to replicate. Based on your ${sourceLabel} profile, you'll find spots well beyond the tourist trail.`,
      whyThisPlan,
      sourceIntelligence: buildSourceIntelligence(tripData.trustedSources),
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
      itinerary: buildItinerary(days, morning, afternoon, evening),
      alternativeVersions,
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

  bali: (source, days, tripData) => {
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

    const morning: DayActivity = {
      name: 'Sunrise at Mount Batur (if hiking) or morning yoga in Ubud',
      category: 'Adventure & Wellness',
      whyFits: source === 'rednote'
        ? 'The Mount Batur sunrise is one of the most-shared Bali moments on RedNote — ethereal light, active volcano, unforgettable shot.'
        : source === 'reddit'
        ? 'r/Bali consistently rates the Batur sunrise hike as the single best thing to do in Bali — go with a guide, start at 2am.'
        : 'Bali mornings are made for active starts — the volcano hike or yoga session sets the tone for the whole day.',
      sources: source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit'] : ['google-reviews'],
    }

    const afternoon: DayActivity = {
      name: 'Tegallalang Rice Terraces → Sacred Monkey Forest Sanctuary',
      category: 'Nature & Culture',
      whyFits: source === 'rednote'
        ? 'Tegallalang is Bali\'s most-photographed landscape on RedNote — the terraced rice fields look extraordinary in afternoon light.'
        : source === 'reddit'
        ? 'r/Bali recommends arriving at Tegallalang before 8am to beat coaches — the terraces in morning mist are genuinely magical.'
        : 'Two of Bali\'s most iconic natural experiences in one afternoon — UNESCO rice terraces and ancient forest.',
      sources: source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit', 'google-reviews'] : ['google-reviews'],
    }

    const evening: DayActivity = {
      name: 'Sunset at Tanah Lot Temple → dinner in Seminyak',
      category: 'Culture & Dining',
      whyFits: source === 'rednote'
        ? 'Tanah Lot at sunset is Bali\'s most iconic image on RedNote — the sea temple silhouette at golden hour is unmissable.'
        : source === 'reddit'
        ? 'r/Bali\'s recommended Tanah Lot timing: arrive 45 minutes before sunset, leave before the crowds bottleneck at the exit.'
        : 'Bali\'s most famous sunset, followed by dinner in Seminyak — the perfect end to any day on the island.',
      sources: source === 'rednote' ? ['rednote'] : source === 'reddit' ? ['reddit'] : ['google-reviews'],
    }

    const budget = budgetLabel(tripData.hotelBudget)

    const whyThisPlan = {
      summary: source === 'rednote'
        ? 'Built around your RedNote-inspired profile: visual highlights, aesthetic cafés, and Bali\'s most-shared experiences among Chinese travel creators.'
        : source === 'reddit'
        ? 'Built around your Reddit-sourced profile: community-vetted warungs, local beaches over tourist zones, and honest tips from people who\'ve been.'
        : 'Built around your travel profile: Bali\'s best mix of culture, nature, and food — with logistics that don\'t require a rental car.',
      bullets: source === 'rednote'
        ? [
            'Visual-first picks: rice terraces, sea temples, and beach clubs that perform on camera.',
            `Budget set to ${budget}: covers beach clubs and farm-to-table dinners without overpaying.`,
            'Split stay recommended: 2 nights in Ubud for aesthetics, then Seminyak for the sunset.',
            'Timing built in: golden hour at Tanah Lot, terrace shots in morning light.',
          ]
        : source === 'reddit'
        ? [
            'Community-verified: every warung and spot rated by r/Bali, not travel agencies.',
            `Budget set to ${budget}: Reddit finds Bali extraordinary value at every price level.`,
            'Local food first: suckling pig, fried fish with sambal, BBQ ribs — the real Bali.',
            'Practical tips: scooter rental info, Grab app for Seminyak, what to skip.',
          ]
        : [
            'Balanced split: Ubud for culture and Seminyak for beach — the classic Bali formula.',
            `Budget set to ${budget}: covers villas, beach clubs, and fine dining in Ubud.`,
            'Nature highlights: Mount Batur, Tegallalang, and Tanah Lot at sunset.',
            'Food covered: from warungs to farm-to-table, every meal has a clear recommendation.',
          ],
    }

    const alternativeVersions: AlternativeVersion[] = [
      { title: 'Save Money', tag: 'Budget', description: 'Warungs over beach clubs, shared scooter over private driver, rice terrace guesthouse over resort. Bali is extraordinary value at every price level.' },
      { title: 'Food Lover Route', tag: 'Dining', description: 'Suckling pig at Ibu Oka, fish at Warung Mak Beng, cooking class in Ubud, and dinner at Locavore. Every meal a destination. No landmarks required.' },
      { title: 'Instagram Route', tag: 'Visual', description: 'Mount Batur sunrise, Tegallalang in morning mist, Tanah Lot at golden hour, and Potato Head Beach Club for the pool shot. Bali is built for visual storytelling.' },
      { title: 'Rainy Day Version', tag: 'Indoor', description: 'Temple visits in the rain (genuinely atmospheric), Ubud spa days, cooking classes, and silver jewelry workshops. Bali\'s green season is lush and uncrowded.' },
    ]

    return {
      destination: 'Bali',
      justGoRecommendation: 'Split your stay: 3 nights in Ubud, the rest in Canggu or Seminyak. Spending a full week in only one area misses what makes Bali remarkable. The contrast between rice terraces and beach clubs is the whole point of the island.',
      goNoGo: 'GO',
      confidence: 'High',
      goNoGoReason: `Bali consistently delivers for all types of travelers — spiritual retreats, beach clubs, world-class food, and rice terrace hikes are all within reach. Based on your ${sourceLabel} profile, there's an experience perfectly matched to your style.`,
      whyThisPlan,
      sourceIntelligence: buildSourceIntelligence(tripData.trustedSources),
      bestArea: {
        name: 'Ubud (for culture) or Seminyak (for beach & nightlife)',
        description: 'Ubud is the cultural and spiritual center. Seminyak is beach clubs and sunsets.',
        whyStayHere: 'Split your stay between both — 2–3 nights in Ubud, the rest in Seminyak or Canggu.',
      },
      transportation: {
        fromAirport: 'Ngurah Rai Airport is 30 min from Seminyak, 1.5 hours from Ubud. Use a pre-booked taxi or Grab app.',
        gettingAround: 'Rent a scooter if comfortable (~$5/day). Otherwise use Grab or hire a driver for the day (~$35–50).',
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
      itinerary: buildItinerary(days, morning, afternoon, evening),
      alternativeVersions,
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

// ─── Generic fallback ─────────────────────────────────────────────────────────

function buildGenericResult(destination: string, source: string, days: number, tripData: TripFormData): TravelResult {
  const sourceLabel = SOURCE_LABELS[source] || 'General'
  const budget = budgetLabel(tripData.hotelBudget)

  const morning: DayActivity = {
    name: 'Explore the city center and main landmarks',
    category: 'Sightseeing',
    whyFits: `Starting with the city center gives you a clear orientation — your ${sourceLabel} profile will guide you toward the right areas once you\'re on the ground.`,
    sources: [source === 'general' ? 'google-reviews' : source],
  }

  const afternoon: DayActivity = {
    name: 'Local markets or museums in the afternoon',
    category: 'Culture & Food',
    whyFits: `Afternoon markets and museums tend to be less crowded and more authentic — consistent with what your ${sourceLabel} profile recommends.`,
    sources: ['google-reviews'],
  }

  const evening: DayActivity = {
    name: 'Dinner at a recommended local restaurant',
    category: 'Dining',
    whyFits: `A ${sourceLabel}-recommended dinner to close out the day — prioritizing local cuisine and verified quality.`,
    sources: [source === 'general' ? 'google-reviews' : source],
  }

  return {
    destination,
    goNoGo: 'GO',
    confidence: 'Good',
    goNoGoReason: `${destination} looks like a great choice. Based on your ${sourceLabel} profile, you'll find plenty of experiences tailored to your preferences. This is a destination worth exploring.`,
    whyThisPlan: {
      summary: `Built around your ${sourceLabel}-inspired travel profile: quality-first picks, practical logistics, and recommendations that match your travel style.`,
      bullets: [
        `Source-led picks: recommendations drawn from ${sourceLabel} to match your preferences.`,
        `Budget set to ${budget}: covers accommodation and dining within your range.`,
        'Central base: staying centrally maximizes access with minimal transit time.',
        'Flexible itinerary: structured enough to feel confident, loose enough to explore.',
      ],
    },
    sourceIntelligence: buildSourceIntelligence(tripData.trustedSources),
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
    itinerary: buildItinerary(days, morning, afternoon, evening),
    alternativeVersions: [
      { title: 'Save Money', tag: 'Budget', description: 'Same destination, value-focused picks — local markets over restaurants, public transit over taxis, guesthouses over hotels.' },
      { title: 'Food Lover Route', tag: 'Dining', description: 'Every day anchored by a food experience — morning market, lunch at a local institution, dinner at the destination\'s best restaurant.' },
      { title: 'Instagram Route', tag: 'Visual', description: 'Focused on the most visually distinctive spots — architecture, markets, viewpoints, and the neighborhoods that look like nowhere else.' },
      { title: 'Rainy Day Version', tag: 'Indoor', description: 'Museums, covered markets, cafés, and galleries. Every destination has a great indoor version — this is it.' },
    ],
    justGoRecommendation: `Before your first full day, walk one neighborhood without a plan. Most travelers over-schedule Day 1. The best discovery of any trip is usually accidental — and it almost always happens on foot.`,
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

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateMockResult(tripData: TripFormData): TravelResult {
  const destination = tripData.destination.trim().toLowerCase()
  const source = getPrimarySource(tripData.trustedSources)
  const days = parseInt(tripData.tripLength) || 4

  const generator = DESTINATION_DATA[destination]
  if (generator) {
    return generator(source, days, tripData)
  }

  return buildGenericResult(tripData.destination.trim(), source, days, tripData)
}
