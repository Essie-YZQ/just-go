'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

type Lang = 'en' | 'zh'

const LANG_KEY = 'just_go_lang'

// ─── Translation dictionary ───────────────────────────────────────────────────

const translations = {
  en: {
    // Navigation
    'nav.brand': 'Just Go',
    'nav.planTrip': 'Plan a Trip',
    'nav.travelProfiles': 'Travel Profiles',
    'nav.langToggle': '中文',

    // Footer
    'footer.credit': 'Just Go — AI Travel Copilot · MVP v1',

    // Landing — Hero
    'home.eyebrow': 'AI Travel Copilot',
    'home.hero.title': 'From "Should we go?"\nto a flight booked.',
    'home.hero.body': 'Create a Travel Profile with your trusted sources, budget, and travel style. Tell us where you want to go — and get a personalized plan in under 30 minutes.',
    'home.hero.sub': 'For spontaneous travelers. No sign-up required.',
    'home.cta': 'Start Planning →',

    // Landing — Pain strip
    'home.pain': 'Most people jump between {links} before deciding. Just Go replaces that loop with one conversation.',
    'home.pain.links': 'Google → Reddit → YouTube → Booking → Maps → TikTok',

    // Landing — Sources section
    'home.sources.eyebrow': 'What makes Just Go different',
    'home.sources.title': 'A Reddit local and a Michelin hunter\nvisit the same city. Different plans.',
    'home.sources.body': 'Your Travel Profile is built around the communities you trust — not a one-size-fits-all algorithm. A Reddit profile and a Michelin profile give completely different recommendations for the same city.',
    'home.sources.footer.normal': 'ChatGPT gives the same answer to everyone. ',
    'home.sources.footer.emphasis': "Just Go doesn't.",

    // Landing — How it works
    'home.how.eyebrow': 'How it works',
    'home.step1.title': 'Build a Travel Profile',
    'home.step1.body': 'Set your trusted sources, budget, and travel style. Save different profiles for different trips.',
    'home.step2.title': 'Tell us your trip',
    'home.step2.body': 'Destination, dates, and pace. Your profile pre-fills the rest.',
    'home.step3.title': 'Get a confident recommendation',
    'home.step3.body': 'A Go / No-Go verdict, where to stay, what to eat, and a full day-by-day plan — built around your sources.',

    // Landing — Final CTA
    'home.finalCta.eyebrow': 'Stop researching. Start going.',
    'home.finalCta.title': 'Just go.',
    'home.finalCta.body': 'A complete, personalized travel plan in under 30 minutes.',

    // Planner — Step indicator
    'planner.steps.profile': 'Profile',
    'planner.steps.trip': 'Trip',
    'planner.steps.style': 'Style',
    'planner.steps.sources': 'Sources',

    // Planner — Navigation
    'planner.back': '← Back',
    'planner.continue': 'Continue →',
    'planner.getMyPlan': 'Get My Plan →',

    // Planner — Loading screen
    'planner.loading.title': 'Building your plan...',
    'planner.loading.sub': 'Curating picks from your trusted sources',

    // Planner — Step 0: Profile
    'planner.profile.heading': 'Start with a profile',
    'planner.profile.sub': 'Your profile pre-fills your preferences. You can adjust anything in the next steps.',
    'planner.profile.empty': 'No profiles yet.',
    'planner.profile.createLink': 'Create a travel profile →',
    'planner.profile.manage': '+ Manage profiles',
    'planner.profile.error': 'Please choose a travel profile to continue.',

    // Planner — Step 1: Trip
    'planner.trip.heading': 'Where are you going?',
    'planner.trip.sub': "Start with the basics — we'll handle the rest.",
    'planner.trip.destination': 'Destination',
    'planner.trip.destination.placeholder': 'Tokyo, Paris, Bali...',
    'planner.trip.departure': 'Departing from',
    'planner.trip.departure.placeholder': 'New York, London, Beijing...',
    'planner.trip.arrivalDate': 'Arrival date',
    'planner.trip.today': 'Today',
    'planner.trip.tomorrow': 'Tomorrow',
    'planner.trip.length': 'Trip length',
    'planner.trip.destination.error': 'Please enter a destination.',
    'planner.trip.departure.error': 'Please enter your departure city.',
    'planner.trip.date.error': 'Please pick a date.',

    // Planner — Step 2: Style
    'planner.style.heading': 'How do you like to travel?',
    'planner.style.sub': 'Pre-filled from your profile — adjust anything you like.',
    'planner.style.budget': 'Budget',
    'planner.style.budget.hint': 'Recommendations are adjusted for your destination.',
    'planner.style.pace': 'Travel pace',
    'planner.style.transport': 'Getting around',
    'planner.style.interests': "You're into",
    'planner.style.interests.hint': 'Select all that apply',

    // Planner — Step 3: Sources
    'planner.sources.heading': 'Who do you trust for travel tips?',
    'planner.sources.sub': "Pre-filled from your profile — this shapes everything you'll see.",
    'planner.sources.error': 'Pick at least one source to continue.',

    // Travel Profiles — List view
    'profiles.title': 'Travel Profiles',
    'profiles.sub': 'Each profile shapes your entire travel plan.',
    'profiles.newBtn': '+ New Profile',
    'profiles.empty': 'No profiles yet.',
    'profiles.createFirst': 'Create your first profile',
    'profiles.createNew': 'Create new profile',
    'profiles.untitled': 'Untitled Profile',
    'profiles.card.edit': 'Edit',

    // Travel Profiles — Edit view
    'profiles.edit.backLink': '← Travel Profiles',
    'profiles.edit.newTitle': 'New Profile',
    'profiles.edit.editTitle': 'Edit Profile',
    'profiles.edit.nameLabel': 'Profile name',
    'profiles.edit.namePlaceholder': 'e.g. Japan with Friends, Europe Luxury, Solo Adventure...',
    'profiles.edit.nameError': 'Please give this profile a name.',
    'profiles.edit.budget': 'Budget',
    'profiles.edit.budget.hint': 'Recommendations are adjusted for your destination.',
    'profiles.edit.hotelStyle': 'Hotel Style',
    'profiles.edit.foodStyle': 'Food Style',
    'profiles.edit.activityStyle': 'Activity Style',
    'profiles.edit.activityStyle.hint': 'Select all that apply',
    'profiles.edit.transport': 'Getting Around',
    'profiles.edit.sources': 'Trusted Sources',
    'profiles.edit.sources.hint': 'This is the most important choice — it shapes your entire plan.',
    'profiles.edit.saveBtn': 'Save Profile',
    'profiles.edit.saving': 'Saving profile...',

    // Results — Loading & structure
    'results.loading': 'Loading your travel plan...',
    'results.eyebrow': 'Your travel plan',
    'results.confidence': '{level} Confidence',
    'results.goRecommended': 'Recommended',
    'results.goNotRecommended': 'Not recommended',
    'results.stayIn': 'Stay in',
    'results.days': 'days',
    'results.day': 'Day {n}',

    // Results — Section headings
    'results.whyThisPlan': 'Why This Plan',
    'results.sourceIntel': 'Source Intelligence',
    'results.sourceIntel.sub': 'How each trusted source shaped this plan.',
    'results.whereToStay': 'Where to Stay',
    'results.gettingThere': 'Getting There',
    'results.whereToEat': 'Where to Eat',
    'results.whatToDo': 'What to Do',
    'results.itinerary': 'Your Itinerary',
    'results.alternatives': 'Other Angles to Consider',
    'results.alternatives.sub': 'Different ways to approach this trip — static previews for now.',
    'results.previewBtn': 'Preview version',
    'results.planB': 'Plan B',
    'results.beforeYouBook': 'Before You Book',

    // Results — Info blocks
    'results.fromAirport': 'From the airport',
    'results.gettingAround': 'Getting around',
    'results.localTip': 'Local tip',

    // Results — Itinerary
    'results.morning': 'Morning',
    'results.afternoon': 'Afternoon',
    'results.evening': 'Evening',

    // Results — Footer
    'results.adjustPrefs': '← Adjust preferences',
    'results.mvpNote': 'MVP v1 · Real AI integration coming in v2',

    // Budget options
    'budget.budget.label': 'Budget',
    'budget.budget.sub': 'Flexible, value-focused',
    'budget.midrange.label': 'Comfortable',
    'budget.midrange.sub': 'Good value, no compromises',
    'budget.premium.label': 'Premium',
    'budget.premium.sub': 'Curated, quality-first',
    'budget.luxury.label': 'Luxury',
    'budget.luxury.sub': 'The finest, no limits',

    // Hotel style options
    'hotel.any.label': 'No preference',
    'hotel.any.sub': 'Flexible on accommodation type',
    'hotel.hostel.label': 'Hostel & Guesthouse',
    'hotel.hostel.sub': 'Social, budget-friendly',
    'hotel.boutique.label': 'Boutique',
    'hotel.boutique.sub': 'Design-led, character-filled',
    'hotel.luxury.label': 'Luxury',
    'hotel.luxury.sub': '5-star hotels and resorts',

    // Food style options
    'food.any.label': 'No preference',
    'food.any.sub': 'Open to anything',
    'food.street-food.label': 'Street & Local',
    'food.street-food.sub': 'Markets, stalls, hawkers',
    'food.casual.label': 'Casual Dining',
    'food.casual.sub': 'Neighborhood restaurants',
    'food.fine-dining.label': 'Fine Dining',
    'food.fine-dining.sub': 'Elevated, curated experiences',

    // Transport options
    'transport.public': 'Public Transit',
    'transport.rental': 'Rental Car',
    'transport.rideshare': 'Ride-share',
    'transport.walk': 'Walk / Bike',

    // Interest options
    'interest.food': 'Food & Dining',
    'interest.art': 'Art',
    'interest.museums': 'Museums',
    'interest.nature': 'Nature',
    'interest.nightlife': 'Nightlife',
    'interest.shopping': 'Shopping',
    'interest.history': 'History',
    'interest.beach': 'Beach',
    'interest.adventure': 'Adventure',
    'interest.photography': 'Photography',

    // Pace options
    'pace.relaxed.label': 'Take it easy',
    'pace.relaxed.sub': 'A few highlights, lots of downtime',
    'pace.moderate.label': 'Mix it up',
    'pace.moderate.sub': 'Balanced sightseeing and rest',
    'pace.fast.label': 'See everything',
    'pace.fast.sub': 'Pack in as much as possible',

    // Budget display labels (profile cards)
    'budgetLabel.budget': 'Budget',
    'budgetLabel.midrange': 'Comfortable',
    'budgetLabel.premium': 'Premium',
    'budgetLabel.luxury': 'Luxury',

    // Hotel display labels (profile card summary)
    'hotelLabel.hostel': 'Hostel / Guesthouse',
    'hotelLabel.boutique': 'Boutique',
    'hotelLabel.luxury': 'Luxury',

    // Food display labels (profile card summary)
    'foodLabel.street-food': 'Street & Local',
    'foodLabel.casual': 'Casual Dining',
    'foodLabel.fine-dining': 'Fine Dining',

    // Source taglines and descriptions (names stay in English)
    'source.reddit.tagline': 'Real opinions. No filters.',
    'source.reddit.desc': 'Local intel and honest takes from actual travelers — not sponsored results.',
    'source.rednote.tagline': 'Trending. Aesthetic. Now.',
    'source.rednote.desc': "Visual hotspots and what's popular right now — the traveler's eye view.",
    'source.michelin.tagline': 'World-class. Curated.',
    'source.michelin.desc': 'Starred restaurants and expert-level dining — for the serious table.',
    'source.google-reviews.tagline': 'Crowd-sourced confidence.',
    'source.google-reviews.desc': "High-volume ratings that surface what's consistently good over time.",
    'source.youtube.tagline': 'See it before you go.',
    'source.youtube.desc': "Video guides from creators who've been there and know what to look for.",
    'source.eater.tagline': 'Food-forward. Expert-led.',
    'source.eater.desc': 'Editorial restaurant picks from journalists who cover food full-time.',
    'source.local-blogs.tagline': 'On the ground. In the know.',
    'source.local-blogs.desc': 'Picks from people who actually live there.',
    'source.general.tagline': 'Balanced mix.',
    'source.general.desc': 'A blend of popular, well-reviewed recommendations.',
  },

  zh: {
    // Navigation
    'nav.brand': 'Just Go',
    'nav.planTrip': '规划旅行',
    'nav.travelProfiles': '旅行档案',
    'nav.langToggle': 'EN',

    // Footer
    'footer.credit': 'Just Go — AI 旅行助手 · MVP v1',

    // Landing — Hero
    'home.eyebrow': 'AI 旅行助手',
    'home.hero.title': '从"要不要去？"\n到机票已订好。',
    'home.hero.body': '创建你的旅行档案，选择信任的信息源、预算和旅行风格。告诉我们你想去哪里 — 30 分钟内获得个性化旅行计划。',
    'home.hero.sub': '为爱说走就走的旅行者设计，无需注册。',
    'home.cta': '开始规划 →',

    // Landing — Pain strip
    'home.pain': '大多数人在做决定前要来回刷 {links}。Just Go 用一次对话替代这个流程。',
    'home.pain.links': 'Google → Reddit → YouTube → Booking → Maps → TikTok',

    // Landing — Sources section
    'home.sources.eyebrow': 'Just Go 有什么不同',
    'home.sources.title': '同一座城市，Reddit 爱好者与 Michelin 猎人\n得到完全不同的计划。',
    'home.sources.body': '你的旅行档案围绕你信任的社区打造 — 而不是千篇一律的算法。Reddit 档案和 Michelin 档案对同一座城市给出截然不同的推荐。',
    'home.sources.footer.normal': 'ChatGPT 给所有人一样的答案。',
    'home.sources.footer.emphasis': 'Just Go 不会。',

    // Landing — How it works
    'home.how.eyebrow': '如何使用',
    'home.step1.title': '创建旅行档案',
    'home.step1.body': '选择信任的信息源、预算和旅行风格。为不同类型的旅行保存不同档案。',
    'home.step2.title': '告诉我们你的行程',
    'home.step2.body': '目的地、日期和节奏。你的档案会自动预填其余信息。',
    'home.step3.title': '获得自信的推荐',
    'home.step3.body': '一个 Go / No-Go 结论、住宿推荐、餐厅推荐、完整每日行程 — 全部基于你选择的信息源。',

    // Landing — Final CTA
    'home.finalCta.eyebrow': '别再查了。出发吧。',
    'home.finalCta.title': '就出发。',
    'home.finalCta.body': '30 分钟内完成完整的个性化旅行计划。',

    // Planner — Step indicator
    'planner.steps.profile': '档案',
    'planner.steps.trip': '行程',
    'planner.steps.style': '风格',
    'planner.steps.sources': '信息源',

    // Planner — Navigation
    'planner.back': '← 返回',
    'planner.continue': '继续 →',
    'planner.getMyPlan': '生成我的计划 →',

    // Planner — Loading screen
    'planner.loading.title': '正在生成你的计划...',
    'planner.loading.sub': '正在从你的信任来源精选推荐',

    // Planner — Step 0: Profile
    'planner.profile.heading': '选择一个档案',
    'planner.profile.sub': '你的档案会自动预填偏好设置，下一步中可随时调整。',
    'planner.profile.empty': '还没有档案。',
    'planner.profile.createLink': '创建旅行档案 →',
    'planner.profile.manage': '+ 管理档案',
    'planner.profile.error': '请选择一个旅行档案以继续。',

    // Planner — Step 1: Trip
    'planner.trip.heading': '你要去哪里？',
    'planner.trip.sub': '先填写基本信息 — 其余的我们来处理。',
    'planner.trip.destination': '目的地',
    'planner.trip.destination.placeholder': 'Tokyo, Paris, Bali...',
    'planner.trip.departure': '出发城市',
    'planner.trip.departure.placeholder': 'New York, London, Beijing...',
    'planner.trip.arrivalDate': '到达日期',
    'planner.trip.today': '今天',
    'planner.trip.tomorrow': '明天',
    'planner.trip.length': '行程天数',
    'planner.trip.destination.error': '请输入目的地。',
    'planner.trip.departure.error': '请输入出发城市。',
    'planner.trip.date.error': '请选择日期。',

    // Planner — Step 2: Style
    'planner.style.heading': '你喜欢怎样旅行？',
    'planner.style.sub': '已从你的档案预填 — 可随意调整。',
    'planner.style.budget': '预算',
    'planner.style.budget.hint': '推荐内容会根据目的地进行调整。',
    'planner.style.pace': '旅行节奏',
    'planner.style.transport': '出行方式',
    'planner.style.interests': '你喜欢',
    'planner.style.interests.hint': '可多选',

    // Planner — Step 3: Sources
    'planner.sources.heading': '你信任哪些旅行信息来源？',
    'planner.sources.sub': '已从你的档案预填 — 这将决定你看到的所有推荐。',
    'planner.sources.error': '至少选择一个信息源以继续。',

    // Travel Profiles — List view
    'profiles.title': '旅行档案',
    'profiles.sub': '每个档案都会影响你的整个旅行计划。',
    'profiles.newBtn': '+ 新建档案',
    'profiles.empty': '还没有档案。',
    'profiles.createFirst': '创建第一个档案',
    'profiles.createNew': '新建档案',
    'profiles.untitled': '未命名档案',
    'profiles.card.edit': '编辑',

    // Travel Profiles — Edit view
    'profiles.edit.backLink': '← 旅行档案',
    'profiles.edit.newTitle': '新建档案',
    'profiles.edit.editTitle': '编辑档案',
    'profiles.edit.nameLabel': '档案名称',
    'profiles.edit.namePlaceholder': '例如：日本好友游、欧洲奢华行、独自冒险...',
    'profiles.edit.nameError': '请给这个档案起个名字。',
    'profiles.edit.budget': '预算',
    'profiles.edit.budget.hint': '推荐内容会根据目的地进行调整。',
    'profiles.edit.hotelStyle': '住宿风格',
    'profiles.edit.foodStyle': '饮食风格',
    'profiles.edit.activityStyle': '活动偏好',
    'profiles.edit.activityStyle.hint': '可多选',
    'profiles.edit.transport': '出行方式',
    'profiles.edit.sources': '信任的信息源',
    'profiles.edit.sources.hint': '这是最重要的选择 — 它决定了你的整个计划。',
    'profiles.edit.saveBtn': '保存档案',
    'profiles.edit.saving': '正在保存...',

    // Results — Loading & structure
    'results.loading': '正在加载你的旅行计划...',
    'results.eyebrow': '你的旅行计划',
    'results.confidence': '{level} 置信度',
    'results.goRecommended': '推荐出行',
    'results.goNotRecommended': '暂不推荐',
    'results.stayIn': '住在',
    'results.days': '天',
    'results.day': '第 {n} 天',

    // Results — Section headings
    'results.whyThisPlan': '为什么推荐这个计划',
    'results.sourceIntel': '信息源分析',
    'results.sourceIntel.sub': '每个信任来源是如何影响这份计划的。',
    'results.whereToStay': '住在哪里',
    'results.gettingThere': '如何抵达',
    'results.whereToEat': '吃什么',
    'results.whatToDo': '玩什么',
    'results.itinerary': '每日行程',
    'results.alternatives': '其他方案参考',
    'results.alternatives.sub': '从不同角度规划这趟旅行 — 目前为预览版。',
    'results.previewBtn': '预览版本',
    'results.planB': '备选方案',
    'results.beforeYouBook': '预订前清单',

    // Results — Info blocks
    'results.fromAirport': '从机场出发',
    'results.gettingAround': '市内交通',
    'results.localTip': '本地贴士',

    // Results — Itinerary
    'results.morning': '上午',
    'results.afternoon': '下午',
    'results.evening': '晚上',

    // Results — Footer
    'results.adjustPrefs': '← 调整偏好',
    'results.mvpNote': 'MVP v1 · v2 将接入真实 AI',

    // Budget options
    'budget.budget.label': '经济型',
    'budget.budget.sub': '灵活，注重性价比',
    'budget.midrange.label': '舒适型',
    'budget.midrange.sub': '品质与价值兼顾',
    'budget.premium.label': '精品型',
    'budget.premium.sub': '精选，品质优先',
    'budget.luxury.label': '奢华型',
    'budget.luxury.sub': '顶级体验，不设上限',

    // Hotel style options
    'hotel.any.label': '无偏好',
    'hotel.any.sub': '住宿类型灵活',
    'hotel.hostel.label': '青旅 / 民宿',
    'hotel.hostel.sub': '社交氛围，经济实惠',
    'hotel.boutique.label': '精品酒店',
    'hotel.boutique.sub': '设计感强，独具风格',
    'hotel.luxury.label': '奢华酒店',
    'hotel.luxury.sub': '五星级酒店和度假村',

    // Food style options
    'food.any.label': '无偏好',
    'food.any.sub': '什么都愿意尝试',
    'food.street-food.label': '街头美食',
    'food.street-food.sub': '集市、摊位、小吃',
    'food.casual.label': '休闲餐厅',
    'food.casual.sub': '街区餐厅',
    'food.fine-dining.label': '精致餐饮',
    'food.fine-dining.sub': '高端、精心策划的体验',

    // Transport options
    'transport.public': '公共交通',
    'transport.rental': '租车',
    'transport.rideshare': '打车 / 专车',
    'transport.walk': '步行 / 骑行',

    // Interest options
    'interest.food': '美食',
    'interest.art': '艺术',
    'interest.museums': '博物馆',
    'interest.nature': '自然风光',
    'interest.nightlife': '夜生活',
    'interest.shopping': '购物',
    'interest.history': '历史文化',
    'interest.beach': '海滩',
    'interest.adventure': '户外探险',
    'interest.photography': '摄影',

    // Pace options
    'pace.relaxed.label': '慢节奏',
    'pace.relaxed.sub': '几个亮点，大量休闲时间',
    'pace.moderate.label': '均衡节奏',
    'pace.moderate.sub': '观光与休息兼顾',
    'pace.fast.label': '高效节奏',
    'pace.fast.sub': '尽可能多地体验',

    // Budget display labels (profile cards)
    'budgetLabel.budget': '经济型',
    'budgetLabel.midrange': '舒适型',
    'budgetLabel.premium': '精品型',
    'budgetLabel.luxury': '奢华型',

    // Hotel display labels (profile card summary)
    'hotelLabel.hostel': '青旅 / 民宿',
    'hotelLabel.boutique': '精品酒店',
    'hotelLabel.luxury': '奢华酒店',

    // Food display labels (profile card summary)
    'foodLabel.street-food': '街头美食',
    'foodLabel.casual': '休闲餐厅',
    'foodLabel.fine-dining': '精致餐饮',

    // Source taglines and descriptions (names stay in English)
    'source.reddit.tagline': '真实评价，不加滤镜。',
    'source.reddit.desc': '来自真实旅行者的本地情报和诚实看法 — 非赞助内容。',
    'source.rednote.tagline': '潮流、颜值、当下。',
    'source.rednote.desc': '视觉打卡地和当下最火内容 — 旅行者的视角。',
    'source.michelin.tagline': '世界级，精心策划。',
    'source.michelin.desc': '星级餐厅和专业级美食体验 — 为认真的美食家准备。',
    'source.google-reviews.tagline': '大众验证的口碑。',
    'source.google-reviews.desc': '海量评分揭示持续保持高质量的好去处。',
    'source.youtube.tagline': '去之前先看看。',
    'source.youtube.desc': '来自亲身探访过的创作者的视频攻略。',
    'source.eater.tagline': '以食为先，专家引领。',
    'source.eater.desc': '由全职美食记者精选的餐厅推荐。',
    'source.local-blogs.tagline': '在地视角，知根知底。',
    'source.local-blogs.desc': '来自真正住在那里的人的推荐。',
    'source.general.tagline': '均衡混搭。',
    'source.general.desc': '热门好评推荐的综合精选。',
  },
} as const

type Dict = typeof translations.en
type TranslationKey = keyof Dict

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContext {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string>) => string
}

const Context = createContext<I18nContext>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    return (localStorage.getItem(LANG_KEY) as Lang) ?? 'en'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(LANG_KEY, l)
  }, [])

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    const dict = translations[lang] as Record<string, string>
    const fallback = translations.en as Record<string, string>
    let str = dict[key] ?? fallback[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v)
      }
    }
    return str
  }, [lang])

  return (
    <Context.Provider value={{ lang, setLang, t }}>
      {children}
    </Context.Provider>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useLanguage() {
  return useContext(Context)
}

export function useT() {
  return useContext(Context).t
}

// Re-export type for type-safe key lookups in other modules
export type { TranslationKey }
