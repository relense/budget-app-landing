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
      'A shared budget for couples and people who live together. Plan the month together, log expenses as they happen, and split the work of categorizing. No ads, no data-selling.',

    'nav.features': 'Features',
    'nav.howItWorks': 'How it works',
    'nav.screens': 'Screens',
    'nav.faq': 'FAQ',
    'nav.getStarted': 'Get started',
    'nav.toggleMenu': 'Toggle menu',

    'hero.title': 'One budget. Actually shared.',
    'hero.subtitle':
      'Plan the month with your partner, log expenses as they happen, and let each other pick up the categorizing. Personal and shared workspaces, side by side.',
    'hero.cta': 'Get started',
    'hero.desktopAlt':
      "Otterbond home dashboard on the web, showing total balance, this month's spending, and an emergency fund goal",
    'hero.mobileAlt': 'Otterbond home screen on mobile in dark mode, showing recent activity and quick actions',
    'hero.scrollHint': 'See it in action',

    'trustStrip.text': 'No ads. No data-selling. No bank-sync creepiness.',

    'problem.text':
      "Most budgeting apps are built for one person. Your life isn't. Otterbond is built for the month to be seen, planned, and managed by both of you.",

    'howItWorks.heading': 'How it works',
    'howItWorks.steps': [
      {
        title: 'Plan the month together',
        body: 'Income, fixed and recurring expenses, all visible to both of you in the same space.',
      },
      {
        title: 'Log expenses as they happen',
        body: 'No waiting on the other person, no "how much did you spend at the supermarket?" texts.',
      },
      {
        title: 'Split the work, not just the bill',
        body: 'One partner logs it, the other categorizes later. No one has to do both, and nothing falls through the cracks.',
      },
      {
        title: 'Personal and shared, side by side',
        body: 'Keep a private budget, or share one with your partner, roommates, or a trip group.',
      },
    ],

    'featureGrid.heading': 'Built for two, not adapted for two',
    'featureGrid.cards': [
      {
        title: 'Personal and shared, together',
        body: 'Keep your own budget private, or share one with your partner, roommates, or a trip group, with as many people in it as you need. Everyone can belong to up to 4 workspaces for now.',
      },
      {
        title: 'Simple enough for someone who doesn’t care',
        body: 'Not a disguised spreadsheet or an accounting tool. Just add an expense, and you’re done.',
      },
      {
        title: 'Connect once',
        body: 'Add someone as a friend once, then invite them into any workspace, personal or shared, whenever it makes sense.',
      },
      {
        title: 'The app nudges, you don’t have to remember',
        body: 'Notifications for uncategorized expenses, friend requests, and workspace invites, so it doesn’t all fall on one of you.',
      },
    ],

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
      'Home, in dark mode',
      'Budget by category',
      'Add an expense in seconds',
      'All your expenses, in one place',
      'Recurring bills, tracked automatically',
      'Income, logged just as easily',
      'Savings funds',
    ],
    'screenshotGallery.webShots': [
      'Your balance and recent activity, at a glance',
      'Budgets, expenses, and recurring bills together',
      'Savings funds and goals',
    ],

    'getTheApp.heading': 'Already live on web and Android',
    'getTheApp.body':
      "Otterbond is free and working today, right in your browser or on Android. iOS is close behind: join the list below and we'll email you the moment it lands.",
    'getTheApp.platforms': [
      {
        label: 'Web app',
        status: 'Ready now',
        description: 'Works in any browser, nothing to install.',
        cta: 'Open web app',
      },
      {
        label: 'Android app',
        status: 'Ready now',
        description: 'Install the build straight from Expo.',
        cta: 'Get the app',
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
        question: 'Is Otterbond free?',
        answer:
          "Yes. It's currently free to use, with no paid tier. If that ever changes, we'll say so clearly before anything you rely on becomes paid.",
      },
      {
        question: 'Can I share a budget with someone else?',
        answer:
          'Yes. Keep a personal budget private, or share one with your partner, roommates, or a trip group, as an Editor with full access or a Viewer with read-only access, with as many people in it as you need. You can belong to up to 4 workspaces for now.',
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
          "The web app is in staging and the iOS and Android apps are still in progress. Join the waitlist and we'll email you the moment any of them are ready.",
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

    'waitlist.heading': 'iOS is almost here',
    'waitlist.body':
      "Leave your email and we'll let you know the moment Otterbond lands on the App Store. One email, no spam.",
    'waitlist.closingLine': 'Already on web or Android? You’re all set, this one’s just for iOS.',
    'waitlist.emailLabel': 'Email address',
    'waitlist.placeholder': 'you@example.com',
    'waitlist.submit': 'Notify me',
    'waitlist.joining': 'Adding you...',
    'waitlist.joined': "You're on the list",
    'waitlist.msg.invalidEmail': 'Enter a valid email address.',
    'waitlist.msg.notConnected': "Signups aren't connected yet, check back soon.",
    'waitlist.msg.success': "You're on the list. We'll email you the moment iOS is ready.",
    'waitlist.msg.alreadyOnList': "You're already on the list.",
    'waitlist.msg.tooMany': 'Too many attempts. Try again later.',
    'waitlist.msg.generic': 'Something went wrong. Try again in a moment.',

    'footer.tagline': 'A shared, multi-currency budget and savings tracker.',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
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
      'Um orçamento partilhado para casais e pessoas que vivem juntas. Planeiem o mês em conjunto, registem despesas à medida que acontecem, e dividam o trabalho de categorizar. Sem anúncios, sem venda de dados.',

    'nav.features': 'Funcionalidades',
    'nav.howItWorks': 'Como funciona',
    'nav.screens': 'Ecrãs',
    'nav.faq': 'FAQ',
    'nav.getStarted': 'Começar',
    'nav.toggleMenu': 'Alternar menu',

    'hero.title': 'Um orçamento. Verdadeiramente partilhado.',
    'hero.subtitle':
      'Planeia o mês com o teu parceiro, regista despesas à medida que acontecem, e ajudem-se um ao outro a categorizá-las. Espaços pessoais e partilhados, lado a lado.',
    'hero.cta': 'Começar',
    'hero.desktopAlt':
      'Painel principal da Otterbond na web, mostrando o saldo total, os gastos deste mês e um objetivo de fundo de emergência',
    'hero.mobileAlt': 'Ecrã principal da Otterbond no telemóvel em modo escuro, mostrando atividade recente e ações rápidas',
    'hero.scrollHint': 'Vê a app em ação',

    'trustStrip.text': 'Sem anúncios. Sem venda de dados. Sem sincronização bancária invasiva.',

    'problem.text':
      'A maioria das apps de orçamento é feita para uma pessoa. A tua vida não é. A Otterbond é feita para que o mês seja visto, planeado e gerido pelos dois.',

    'howItWorks.heading': 'Como funciona',
    'howItWorks.steps': [
      {
        title: 'Planeiem o mês em conjunto',
        body: 'Rendimentos, despesas fixas e recorrentes, tudo visível para os dois no mesmo espaço.',
      },
      {
        title: 'Regista despesas à medida que acontecem',
        body: 'Sem esperar pela outra pessoa, sem mensagens do tipo "quanto gastaste no supermercado?".',
      },
      {
        title: 'Dividam o trabalho, não só a conta',
        body: 'Um regista, o outro categoriza mais tarde. Ninguém tem de fazer as duas coisas, e nada fica esquecido.',
      },
      {
        title: 'Pessoal e partilhado, lado a lado',
        body: 'Mantém um orçamento privado, ou partilha um com o teu parceiro, colegas de casa, ou um grupo de viagem.',
      },
    ],

    'featureGrid.heading': 'Pensada para dois, não adaptada para dois',
    'featureGrid.cards': [
      {
        title: 'Pessoal e partilhado, juntos',
        body: 'Mantém o teu orçamento privado, ou partilha um com o teu parceiro, colegas de casa, ou um grupo de viagem, com quantas pessoas precisares. Podes pertencer a até 4 espaços, por agora.',
      },
      {
        title: 'Simples que chegue para quem não liga a isto',
        body: 'Não é uma folha de cálculo disfarçada nem uma ferramenta de contabilidade. Adicionas uma despesa, e está feito.',
      },
      {
        title: 'Liga-te uma vez',
        body: 'Adiciona alguém como amigo uma vez, e depois convida-o para qualquer espaço, pessoal ou partilhado, quando fizer sentido.',
      },
      {
        title: 'A app lembra-te, tu não precisas',
        body: 'Notificações para despesas por categorizar, pedidos de amizade e convites para espaços, para que a coordenação não caia só em cima de um de vocês.',
      },
    ],

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
      'Início, em modo escuro',
      'Orçamento por categoria',
      'Adiciona uma despesa em segundos',
      'Todas as despesas, num só lugar',
      'Despesas recorrentes, controladas automaticamente',
      'Rendimentos, registados com a mesma facilidade',
      'Fundos de poupança',
    ],
    'screenshotGallery.webShots': [
      'O teu saldo e atividade recente, num relance',
      'Orçamentos, despesas e recorrentes juntos',
      'Fundos de poupança e objetivos',
    ],

    'getTheApp.heading': 'Já disponível na web e Android',
    'getTheApp.body':
      'A Otterbond já é gratuita e funciona hoje, direto no teu navegador ou no Android. O iOS está quase a chegar: junta-te à lista abaixo e enviamos-te um email assim que estiver pronta.',
    'getTheApp.platforms': [
      {
        label: 'Aplicação web',
        status: 'Pronta a usar',
        description: 'Funciona em qualquer navegador, sem instalar nada.',
        cta: 'Abrir aplicação web',
      },
      {
        label: 'Aplicação Android',
        status: 'Pronta a usar',
        description: 'Instala a build diretamente a partir do Expo.',
        cta: 'Obter a aplicação',
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
        question: 'A Otterbond é gratuita?',
        answer:
          'Sim. Atualmente é gratuita, sem qualquer plano pago. Se isso alguma vez mudar, diremos isso claramente antes de algo que uses passar a ser pago.',
      },
      {
        question: 'Posso partilhar um orçamento com outra pessoa?',
        answer:
          'Sim. Mantém um orçamento pessoal privado, ou partilha um com o teu parceiro, colegas de casa, ou um grupo de viagem, como Editor com acesso total ou como Visualizador com acesso só de leitura, com quantas pessoas precisares. Podes pertencer a até 4 espaços, por agora.',
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
          'A aplicação web está em staging e as aplicações iOS e Android ainda estão em desenvolvimento. Junta-te à lista de espera e enviamos-te um email assim que alguma delas estiver pronta.',
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

    'waitlist.heading': 'O iOS está quase a chegar',
    'waitlist.body':
      'Deixa o teu email e avisamos-te assim que a Otterbond chegar à App Store. Um único email, sem spam.',
    'waitlist.closingLine': 'Já usas a versão web ou Android? Está tudo certo, isto é só para o iOS.',
    'waitlist.emailLabel': 'Endereço de email',
    'waitlist.placeholder': 'tu@example.com',
    'waitlist.submit': 'Avisa-me',
    'waitlist.joining': 'A adicionar-te...',
    'waitlist.joined': 'Já estás na lista',
    'waitlist.msg.invalidEmail': 'Introduz um endereço de email válido.',
    'waitlist.msg.notConnected': 'As inscrições ainda não estão ligadas, volta a verificar em breve.',
    'waitlist.msg.success': 'Já estás na lista. Enviamos-te um email assim que o iOS estiver pronto.',
    'waitlist.msg.alreadyOnList': 'Já estás na lista.',
    'waitlist.msg.tooMany': 'Demasiadas tentativas. Tenta novamente mais tarde.',
    'waitlist.msg.generic': 'Algo correu mal. Tenta novamente dentro de momentos.',

    'footer.tagline': 'Um controlo de orçamento e poupanças partilhado e multi-moeda.',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
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
