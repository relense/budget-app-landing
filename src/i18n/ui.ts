// All UI copy for both locales lives here, keyed by section so components can pull
// `t('section.key')` instead of hardcoding strings. See `src/i18n/utils.ts` for the
// `useTranslations()` / `getLangFromUrl()` helpers that read this.
//
// The `'pt-pt'` values are European Portuguese (not pt-BR), written by Claude, informal
// "tu" register throughout. Not reviewed by a native speaker -- worth a proofread pass
// before this is taken as final copy, same as any AI-drafted marketing text would need.

export const languages = {
  en: 'English',
  'pt-pt': 'Português',
} as const;

export const defaultLang = 'en';

export const ui = {
  en: {
    'meta.title': 'Otterbond: a shared budget and savings tracker',
    'meta.description':
      'A shared budget for couples and people who live together. Plan the month together, log expenses, and split the categorizing. No ads, no data-selling.',

    'nav.features': 'Features',
    'nav.howItWorks': 'How it works',
    'nav.screens': 'Screens',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.tools': 'Tools',
    'nav.getStarted': 'Get started',
    'nav.toggleMenu': 'Toggle menu',

    'hero.title': 'Know what you can spend today. Both of you.',
    'hero.subtitle':
      "One number, always up to date: what's safe to spend until payday, after bills and savings. Share it with your partner, or keep it to yourself.",
    'hero.cta': 'Get started',
    'hero.desktopAlt':
      "Otterbond home dashboard on the web, showing total balance, this month's spending, and an emergency fund goal",
    'hero.mobileAlt':
      "Otterbond home screen on mobile in dark mode, showing today's Safe to Spend amount, the balance in the account, and the days left until payday",
    'hero.scrollHint': 'See it in action',
    'hero.waitlistCta': 'iOS and Android: join the list',
    'hero.trustLine': 'No bank connection, on purpose. You log it, the app does the sums.',
    'hero.chips': ['Bills and savings covered', 'Shared with your partner'],

    'nav.whoFor': "Who it's for",

    'worlds.heading': 'You log it. Otterbond does the thinking.',
    'worlds.body':
      "Type the expense. Open the app and it shows what you can spend today, until payday, with the bills still due and your planned savings already covered.",
    'worlds.opens': 'Opens the app',
    'worlds.answer': 'What answers it',
    'worlds.plusBadge': 'Plus',
    'worlds.seeAll': 'See all eight',
    'worlds.portugal': "Built for Portugal first: set your own payday, and the tax calculators follow our rules.",
    'worlds.exampleNote':
      "Personas are illustrative, not real customers. The screens are the app's real layouts with sample numbers, replayed as a demo (the app itself doesn't animate like this).",
    'worlds.chips': {
      couple: ['Rui logged the shop', 'Marta sorted it'],
      spreadsheet: ['Coffee added', 'Sums done'],
      payday: ['Bills covered', 'Lowest point marked'],
      saver: ['Get there 22 months earlier', 'About €6 less a day'],
      freelancer: ['IRS and Social Security', 'Net income at a glance'],
      privacy: ['No bank connected', 'Code sign-in'],
      expat: ['14 payments', 'Net salary clear'],
      closer: ['Month locked', 'Wrap ready'],
    },
    'worlds.items': [
      {
        id: 'couple',
        role: 'The couple',
        name: 'Marta and Rui',
        quote: '“How much did we spend at the supermarket?” “No idea. You?”',
        moment:
          'Rui logs the shop at the till. Marta sorts it into a category later, on the sofa. Next morning they both open the same number.',
        featureTitle: 'One number you both trust',
        featureBody:
          "Two salaries, one rent, one daily Safe to Spend that already counts bills and savings. One of you logs, the other can categorize later, and the app flags what is still uncategorized.",
        plus: false,
      },
      {
        id: 'spreadsheet',
        role: 'The spreadsheet person',
        name: 'Tiago',
        quote: '“I have tracked every expense by hand for years. On purpose. I just want the sheet in my pocket.”',
        moment: 'He types the coffee in on the bus. By the time he sits down at his desk, the sums are already done.',
        featureTitle: 'Your sheet, with the maths done',
        featureBody:
          'No bank sync, no formulas to babysit. You type each expense, Otterbond adds it up and tells you what you can spend today. Share it with whoever needs to see it.',
        plus: false,
      },
      {
        id: 'payday',
        role: 'The until-payday person',
        name: 'Beatriz',
        quote: '“I get paid on the 25th and I am tight by the 15th. Can I have dinner out tonight or not?”',
        moment:
          'Friday, 7pm. She opens the app, sees there is room today, and books the table. Rent still lands on the 1st.',
        featureTitle: 'The daily number, counted to payday',
        featureBody:
          "One figure for today, after the bills still due and your planned savings, counted down to your payday. If it says you are short, slow down. On Plus, the timeline marks the lowest point before it happens.",
        plus: true,
      },
      {
        id: 'saver',
        role: 'The saver with a date',
        name: 'Sofia',
        quote: '“I do not want someday. I want a month and a year.”',
        moment: "She drags the slider up and watches her date move months closer.",
        featureTitle: 'A fund with a date, and a what-if slider',
        featureBody:
          "Set a target date and a monthly amount, and Otterbond shows when you will get there. On Plus, slide the amount to see how many months earlier you arrive, and what it costs you per day.",
        plus: true,
      },
      {
        id: 'freelancer',
        role: 'The freelancer on recibos verdes',
        name: 'Nuno',
        quote: '“The invoice says 1,000. How much of it is actually mine?”',
        moment:
          "Invoice paid. He runs the recibos verdes calculator, sets a monthly amount for taxes on a savings fund, and his daily number subtracts it until he records the deposit.",
        featureTitle: "Know what is yours, then plan the rest",
        featureBody:
          "IVA, IRS and Segurança Social take a share of every invoice. The free calculator shows how much. Add it as the monthly amount of a savings fund and your daily number subtracts it until you record the deposit. Log invoices as they are paid and the number adjusts.",
        plus: false,
      },
      {
        id: 'privacy',
        role: 'The privacy person',
        name: 'Helena',
        quote: '“I would never give an app my bank login. I will type it in myself.”',
        moment: "She types today's lunch in ten seconds and closes the app. Nothing asked her to connect an account.",
        featureTitle: 'You log it, nothing connects',
        featureBody:
          "No bank sync, no account linking, nothing asking you to connect an account. Sign in with a one-time code by email. No ads, no data-selling.",
        plus: false,
      },
      {
        id: 'expat',
        role: 'The expat in Portugal',
        name: 'Daniel',
        quote: '“Fourteen salaries? Subsídios? Nobody told me.”',
        moment:
          'He runs the net salary calculator before signing, then opens Otterbond on payday to see what is really his to spend.',
        featureTitle: 'Calculators first, then the app',
        featureBody:
          "Free Portugal calculators explain net salary, IRS and the holiday and Christmas subsidies. Then track your budget in euros, or in any of 10 currencies (one per workspace, no conversion).",
        plus: false,
      },
      {
        id: 'closer',
        role: 'The month-closer',
        name: 'Carolina',
        quote: '“Closing the month feels like closing a book.”',
        moment:
          "When the month is over, she locks it. Six cards later she knows what came in, where it went and what she kept.",
        featureTitle: 'Lock the month, get your wrap',
        featureBody:
          "Locking freezes a finished month and saves its ending balance. The wrap is free; the full month report and every older month are in Plus.",
        plus: false,
      },
    ],

    'whoPage.title': "Who Otterbond is for: couples, freelancers, savers and more",
    'whoPage.description':
      'Eight ways people use Otterbond: couples, spreadsheet people, freelancers on recibos verdes, savers with a date, and more. You log it, the app tells you what to spend today.',
    'whoPage.heading': "Who it's for",

    'toolsStrip.lead': 'Free tools:',
    'toolsStrip.items': ['net salary', 'recibos verdes', 'IRS', 'pension', 'FIRE'],
    'toolsStrip.more': 'and more',

    'cta.heading': 'One app, one number, both of you.',
    'cta.web': 'Open the web app',
    'cta.waitlist': 'Get notified for iOS and Android',

    'trustStrip.text': 'No ads. No data-selling. No bank-sync creepiness.',

    'problem.text':
      "Most budgeting apps are built for one person. Your life isn't. Otterbond is built for the month to be seen, planned, and managed by both of you.",

    'howItWorks.heading': 'How it works',
    'howItWorks.steps': [
      {
        title: 'Plan the month',
        body: 'Income, fixed and recurring expenses, all visible to both of you in the same space.',
      },
      {
        title: 'Log as you go',
        body: 'No waiting on the other person, no "how much did you spend at the supermarket?" texts.',
      },
      {
        title: 'Check your number every morning',
        body: "Safe to Spend already accounts for the bills still due and your planned savings, so you know at a glance what's actually free to use.",
      },
      {
        title: 'Lock the month and get your wrap',
        body: 'Close the month and get a six-card story: what came in, where it went, and what you saved.',
      },
    ],

    'featureGrid.heading': 'Built for two, not adapted for two',
    'featureGrid.cards': [
      {
        title: 'Safe to Spend',
        body: "A single daily number: your balance minus the bills still due before payday, the savings you've planned and anything you keep aside, spread over the days until payday.",
      },
      {
        title: 'See where your money goes until payday',
        body: 'A timeline from today to payday: every bill on its date, your balance after each one, and the lowest point marked before it happens.',
      },
      {
        title: 'Goals with a date',
        body: "Every savings fund with a monthly amount tells you when you'll reach it. On Plus, slide the amount to see how much sooner you'd get there.",
      },
      {
        title: 'Lock the month, get your wrap',
        body: 'Close the month and get a six-card story: what came in, where it went, what you saved, and one thing to look at next month.',
      },
      {
        title: 'Personal and shared workspaces',
        body: 'Keep a private budget, or share one with your partner. One person logs it, the other categorizes later.',
      },
    ],

    'pricing.heading': 'Simple pricing',
    'pricing.body': 'Everything you need to plan a month together is free. Plus adds the detail behind your number.',
    'pricing.free.name': 'Free',
    'pricing.free.price': '€0',
    'pricing.free.period': '',
    'pricing.free.features': [
      'Budget, bills and savings funds',
      'Safe to Spend daily number',
      'Month wrap when you lock a month',
      '2 workspaces (personal + shared), up to 2 people each',
      'Current and next month',
      'Choose from 10 currencies',
      'Friends and quick invites',
      'Ideas board: vote on what we build next',
    ],
    'pricing.plus.name': 'Plus',
    'pricing.plus.price': '€2.99',
    'pricing.plus.period': '/month',
    'pricing.plus.trial': '15-day free trial (card required, once per person)',
    'pricing.plus.features': [
      'Everything in Free',
      'Full timeline, budget pace and smart insights (price changes, duplicate charges and more)',
      'Full month reports for every month',
      'Savings what-if slider',
      '5 workspaces, up to 5 people each',
      'Plan up to 24 months ahead',
    ],
    'pricing.cta': 'Start free trial',
    'pricing.ctaNote': 'Purchases happen on the web. No app-store markup.',

    'freeTools.heading': 'Free tools, no sign-up',
    'freeTools.body':
      'Four calculators built on the same numbers Otterbond uses internally, useful whether or not you ever install the app.',
    'freeTools.items': [
      {
        title: 'Recibos verdes, without the guesswork',
        body: 'Estimate your net income as a freelancer in Portugal, IRS, Social Security and expenses included, in seconds.',
      },
      {
        title: 'Your real Portuguese net salary',
        body: "Go from gross to net (or the other way around) with 2026's official IRS and Social Security tables, for Mainland, Azores and Madeira.",
      },
      {
        title: 'What will your state pension actually cover?',
        body: "Estimate your Portugal pension gap and how much you'd need to save monthly to close it, based on the EU's own projections.",
      },
    ],
    'freeTools.seeAll': 'See all free tools',

    'screenshotGallery.heading': "See it, don't just take our word for it",
    'screenshotGallery.tabMobile': 'Mobile',
    'screenshotGallery.tabWeb': 'Web',
    'screenshotGallery.altPrefixMobile': 'Otterbond mobile screenshot',
    'screenshotGallery.altPrefixWeb': 'Otterbond web app screenshot',
    'screenshotGallery.viewerLabel': 'Screenshot viewer',
    'screenshotGallery.expandHint': 'Tap to view larger',
    'screenshotGallery.close': 'Close',
    'screenshotGallery.previous': 'Previous screenshot',
    'screenshotGallery.next': 'Next screenshot',
    'screenshotGallery.shots': [
      'Safe to Spend, right on Home',
      'Your timeline to payday',
      'Savings funds',
      'Your month, wrapped',
      'Add an expense in seconds',
    ],
    'screenshotGallery.webShots': ['Safe to Spend on the web', 'Your month, reported'],

    'getTheApp.heading': 'Already live on web',
    'getTheApp.body':
      "Otterbond is free and working today, right in your browser. iOS and Android are close behind: join the list below and we'll email you the moment they land.",
    'getTheApp.platforms': [
      {
        label: 'Web app',
        status: 'Ready now',
        description: 'Works in any browser, nothing to install.',
        cta: 'Open web app',
      },
      {
        label: 'Android app',
        status: 'Coming soon',
        description: 'Join the list below to be first to know.',
        cta: 'Get notified',
      },
      {
        label: 'iOS app',
        status: 'Coming soon',
        description: 'Join the list below to be first to know.',
        cta: 'Get notified',
      },
    ],

    'faq.heading': 'Frequently asked questions',
    'faqPage.title': 'Otterbond FAQ: pricing, privacy, bank connection and more',
    'faqPage.description':
      'Answers to the questions people ask before they start: what Safe to Spend is, why there is no bank connection, what is free and what is in Plus, and what happens to your data.',
    'faqPage.body':
      'What it costs, what it connects to and what happens to your data: the questions people ask before they start.',
    'faq.more': 'See every answer',
    'faqPage.jump': 'All questions',
    'faqPage.prev': 'Previous question',
    'faqPage.next': 'Next question',
    'faq.items': [
      {
        question: 'Who is Otterbond for?',
        answer:
          'Couples and people who live together who want to plan and track money as a team. It also fits solo budgeters: freelancers on recibos verdes, people counting the days to payday, savers with a date, and anyone who would rather type an expense than connect a bank.',
        link: { label: 'See who it is for', hash: '/who-its-for' },
      },
      {
        question: 'What is Safe to Spend?',
        answer:
          "It's the one number Otterbond shows you when you open the app: your balance minus the bills still due before payday, the savings you've planned this cycle and any amount you keep aside, spread over the days until payday. It updates as you log expenses and as payday gets closer. Set your payday and confirm your balance to see it.",
      },
      {
        question: 'Why is there no bank connection?',
        answer:
          "Because you don't need to hand anyone your bank login to know what you can spend. You log expenses yourself, which takes seconds, and Otterbond does the sums. There are no bank credentials to leak, no sync to break, and nothing nagging you to connect an account.",
      },
      {
        question: 'Is Otterbond free?',
        answer:
          'Yes, the core of Otterbond, budgeting, bills, savings funds, and your daily Safe to Spend number, is free. Plus is an optional paid tier for people who want the detail behind that number.',
      },
      {
        question: "What's in Plus?",
        answer:
          "The timeline, pace and insights behind your Safe to Spend number, full month reports for every month, the savings what-if slider, five workspaces instead of two (with up to five people each), and planning up to 24 months ahead. The 15-day trial needs a card and is granted once per person.",
        link: { label: 'See pricing', hash: '#pricing' },
      },
      {
        question: 'Can I share a budget with someone else?',
        answer:
          "Yes. Keep a personal budget private, or share a workspace with your partner as an Editor (can add and edit everything) or a Viewer (read-only). Invite anyone who already has an Otterbond account by email, or send an app invite if they don't yet; adding friends is optional. Uncategorized expenses, friend requests and workspace invites show up in the app's notifications. Free includes 2 workspaces with up to 2 people each; Plus includes 5 workspaces with up to 5 people each.",
      },
      {
        question: 'What currencies does it support?',
        answer:
          "Ten: EUR, GBP, USD, JPY, CNY, CHF, SEK, NOK, DKK and PLN. Each workspace tracks one currency (the owner can set it for everyone), and switching currency relabels your numbers without converting them.",
      },
      {
        question: 'Do I need a password?',
        answer: 'No. Sign in with a one-time code sent to your email instead.',
      },
      {
        question: 'Is my data sold or used for ads?',
        answer: "No. There is no advertising and no data-selling, and no third-party analytics or ad trackers. Error reports go to Sentry, and first-party usage stats are kept for 90 days. The details are in the Privacy Policy.",
        link: { label: 'Read the Privacy Policy', hash: '/privacy' },
      },
      {
        question: 'When can I actually use it?',
        answer:
          "The web app is live today, free to use right in your browser. The iOS and Android apps are still in progress. Join the waitlist and we'll email you the moment either is ready.",
      },
    ],

    'community.heading': 'Built with the people who use it',
    'community.body':
      "We don't want to build another bloated budget app with a feature for everything and a reason to use none of them. So the plan is to build what couples actually ask for, not what looks good on a features page.",
    'community.points': [
      {
        title: 'Feedback, built in',
        body: "A feedback option lives right in the app, so telling us what's missing or broken takes seconds, not a support ticket.",
      },
      {
        title: 'You shape what comes next',
        body: "The roadmap follows what people actually ask for. If enough of you need something, it moves up, if no one does, we don't build it just to have it.",
      },
      {
        title: 'No bloat, on purpose',
        body: "Every feature has to earn its place. If it doesn't help you manage money together, it doesn't make the cut.",
      },
    ],

    'waitlist.heading': 'iOS and Android are almost here',
    'waitlist.body':
      "Leave your email and we'll let you know the moment Otterbond lands on the App Store or Google Play. One email, no spam.",
    'waitlist.closingLine':
      "Already using Otterbond on the web? You're all set, this waitlist is just for the iOS and Android apps.",
    'waitlist.emailLabel': 'Email address',
    'waitlist.placeholder': 'you@example.com',
    'waitlist.submit': 'Notify me',
    'waitlist.joining': 'Adding you...',
    'waitlist.joined': "You're on the list",
    'waitlist.msg.invalidEmail': 'Enter a valid email address.',
    'waitlist.msg.notConnected': "Signups aren't connected yet, check back soon.",
    'waitlist.msg.success': "You're on the list. We'll email you the moment iOS or Android is ready.",
    'waitlist.msg.alreadyOnList': "You're already on the list.",
    'waitlist.msg.tooMany': 'Too many attempts. Try again later.',
    'waitlist.msg.generic': 'Something went wrong. Try again in a moment.',

    'cookieConsent.text':
      'We use analytics to understand how visitors use this site. No personal data is sold or shared with advertisers.',
    'cookieConsent.accept': 'Accept',
    'cookieConsent.reject': 'Reject',

    'footer.tagline': 'A shared, multi-currency budget and savings tracker.',
    'footer.productHeading': 'Otterbond',
    'footer.whoFor': "Who it's for",
    'footer.pricing': 'Pricing',
    'footer.faq': 'FAQ',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.toolsHeading': 'Free tools',
    'footer.toolsRecibosVerdes': 'Portugal freelancer tax calculator',
    'footer.toolsSalarioLiquido': 'Portugal net salary calculator',
    'footer.toolsReforma': 'Portugal state pension calculator',
    'footer.toolsAll': 'All free tools',
    'footer.madeBy': 'Made by relense',

    'notFound.title': 'Page not found, Otterbond',
    'notFound.description': "This page doesn't exist.",
    'notFound.heading': 'Page not found',
    'notFound.body': "The page you're looking for doesn't exist, or the link is out of date.",
    'notFound.cta': 'Back home',

    'legal.lastUpdated': 'Last updated',
    'privacyPage.title': 'Privacy Policy, Otterbond',
    'privacyPage.description': 'How Otterbond collects, uses, and protects your data.',
    'privacyPage.heading': 'Privacy Policy',
    'termsPage.title': 'Terms of Service, Otterbond',
    'termsPage.description': 'The terms that govern your use of Otterbond.',
    'termsPage.heading': 'Terms of Service',
  },
  'pt-pt': {
    'meta.title': 'Otterbond: um orçamento e poupanças partilhados',
    'meta.description':
      'Um orçamento partilhado para casais e pessoas que vivem juntas. Planeiem o mês, registem despesas, e dividam o trabalho. Sem anúncios, sem venda de dados.',

    'nav.features': 'Funcionalidades',
    'nav.howItWorks': 'Como funciona',
    'nav.screens': 'Ecrãs',
    'nav.pricing': 'Preços',
    'nav.faq': 'FAQ',
    'nav.tools': 'Ferramentas',
    'nav.getStarted': 'Começar',
    'nav.toggleMenu': 'Alternar menu',

    'hero.title': 'Sabe o que podes gastar hoje. Os dois.',
    'hero.subtitle':
      "Um número, sempre atualizado: o que podes gastar até ao dia do ordenado, depois das contas e das poupanças. Partilha-o com o teu parceiro, ou guarda-o só para ti.",
    'hero.cta': 'Começar',
    'hero.desktopAlt':
      'Painel principal da Otterbond na web, mostrando o saldo total, os gastos deste mês e um objetivo de fundo de emergência',
    'hero.mobileAlt':
      'Ecrã principal da Otterbond no telemóvel em modo escuro, a mostrar o valor Disponível para Gastar de hoje, o saldo na conta e os dias que faltam até ao ordenado',
    'hero.scrollHint': 'Vê a app em ação',
    'hero.waitlistCta': 'iOS e Android: entra na lista',
    'hero.trustLine': 'Sem ligação ao banco, de propósito. Tu apontas, a app faz as contas.',
    'hero.chips': ['Contas e poupanças cobertas', 'Partilhado com o teu parceiro'],

    'nav.whoFor': 'Para quem',

    'worlds.heading': 'Tu registas. A Otterbond faz as contas.',
    'worlds.body':
      "Escreve a despesa. Abre a app e vê o que podes gastar hoje, até ao ordenado, com as contas que faltam pagar e as poupanças planeadas já cobertas.",
    'worlds.opens': 'Abre a app',
    'worlds.answer': 'O que responde',
    'worlds.plusBadge': 'Plus',
    'worlds.seeAll': 'Ver os oito',
    'worlds.portugal': "Feita primeiro para Portugal: defines o teu dia de ordenado, e as calculadoras seguem as nossas regras fiscais.",
    'worlds.exampleNote':
      'As personas são ilustrativas, não clientes reais. Os ecrãs são os layouts reais da app com números de amostra, repetidos como demonstração (a app em si não anima assim).',
    'worlds.chips': {
      couple: ['O Rui registou as compras', 'A Marta categorizou'],
      spreadsheet: ['Café adicionado', 'Contas feitas'],
      payday: ['Contas cobertas', 'Ponto mais baixo marcado'],
      saver: ['Chegas 22 meses antes', 'Cerca de 6 € a menos por dia'],
      freelancer: ['IRS e Segurança Social', 'Líquido num relance'],
      privacy: ['Nenhum banco ligado', 'Entrada com código'],
      expat: ['14 pagamentos', 'Líquido à vista'],
      closer: ['Mês fechado', 'Resumo pronto'],
    },
    'worlds.items': [
      {
        id: 'couple',
        role: 'O casal',
        name: 'Marta e Rui',
        quote: '“Quanto gastámos no supermercado?” “Nem ideia. E tu?”',
        moment:
          'O Rui regista as compras na caixa. A Marta categoriza mais tarde, no sofá. Na manhã seguinte, os dois abrem o mesmo número.',
        featureTitle: 'Um número em que os dois confiam',
        featureBody:
          "Dois ordenados, uma renda, um Disponível para Gastar diário que já conta com as contas e as poupanças. Um regista, o outro pode categorizar mais tarde, e a app assinala o que ainda está por categorizar.",
        plus: false,
      },
      {
        id: 'spreadsheet',
        role: 'Quem vive no Excel',
        name: 'Tiago',
        quote: '“Registo cada despesa à mão há anos. De propósito. Só quero a folha de cálculo no bolso.”',
        moment: 'Escreve o café no autocarro. Quando se senta à secretária, as contas já estão feitas.',
        featureTitle: 'A tua folha, com as contas feitas',
        featureBody:
          'Sem sincronização bancária, sem fórmulas para vigiar. Escreves cada despesa, a Otterbond soma tudo e diz-te o que podes gastar hoje. Partilha com quem precisar de ver.',
        plus: false,
      },
      {
        id: 'payday',
        role: 'Quem conta os dias até ao ordenado',
        name: 'Beatriz',
        quote: '“Recebo no dia 25 e no dia 15 já estou apertada. Posso jantar fora hoje ou não?”',
        moment:
          'Sexta-feira, 19h. Abre a app, vê que hoje há margem e reserva a mesa. A renda continua a sair no dia 1.',
        featureTitle: 'O número diário, contado até ao ordenado',
        featureBody:
          "Um valor para hoje, depois das contas que faltam pagar e das poupanças planeadas, contado até ao dia do ordenado. Se diz que estás curto, abranda. No Plus, a linha do tempo marca o ponto mais baixo antes de acontecer.",
        plus: true,
      },
      {
        id: 'saver',
        role: 'Quem poupa para uma data',
        name: 'Sofia',
        quote: '“Não quero um dia. Quero um mês e um ano.”',
        moment: "Arrasta o cursor para cima e vê a data aproximar-se meses.",
        featureTitle: 'Um fundo com data, e um cursor de simulação',
        featureBody:
          "Define uma data e um valor mensal, e a Otterbond mostra quando lá chegas. No Plus, desliza o valor para ver quantos meses antes chegas, e quanto te custa por dia.",
        plus: true,
      },
      {
        id: 'freelancer',
        role: 'O freelancer a recibos verdes',
        name: 'Nuno',
        quote: '“O recibo diz 1.000. Quanto disto é realmente meu?”',
        moment:
          "Recibo pago. Corre o simulador de recibos verdes, define um valor mensal para impostos num fundo de poupança, e o número diário desconta-o até registar o depósito.",
        featureTitle: "Sabe o que é teu e planeia o resto",
        featureBody:
          "O IVA, o IRS e a Segurança Social ficam com uma parte de cada recibo. O simulador gratuito mostra quanto. Acrescenta-o como valor mensal de um fundo de poupança e o teu número diário desconta-o até registares o depósito. Regista os recibos à medida que são pagos e o número ajusta-se.",
        plus: false,
      },
      {
        id: 'privacy',
        role: 'Quem não dá o login do banco',
        name: 'Helena',
        quote: '“Nunca daria o login do meu banco a uma app. Escrevo eu.”',
        moment: 'Escreve o almoço de hoje em dez segundos e fecha a app. Nada lhe pediu para ligar uma conta.',
        featureTitle: 'Tu registas, nada se liga',
        featureBody:
          "Sem sincronização bancária, sem ligar contas, nada a pedir-te para ligares uma conta. Entras com um código único por email. Sem anúncios, sem venda de dados.",
        plus: false,
      },
      {
        id: 'expat',
        role: 'O estrangeiro em Portugal',
        name: 'Daniel',
        quote: '“Catorze ordenados? Subsídios? Ninguém me explicou.”',
        moment:
          'Corre a calculadora de salário líquido antes de assinar, e abre a Otterbond no dia do ordenado para ver o que é mesmo dele para gastar.',
        featureTitle: 'Primeiro as calculadoras, depois a app',
        featureBody:
          "As calculadoras gratuitas explicam o salário líquido, o IRS e os subsídios de férias e Natal. Depois acompanha o teu orçamento em euros, ou em qualquer das 10 moedas (uma por espaço, sem conversão).",
        plus: false,
      },
      {
        id: 'closer',
        role: 'Quem fecha o mês',
        name: 'Carolina',
        quote: '“Fechar o mês sabe a fechar um livro.”',
        moment:
          "Quando o mês acaba, fecha-o. Seis cartões depois, sabe o que entrou, para onde foi e o que ficou.",
        featureTitle: 'Fecha o mês, recebe o teu resumo',
        featureBody:
          "Fechar o mês congela um mês terminado e guarda o seu saldo final. O resumo é grátis; o relatório completo e todos os meses anteriores estão no Plus.",
        plus: false,
      },
    ],

    'whoPage.title': 'Para quem é a Otterbond: casais, freelancers, poupadores e mais',
    'whoPage.description':
      'Oito formas de usar a Otterbond: casais, quem vive no Excel, freelancers a recibos verdes, poupadores com data, e mais. Tu registas, a app diz-te o que gastar hoje.',
    'whoPage.heading': 'Para quem é',

    'toolsStrip.lead': 'Ferramentas gratuitas:',
    'toolsStrip.items': ['salário líquido', 'recibos verdes', 'IRS', 'reforma', 'FIRE'],
    'toolsStrip.more': 'e mais',

    'cta.heading': 'Uma app, um número, os dois.',
    'cta.web': 'Abrir a aplicação web',
    'cta.waitlist': 'Avisa-me do iOS e do Android',

    'trustStrip.text': 'Sem anúncios. Sem venda de dados. Sem sincronização bancária invasiva.',

    'problem.text':
      'A maioria das apps de orçamento é feita para uma pessoa. A tua vida não é. A Otterbond é feita para que o mês seja visto, planeado e gerido pelos dois.',

    'howItWorks.heading': 'Como funciona',
    'howItWorks.steps': [
      {
        title: 'Planeia o mês',
        body: 'Rendimentos, despesas fixas e recorrentes, tudo visível para os dois no mesmo espaço.',
      },
      {
        title: 'Regista à medida que vai acontecendo',
        body: 'Sem esperar pela outra pessoa, sem mensagens do tipo "quanto gastaste no supermercado?".',
      },
      {
        title: 'Confere o teu número todas as manhãs',
        body: 'O Disponível para Gastar já conta com as contas que faltam pagar e as poupanças planeadas, para saberes num relance o que é mesmo livre para usar.',
      },
      {
        title: 'Fecha o mês e recebe o teu resumo',
        body: 'Fecha o mês e recebe uma história de seis cartões: o que entrou, para onde foi, e quanto poupaste.',
      },
    ],

    'featureGrid.heading': 'Pensada para dois, não adaptada para dois',
    'featureGrid.cards': [
      {
        title: 'Disponível para Gastar',
        body: 'Um único número diário: o teu saldo menos as contas que faltam pagar até ao ordenado, as poupanças que planeaste e o que guardas de lado, repartido pelos dias até ao ordenado.',
      },
      {
        title: 'Vê para onde vai o teu dinheiro até ao ordenado',
        body: 'Uma linha do tempo desde hoje até ao ordenado: cada conta na sua data, o teu saldo depois de cada uma, e o ponto mais baixo marcado antes de acontecer.',
      },
      {
        title: 'Objetivos com data',
        body: 'Cada fundo de poupança com um valor mensal diz-te quando o vais alcançar. No Plus, desliza o valor para ver quanto mais cedo lá chegas.',
      },
      {
        title: 'Fecha o mês, recebe o teu resumo',
        body: 'Fecha o mês e recebe uma história de seis cartões: o que entrou, para onde foi, quanto poupaste, e uma coisa a olhar no mês seguinte.',
      },
      {
        title: 'Espaços pessoais e partilhados',
        body: 'Mantém um orçamento privado, ou partilha um com o teu parceiro. Um regista, o outro categoriza mais tarde.',
      },
    ],

    'pricing.heading': 'Preços simples',
    'pricing.body':
      'Tudo o que precisas para planear o mês em conjunto é grátis. O Plus acrescenta o detalhe por trás do teu número.',
    'pricing.free.name': 'Grátis',
    'pricing.free.price': '€0',
    'pricing.free.period': '',
    'pricing.free.features': [
      'Orçamento, contas e fundos de poupança',
      'Número diário Disponível para Gastar',
      'Resumo do mês ao fechares um mês',
      '2 espaços (pessoal + partilhado), até 2 pessoas em cada',
      'Mês atual e o seguinte',
      'Escolhe entre 10 moedas',
      'Amigos e convites rápidos',
      'Quadro de ideias: vota no que construímos a seguir',
    ],
    'pricing.plus.name': 'Plus',
    'pricing.plus.price': '€2.99',
    'pricing.plus.period': '/mês',
    'pricing.plus.trial': '15 dias grátis (exige cartão, uma vez por pessoa)',
    'pricing.plus.features': [
      'Tudo o que há no Grátis',
      'Linha do tempo completa, ritmo e informações inteligentes (mudanças de preço, cobranças duplicadas e mais)',
      'Relatórios de mês completos, de todos os meses',
      'Cursor de simulação para poupanças',
      '5 espaços, até 5 pessoas em cada',
      'Planeia até 24 meses à frente',
    ],
    'pricing.cta': 'Começar avaliação grátis',
    'pricing.ctaNote': 'As compras acontecem na web. Sem sobretaxa de loja de aplicações.',

    'freeTools.heading': 'Ferramentas gratuitas, sem registo',
    'freeTools.body':
      'Quatro calculadoras construídas com os mesmos números que o Otterbond usa por dentro, úteis mesmo que nunca chegues a instalar a app.',
    'freeTools.items': [
      {
        title: 'Recibos verdes, sem adivinhar',
        body: 'Estima o teu rendimento líquido como trabalhador independente em Portugal, IRS, Segurança Social e despesas incluídos, em segundos.',
      },
      {
        title: 'O teu salário líquido, sem surpresas',
        body: 'Passa de bruto a líquido (ou ao contrário) com as tabelas oficiais de IRS e Segurança Social de 2026, para Continente, Açores e Madeira.',
      },
      {
        title: 'Quanto vai cobrir a tua pensão?',
        body: 'Estima o teu défice de reforma em Portugal e quanto precisas de poupar por mês para o fechar, com base nas projeções oficiais da UE.',
      },
    ],
    'freeTools.seeAll': 'Ver todas as ferramentas',

    'screenshotGallery.heading': 'Vê por ti mesmo, não fiques só pela nossa palavra',
    'screenshotGallery.tabMobile': 'Telemóvel',
    'screenshotGallery.tabWeb': 'Web',
    'screenshotGallery.altPrefixMobile': 'Captura de ecrã da Otterbond no telemóvel',
    'screenshotGallery.altPrefixWeb': 'Captura de ecrã da Otterbond na aplicação web',
    'screenshotGallery.viewerLabel': 'Visualizador de capturas de ecrã',
    'screenshotGallery.expandHint': 'Toca para ver em maior',
    'screenshotGallery.close': 'Fechar',
    'screenshotGallery.previous': 'Captura de ecrã anterior',
    'screenshotGallery.next': 'Próxima captura de ecrã',
    'screenshotGallery.shots': [
      'Disponível para Gastar, mesmo no Início',
      'A tua linha do tempo até ao ordenado',
      'Fundos de poupança',
      'O teu mês, resumido',
      'Adiciona uma despesa em segundos',
    ],
    'screenshotGallery.webShots': ['Disponível para Gastar na web', 'O teu mês, em relatório'],

    'getTheApp.heading': 'Já disponível na web',
    'getTheApp.body':
      'A Otterbond já é gratuita e funciona hoje, direto no teu navegador. O iOS e o Android estão quase a chegar: junta-te à lista abaixo e enviamos-te um email assim que estiverem prontas.',
    'getTheApp.platforms': [
      {
        label: 'Aplicação web',
        status: 'Pronta a usar',
        description: 'Funciona em qualquer navegador, sem instalar nada.',
        cta: 'Abrir aplicação web',
      },
      {
        label: 'Aplicação Android',
        status: 'Brevemente',
        description: 'Junta-te à lista abaixo para seres o primeiro a saber.',
        cta: 'Recebe uma notificação',
      },
      {
        label: 'Aplicação iOS',
        status: 'Brevemente',
        description: 'Junta-te à lista abaixo para seres o primeiro a saber.',
        cta: 'Recebe uma notificação',
      },
    ],

    'faq.heading': 'Perguntas frequentes',
    'faqPage.title': 'Perguntas frequentes sobre a Otterbond: preços, privacidade, ligação ao banco e mais',
    'faqPage.description':
      'Respostas às perguntas que as pessoas fazem antes de começar: o que é o Disponível para Gastar, porque não há ligação ao banco, o que é grátis e o que tem o Plus, e o que acontece aos teus dados.',
    'faqPage.body':
      'Quanto custa, a que se liga e o que acontece aos teus dados: as perguntas que as pessoas fazem antes de começar.',
    'faq.more': 'Ver todas as respostas',
    'faqPage.jump': 'Todas as perguntas',
    'faqPage.prev': 'Pergunta anterior',
    'faqPage.next': 'Pergunta seguinte',
    'faq.items': [
      {
        question: 'Para quem é a Otterbond?',
        answer:
          'Para casais e pessoas que vivem juntas e querem planear e acompanhar o dinheiro em equipa. Também serve quem orça sozinho: freelancers a recibos verdes, quem conta os dias até ao ordenado, quem poupa para uma data, e quem prefere escrever uma despesa a ligar um banco.',
        link: { label: 'Ver para quem é', hash: '/pt-pt/para-quem' },
      },
      {
        question: 'O que é o Disponível para Gastar?',
        answer:
          "É o número que a Otterbond te mostra quando abres a app: o teu saldo menos as contas que faltam pagar até ao ordenado, as poupanças que planeaste neste ciclo e o valor que guardas de lado, repartido pelos dias até ao ordenado. Atualiza-se à medida que registas despesas e o ordenado se aproxima. Define o dia do ordenado e confirma o teu saldo para o ver.",
      },
      {
        question: 'Porque não há ligação ao banco?',
        answer:
          'Porque não precisas de dar o login do banco a ninguém para saber o que podes gastar. Registas as despesas tu, o que demora segundos, e a Otterbond faz as contas. Não há credenciais bancárias para vazar, nem sincronização para falhar, nem nada a insistir para ligares uma conta.',
      },
      {
        question: 'A Otterbond é gratuita?',
        answer:
          'Sim, o essencial da Otterbond, orçamento, contas e fundos de poupança, e o teu número diário Disponível para Gastar, é gratuito. O Plus é um plano pago opcional para quem quer o detalhe por trás desse número.',
      },
      {
        question: 'O que tem o Plus?',
        answer:
          "A linha do tempo, o ritmo e as informações por trás do teu número Disponível para Gastar, relatórios de mês completos de todos os meses, o cursor de simulação das poupanças, cinco espaços em vez de dois (com até cinco pessoas em cada), e planeamento até 24 meses à frente. A avaliação de 15 dias exige cartão e é dada uma vez por pessoa.",
        link: { label: 'Ver preços', hash: '#pricing' },
      },
      {
        question: 'Posso partilhar um orçamento com outra pessoa?',
        answer:
          "Sim. Mantém um orçamento pessoal privado, ou partilha um espaço com o teu parceiro, como Editor (pode adicionar e editar tudo) ou como Visualizador (só leitura). Convida por email quem já tem conta na Otterbond, ou envia um convite para a app a quem ainda não tem; adicionar amigos é opcional. As despesas por categorizar, os pedidos de amizade e os convites para espaços aparecem nas notificações da app. O plano Grátis inclui 2 espaços com até 2 pessoas em cada; o Plus inclui 5 espaços com até 5 pessoas em cada.",
      },
      {
        question: 'Que moedas são suportadas?',
        answer:
          "Dez: EUR, GBP, USD, JPY, CNY, CHF, SEK, NOK, DKK e PLN. Cada espaço acompanha uma moeda (o proprietário pode defini-la para todos), e mudar de moeda muda apenas a etiqueta dos teus números, sem os converter.",
      },
      {
        question: 'Preciso de uma palavra-passe?',
        answer: 'Não. Em vez disso, inicias sessão com um código único enviado para o teu email.',
      },
      {
        question: 'Os meus dados são vendidos ou usados para anúncios?',
        answer: "Não. Não há publicidade nem venda de dados, nem analítica ou rastreadores publicitários de terceiros. Os relatórios de erros vão para o Sentry, e as estatísticas de utilização próprias são guardadas durante 90 dias. Os detalhes estão na Política de Privacidade.",
        link: { label: 'Ler a Política de Privacidade', hash: '/pt-pt/privacy' },
      },
      {
        question: 'Quando é que posso realmente usá-la?',
        answer:
          'A aplicação web já está disponível, gratuita e direto no teu navegador. As aplicações iOS e Android ainda estão em desenvolvimento. Junta-te à lista de espera e enviamos-te um email assim que alguma delas estiver pronta.',
      },
    ],

    'community.heading': 'Feita com quem a usa',
    'community.body':
      'Não queremos construir mais uma app de orçamento inchada, com uma funcionalidade para tudo e um motivo para não usar nenhuma delas. Por isso a ideia é construir o que os casais realmente pedem, não o que fica bem numa lista de funcionalidades.',
    'community.points': [
      {
        title: 'Feedback, integrado',
        body: 'Uma opção de feedback está mesmo dentro da app, para que dizer-nos o que falta ou está avariado demore segundos, não um pedido de suporte.',
      },
      {
        title: 'Ajudas a decidir o que vem a seguir',
        body: 'O roadmap segue o que as pessoas realmente pedem. Se muitos de vocês precisarem de algo, sobe na lista, se ninguém precisar, não o construímos só por construir.',
      },
      {
        title: 'Sem inchaço, de propósito',
        body: 'Cada funcionalidade tem de justificar o seu lugar. Se não ajudar a gerir o dinheiro em conjunto, não entra.',
      },
    ],

    'waitlist.heading': 'O iOS e o Android estão quase a chegar',
    'waitlist.body':
      'Deixa o teu email e avisamos-te assim que a Otterbond chegar à App Store ou à Google Play. Um único email, sem spam.',
    'waitlist.closingLine':
      'Já usas a Otterbond na web? Está tudo certo, esta lista de espera é só para as aplicações iOS e Android.',
    'waitlist.emailLabel': 'Endereço de email',
    'waitlist.placeholder': 'tu@example.com',
    'waitlist.submit': 'Avisa-me',
    'waitlist.joining': 'A adicionar-te...',
    'waitlist.joined': 'Já estás na lista',
    'waitlist.msg.invalidEmail': 'Introduz um endereço de email válido.',
    'waitlist.msg.notConnected': 'As inscrições ainda não estão ligadas, volta a verificar em breve.',
    'waitlist.msg.success': 'Já estás na lista. Enviamos-te um email assim que o iOS ou o Android estiver pronto.',
    'waitlist.msg.alreadyOnList': 'Já estás na lista.',
    'waitlist.msg.tooMany': 'Demasiadas tentativas. Tenta novamente mais tarde.',
    'waitlist.msg.generic': 'Algo correu mal. Tenta novamente dentro de momentos.',

    'cookieConsent.text':
      'Usamos análises para perceber como os visitantes usam este site. Não vendemos nem partilhamos dados pessoais com publicidade.',
    'cookieConsent.accept': 'Aceitar',
    'cookieConsent.reject': 'Rejeitar',

    'footer.tagline': 'Um controlo de orçamento e poupanças partilhado e multi-moeda.',
    'footer.productHeading': 'Otterbond',
    'footer.whoFor': 'Para quem',
    'footer.pricing': 'Preços',
    'footer.faq': 'FAQ',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.toolsHeading': 'Ferramentas gratuitas',
    'footer.toolsRecibosVerdes': 'Simulador recibos verdes',
    'footer.toolsSalarioLiquido': 'Calculadora salário líquido',
    'footer.toolsReforma': 'Simulador de reforma',
    'footer.toolsAll': 'Todas as ferramentas',
    'footer.madeBy': 'Feito por relense',

    'notFound.title': 'Página não encontrada, Otterbond',
    'notFound.description': 'Esta página não existe.',
    'notFound.heading': 'Página não encontrada',
    'notFound.body': 'A página que procuras não existe, ou a hiperligação está desatualizada.',
    'notFound.cta': 'Voltar ao início',

    'legal.lastUpdated': 'Última atualização',
    'privacyPage.title': 'Política de Privacidade, Otterbond',
    'privacyPage.description': 'Como a Otterbond recolhe, utiliza e protege os teus dados.',
    'privacyPage.heading': 'Política de Privacidade',
    'termsPage.title': 'Termos de Serviço, Otterbond',
    'termsPage.description': 'Os termos que regem a tua utilização da Otterbond.',
    'termsPage.heading': 'Termos de Serviço',
  },
} as const;

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)['en'];
