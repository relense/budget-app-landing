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
    'meta.title': 'Arwen: a shared budget and savings tracker',
    'meta.description':
      'A multi-currency budget and savings tracker you can share with your household. No ads, no data-selling, no bank-sync creepiness.',

    'nav.features': 'Features',
    'nav.howItWorks': 'How it works',
    'nav.screens': 'Screens',
    'nav.faq': 'FAQ',
    'nav.joinWaitlist': 'Join the waitlist',
    'nav.toggleMenu': 'Toggle menu',

    'hero.title': 'One budget. Actually shared.',
    'hero.subtitle':
      'Log expenses, track recurring bills, and grow savings funds with the people you trust, in any of 10 currencies.',
    'hero.cta': 'Join the waitlist',
    'hero.desktopAlt':
      "Arwen home dashboard on the web, showing total balance, this month's spending, and an emergency fund goal",
    'hero.mobileAlt': 'Arwen home screen on mobile in dark mode, showing recent activity and quick actions',

    'trustStrip.text': 'No ads. No data-selling. No bank-sync creepiness.',

    'howItWorks.heading': 'How it works',
    'howItWorks.steps': [
      { title: 'Set the budget', body: 'Create categories and set a monthly budget for each one.' },
      {
        title: 'Log expenses',
        body: 'Add them as they happen, or let recurring bills track themselves.',
      },
      {
        title: 'Watch your balance',
        body: "See what's left this month, updated the moment you add something.",
      },
      {
        title: 'Grow your savings',
        body: 'Set a goal and build dedicated funds alongside your monthly budget.',
      },
    ],

    'featureGrid.heading': 'Everything a shared budget actually needs',
    'featureGrid.cards': [
      {
        title: 'Budget by category',
        body: "Set a monthly budget for each category, and watch what's left update as you spend.",
      },
      {
        title: 'Shared workspaces',
        body: 'Invite people you trust as an Editor with full access, or a read-only Viewer.',
      },
      { title: 'Friends', body: 'Connect once, then invite them into any workspace.' },
      {
        title: 'Plan ahead',
        body: "Lock a month once it's settled, and plan your budget up to 24 months ahead.",
      },
    ],

    'screenshotGallery.heading': "See it, don't just take our word for it",
    'screenshotGallery.altPrefix': 'Arwen mobile screenshot',
    'screenshotGallery.shots': [
      'Home, in dark mode',
      'Budget by category',
      'Savings funds',
      'Currency settings',
    ],

    'portfolioNote.heading': 'Built like a real product',
    'portfolioNote.body':
      'Test-driven development and a proper three-repo architecture, not a weekend prototype. This is a solo portfolio project, engineered the way a team would ship it.',
    'portfolioNote.stats': [
      { value: '1,800+', label: 'Commits across three repos' },
      { value: '1,000+', label: 'Backend tests' },
      { value: '3', label: 'Independent repos: API, web, mobile' },
      { value: 'GraphQL', label: 'Fully typed API layer' },
    ],

    'getTheApp.heading': 'Web, iOS, and Android are all in progress',
    'getTheApp.body':
      "Nothing is public yet: the web app is still in staging and the mobile apps haven't shipped. Join the waitlist below and we'll email you the moment any of them are ready.",
    'getTheApp.platforms': [
      { label: 'Web app', status: 'In staging' },
      { label: 'iOS app', status: 'Coming soon' },
      { label: 'Android app', status: 'Coming soon' },
    ],

    'faq.heading': 'Frequently asked questions',
    'faq.items': [
      {
        question: 'Is Arwen free?',
        answer:
          "Yes. It's currently free to use, with no paid tier. If that ever changes, we'll say so clearly before anything you rely on becomes paid.",
      },
      {
        question: 'Can I share a budget with someone else?',
        answer:
          'Yes. Invite people you trust into a shared workspace, as an Editor with full access or a Viewer with read-only access.',
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

    'waitlist.heading': "Get notified when it's ready",
    'waitlist.body':
      "Leave your email and we'll let you know the moment web, iOS, or Android launches. One email, no spam.",
    'waitlist.emailLabel': 'Email address',
    'waitlist.placeholder': 'you@example.com',
    'waitlist.submit': 'Join the waitlist',
    'waitlist.joining': 'Joining...',
    'waitlist.msg.invalidEmail': 'Enter a valid email address.',
    'waitlist.msg.notConnected': "Signups aren't connected yet, check back soon.",
    'waitlist.msg.success': "You're on the list. We'll email you when it's ready.",
    'waitlist.msg.alreadyOnList': "You're already on the list.",
    'waitlist.msg.tooMany': 'Too many attempts. Try again later.',
    'waitlist.msg.generic': 'Something went wrong. Try again in a moment.',

    'footer.tagline': 'A shared, multi-currency budget and savings tracker.',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.madeBy': 'Made by relense',

    'notFound.title': 'Page not found, Arwen',
    'notFound.description': "This page doesn't exist.",
    'notFound.heading': 'Page not found',
    'notFound.body': "The page you're looking for doesn't exist, or the link is out of date.",
    'notFound.cta': 'Back home',

    'legal.lastUpdated': 'Last updated',
    'privacyPage.title': 'Privacy Policy, Arwen',
    'privacyPage.description': 'How Arwen collects, uses, and protects your data.',
    'privacyPage.heading': 'Privacy Policy',
    'termsPage.title': 'Terms of Service, Arwen',
    'termsPage.description': 'The terms that govern your use of Arwen.',
    'termsPage.heading': 'Terms of Service',
  },
  'pt-pt': {
    'meta.title': 'Arwen: um orçamento e poupanças partilhados',
    'meta.description':
      'Um controlo de orçamento e poupanças multi-moeda que podes partilhar com a tua casa. Sem anúncios, sem venda de dados, sem sincronização bancária invasiva.',

    'nav.features': 'Funcionalidades',
    'nav.howItWorks': 'Como funciona',
    'nav.screens': 'Ecrãs',
    'nav.faq': 'FAQ',
    'nav.joinWaitlist': 'Junta-te à lista de espera',
    'nav.toggleMenu': 'Alternar menu',

    'hero.title': 'Um orçamento. Verdadeiramente partilhado.',
    'hero.subtitle':
      'Regista despesas, acompanha contas recorrentes e faz crescer fundos de poupança com as pessoas em quem confias, em qualquer uma de 10 moedas.',
    'hero.cta': 'Junta-te à lista de espera',
    'hero.desktopAlt':
      'Painel principal da Arwen na web, mostrando o saldo total, os gastos deste mês e um objetivo de fundo de emergência',
    'hero.mobileAlt': 'Ecrã principal da Arwen no telemóvel em modo escuro, mostrando atividade recente e ações rápidas',

    'trustStrip.text': 'Sem anúncios. Sem venda de dados. Sem sincronização bancária invasiva.',

    'howItWorks.heading': 'Como funciona',
    'howItWorks.steps': [
      { title: 'Define o orçamento', body: 'Cria categorias e define um orçamento mensal para cada uma.' },
      {
        title: 'Regista despesas',
        body: 'Adiciona-as à medida que acontecem, ou deixa que as contas recorrentes se registem sozinhas.',
      },
      {
        title: 'Acompanha o teu saldo',
        body: 'Vê o que resta este mês, atualizado no momento em que adicionas algo.',
      },
      {
        title: 'Faz crescer as tuas poupanças',
        body: 'Define um objetivo e cria fundos dedicados a par do teu orçamento mensal.',
      },
    ],

    'featureGrid.heading': 'Tudo o que um orçamento partilhado realmente precisa',
    'featureGrid.cards': [
      {
        title: 'Orçamento por categoria',
        body: 'Define um orçamento mensal para cada categoria, e vê o que resta a atualizar-se à medida que gastas.',
      },
      {
        title: 'Espaços partilhados',
        body: 'Convida pessoas em quem confias como Editor com acesso total, ou como Visualizador só de leitura.',
      },
      { title: 'Amigos', body: 'Liga-te uma vez e depois convida-os para qualquer espaço.' },
      {
        title: 'Planeia com antecedência',
        body: 'Bloqueia um mês assim que estiver fechado, e planeia o teu orçamento até 24 meses à frente.',
      },
    ],

    'screenshotGallery.heading': 'Vê por ti mesmo, não fiques só pela nossa palavra',
    'screenshotGallery.altPrefix': 'Captura de ecrã da Arwen no telemóvel',
    'screenshotGallery.shots': [
      'Início, em modo escuro',
      'Orçamento por categoria',
      'Fundos de poupança',
      'Definições de moeda',
    ],

    'portfolioNote.heading': 'Construído como um produto a sério',
    'portfolioNote.body':
      'Desenvolvimento orientado a testes e uma arquitetura a sério com três repositórios, não um protótipo de fim de semana. Este é um projeto de portefólio a solo, construído da forma como uma equipa o lançaria.',
    'portfolioNote.stats': [
      { value: '1,800+', label: 'Commits em três repositórios' },
      { value: '1,000+', label: 'Testes de backend' },
      { value: '3', label: 'Repositórios independentes: API, web, mobile' },
      { value: 'GraphQL', label: 'Camada de API totalmente tipada' },
    ],

    'getTheApp.heading': 'Web, iOS e Android estão todos em desenvolvimento',
    'getTheApp.body':
      'Nada está ainda público: a aplicação web está em staging e as aplicações móveis ainda não foram lançadas. Junta-te à lista de espera abaixo e enviamos-te um email assim que alguma delas estiver pronta.',
    'getTheApp.platforms': [
      { label: 'Aplicação web', status: 'Em staging' },
      { label: 'Aplicação iOS', status: 'Brevemente' },
      { label: 'Aplicação Android', status: 'Brevemente' },
    ],

    'faq.heading': 'Perguntas frequentes',
    'faq.items': [
      {
        question: 'A Arwen é gratuita?',
        answer:
          'Sim. Atualmente é gratuita, sem qualquer plano pago. Se isso alguma vez mudar, diremos isso claramente antes de algo que uses passar a ser pago.',
      },
      {
        question: 'Posso partilhar um orçamento com outra pessoa?',
        answer:
          'Sim. Convida pessoas em quem confias para um espaço partilhado, como Editor com acesso total ou como Visualizador com acesso só de leitura.',
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

    'waitlist.heading': 'Recebe uma notificação quando estiver pronta',
    'waitlist.body':
      'Deixa o teu email e avisamos-te assim que a versão web, iOS ou Android for lançada. Um único email, sem spam.',
    'waitlist.emailLabel': 'Endereço de email',
    'waitlist.placeholder': 'tu@example.com',
    'waitlist.submit': 'Junta-te à lista de espera',
    'waitlist.joining': 'A juntar-te...',
    'waitlist.msg.invalidEmail': 'Introduz um endereço de email válido.',
    'waitlist.msg.notConnected': 'As inscrições ainda não estão ligadas, volta a verificar em breve.',
    'waitlist.msg.success': 'Já estás na lista. Enviamos-te um email quando estiver pronta.',
    'waitlist.msg.alreadyOnList': 'Já estás na lista.',
    'waitlist.msg.tooMany': 'Demasiadas tentativas. Tenta novamente mais tarde.',
    'waitlist.msg.generic': 'Algo correu mal. Tenta novamente dentro de momentos.',

    'footer.tagline': 'Um controlo de orçamento e poupanças partilhado e multi-moeda.',
    'footer.legalHeading': 'Legal',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.madeBy': 'Feito por relense',

    'notFound.title': 'Página não encontrada, Arwen',
    'notFound.description': 'Esta página não existe.',
    'notFound.heading': 'Página não encontrada',
    'notFound.body': 'A página que procuras não existe, ou a hiperligação está desatualizada.',
    'notFound.cta': 'Voltar ao início',

    'legal.lastUpdated': 'Última atualização',
    'privacyPage.title': 'Política de Privacidade, Arwen',
    'privacyPage.description': 'Como a Arwen recolhe, utiliza e protege os teus dados.',
    'privacyPage.heading': 'Política de Privacidade',
    'termsPage.title': 'Termos de Serviço, Arwen',
    'termsPage.description': 'Os termos que regem a tua utilização da Arwen.',
    'termsPage.heading': 'Termos de Serviço',
  },
} as const;

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)['en'];
