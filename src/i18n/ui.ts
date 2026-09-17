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
    'nav.getStarted': 'Get started',
    'nav.toggleMenu': 'Toggle menu',

    'hero.title': 'Know what you can spend today. Both of you.',
    'hero.subtitle':
      "One number, updated every morning: what's safe to spend until payday, after bills and savings. Share it with your partner, or keep it to yourself.",
    'hero.cta': 'Get started',
    'hero.desktopAlt':
      "Otterbond home dashboard on the web, showing total balance, this month's spending, and an emergency fund goal",
    'hero.mobileAlt':
      "Otterbond home screen on mobile in dark mode, showing today's Safe to Spend amount, the balance in the account, and the days left until payday",
    'hero.scrollHint': 'See it in action',

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
        body: "Safe to Spend already accounts for bills and savings, so you know at a glance what's actually free to use.",
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
        body: "A single daily number that already accounts for your bills, your savings deposits and a small buffer. If it's green, go ahead.",
      },
      {
        title: 'See where your money goes until payday',
        body: 'A timeline from today to payday: every bill on its date, your balance after each one, and the lowest point marked before it happens.',
      },
      {
        title: 'Goals with a date',
        body: "Every savings fund tells you when you'll reach it, and what a few euros a day would change.",
      },
      {
        title: 'Lock the month, get your wrap',
        body: 'Close the month and get a six-card story: what came in, where it went, what you saved, and one thing to look at next month.',
      },
      {
        title: 'Personal and shared, side by side',
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
      'Personal + shared, 2 workspaces',
      'Current and next month',
      '10 currencies, switch anytime',
      'Friends and quick invites',
      'Feedback board — vote on what we build next',
    ],
    'pricing.plus.name': 'Plus',
    'pricing.plus.price': '€2.99',
    'pricing.plus.period': '/month',
    'pricing.plus.trial': '15-day free trial',
    'pricing.plus.features': [
      'Everything in Free',
      'Full timeline, budget pace and smart insights — price changes, duplicate charges, more',
      'Full month reports and history',
      'Savings goal projections',
      '5 workspaces',
      'Plan up to 24 months ahead',
    ],
    'pricing.cta': 'Start free trial',
    'pricing.ctaNote': 'Purchases happen on the web. No app-store markup.',

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
    'faq.items': [
      {
        question: 'Who is Otterbond for?',
        answer:
          'Couples and people who live together who want to plan and track money as a team, not just split bills after the fact. It also works well for a group budgeting a shared trip.',
      },
      {
        question: 'What is Safe to Spend?',
        answer:
          "It's the one number Otterbond shows you every morning: what you can spend today without touching your bills or your savings. It updates automatically as you log expenses and payday gets closer.",
      },
      {
        question: 'Is Otterbond free?',
        answer:
          'Yes, the core of Otterbond, budgeting, bills, savings funds, and your daily Safe to Spend number, is free. Plus is an optional paid tier for people who want the detail behind that number.',
      },
      {
        question: "What's in Plus?",
        answer:
          'The timeline, pace and insights behind your Safe to Spend number, full month reports and history, savings goal projections, five workspaces instead of two, and planning up to 24 months ahead.',
        link: { label: 'See pricing', hash: '#pricing' },
      },
      {
        question: 'Can I share a budget with someone else?',
        answer:
          "Yes. Keep a personal budget private, or share one with your partner, as an Editor with full access or a Viewer with read-only access. Add someone as a friend once, then invite them into any workspace, personal or shared, whenever it makes sense. You'll both get notified about uncategorized expenses, friend requests, and workspace invites, so it doesn't all fall on one of you. Free includes 2 workspaces, Plus includes 5.",
      },
      {
        question: 'What currencies does it support?',
        answer:
          'Ten, including EUR, USD, GBP, JPY, and CHF, so everyone in a shared workspace can see balances in the currency they actually use.',
      },
      {
        question: 'Do I need a password?',
        answer: 'No. Sign in with a one-time code sent to your email instead.',
      },
      {
        question: 'Is my data sold or used for ads?',
        answer: "No. There's no advertising, no data-selling, and no third-party tracking of any kind.",
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

    'footer.tagline': 'A shared, multi-currency budget and savings tracker.',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.toolsHeading': 'Free tools',
    'footer.toolsRecibosVerdes': 'Portugal freelancer tax calculator',
    'footer.toolsSalarioLiquido': 'Portugal net salary calculator',
    'footer.toolsCompoundInterest': 'Compound interest calculator',
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
    'nav.getStarted': 'Começar',
    'nav.toggleMenu': 'Alternar menu',

    'hero.title': 'Sabe o que podes gastar hoje. Os dois.',
    'hero.subtitle':
      'Um número, atualizado todas as manhãs: o que podes gastar até ao dia do ordenado, depois das contas e das poupanças. Partilha-o com o teu parceiro, ou guarda-o só para ti.',
    'hero.cta': 'Começar',
    'hero.desktopAlt':
      'Painel principal da Otterbond na web, mostrando o saldo total, os gastos deste mês e um objetivo de fundo de emergência',
    'hero.mobileAlt':
      'Ecrã principal da Otterbond no telemóvel em modo escuro, a mostrar o valor Podes Gastar de hoje, o saldo na conta e os dias que faltam até ao ordenado',
    'hero.scrollHint': 'Vê a app em ação',

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
        body: 'O Podes Gastar já conta com as contas e as poupanças, para saberes num relance o que é mesmo livre para usar.',
      },
      {
        title: 'Fecha o mês e recebe o teu resumo',
        body: 'Fecha o mês e recebe uma história de seis cartões: o que entrou, para onde foi, e quanto poupaste.',
      },
    ],

    'featureGrid.heading': 'Pensada para dois, não adaptada para dois',
    'featureGrid.cards': [
      {
        title: 'Podes Gastar',
        body: 'Um único número diário que já conta com as tuas contas, os teus depósitos de poupança e uma pequena margem. Se estiver verde, avança.',
      },
      {
        title: 'Vê para onde vai o teu dinheiro até ao ordenado',
        body: 'Uma linha do tempo desde hoje até ao ordenado: cada conta na sua data, o teu saldo depois de cada uma, e o ponto mais baixo marcado antes de acontecer.',
      },
      {
        title: 'Objetivos com data',
        body: 'Cada fundo de poupança diz-te quando o vais alcançar, e o que uns euros por dia mudariam.',
      },
      {
        title: 'Fecha o mês, recebe o teu resumo',
        body: 'Fecha o mês e recebe uma história de seis cartões: o que entrou, para onde foi, quanto poupaste, e uma coisa a olhar no mês seguinte.',
      },
      {
        title: 'Pessoal e partilhado, lado a lado',
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
      'Número diário Podes Gastar',
      'Resumo do mês ao fechares um mês',
      'Pessoal + partilhado, 2 espaços',
      'Mês atual e o seguinte',
      '10 moedas, muda quando quiseres',
      'Amigos e convites rápidos',
      'Quadro de Feedback — vota no que construímos a seguir',
    ],
    'pricing.plus.name': 'Plus',
    'pricing.plus.price': '€2.99',
    'pricing.plus.period': '/mês',
    'pricing.plus.trial': '15 dias grátis',
    'pricing.plus.features': [
      'Tudo o que há no Grátis',
      'Linha do tempo completa, ritmo e informações inteligentes — mudanças de preço, cobranças duplicadas e mais',
      'Relatórios de mês completos e histórico',
      'Projeções dos objetivos de poupança',
      '5 espaços',
      'Planeia até 24 meses à frente',
    ],
    'pricing.cta': 'Começar avaliação grátis',
    'pricing.ctaNote': 'As compras acontecem na web. Sem sobretaxa de loja de aplicações.',

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
      'Podes Gastar, mesmo no Início',
      'A tua linha do tempo até ao ordenado',
      'Fundos de poupança',
      'O teu mês, resumido',
      'Adiciona uma despesa em segundos',
    ],
    'screenshotGallery.webShots': ['Podes Gastar na web', 'O teu mês, em relatório'],

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
    'faq.items': [
      {
        question: 'Para quem é a Otterbond?',
        answer:
          'Para casais e pessoas que vivem juntas e querem planear e acompanhar o dinheiro em equipa, não apenas dividir contas depois de gastar. Também funciona bem para um grupo a orçamentar uma viagem em conjunto.',
      },
      {
        question: 'O que é o Podes Gastar?',
        answer:
          'É o único número que a Otterbond te mostra todas as manhãs: o que podes gastar hoje sem tocar nas tuas contas ou nas tuas poupanças. Atualiza-se automaticamente à medida que registas despesas e o ordenado se aproxima.',
      },
      {
        question: 'A Otterbond é gratuita?',
        answer:
          'Sim, o essencial da Otterbond, orçamento, contas e fundos de poupança, e o teu número diário Podes Gastar, é gratuito. O Plus é um plano pago opcional para quem quer o detalhe por trás desse número.',
      },
      {
        question: 'O que tem o Plus?',
        answer:
          'A linha do tempo, o ritmo e as informações por trás do teu número Podes Gastar, relatórios de mês completos e histórico, projeções dos objetivos de poupança, cinco espaços em vez de dois, e planeamento até 24 meses à frente.',
        link: { label: 'Ver preços', hash: '#pricing' },
      },
      {
        question: 'Posso partilhar um orçamento com outra pessoa?',
        answer:
          'Sim. Mantém um orçamento pessoal privado, ou partilha um com o teu parceiro, como Editor com acesso total ou como Visualizador com acesso só de leitura. Adiciona alguém como amigo uma vez, e depois convida-o para qualquer espaço, pessoal ou partilhado, quando fizer sentido. Os dois recebem notificações sobre despesas por categorizar, pedidos de amizade e convites para espaços, para que a coordenação não caia só em cima de um de vocês. O plano Grátis inclui 2 espaços, o Plus inclui 5.',
      },
      {
        question: 'Que moedas são suportadas?',
        answer:
          'Dez, incluindo EUR, USD, GBP, JPY e CHF, para que todos num espaço partilhado possam ver os saldos na moeda que realmente utilizam.',
      },
      {
        question: 'Preciso de uma palavra-passe?',
        answer: 'Não. Em vez disso, inicias sessão com um código único enviado para o teu email.',
      },
      {
        question: 'Os meus dados são vendidos ou usados para anúncios?',
        answer: 'Não. Não existe publicidade, venda de dados, nem qualquer tipo de rastreio por terceiros.',
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

    'footer.tagline': 'Um controlo de orçamento e poupanças partilhado e multi-moeda.',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.toolsHeading': 'Ferramentas gratuitas',
    'footer.toolsRecibosVerdes': 'Simulador recibos verdes',
    'footer.toolsSalarioLiquido': 'Calculadora salário líquido',
    'footer.toolsCompoundInterest': 'Calculadora de juros compostos',
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
