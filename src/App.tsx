import React, { useState } from 'react';
import { Book, Baby, Utensils, Moon, Heart, Stethoscope, Shield, Users, Clock, ChevronRight, Menu, X } from 'lucide-react';

interface LinkButtonProps {
  themeId: string;
  text: string;
}

interface Section {
  title: string;
  content: string;
  links: string[];
  subtitle?: string;
  text?: string;
}

interface AgeContent {
  [key: string]: {
    title: string;
    sections: Section[];
  };
}

interface ThemeContent {
  [key: string]: {
    name: string;
    title?: string;
    icon?: React.FC<{ className?: string }>;
    sections?: Section[];
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'age' | 'theme' | 'about' | 'contact'>('home');
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ages = [
    { id: 'newborn', name: 'Recém-Nascido', subtitle: '0-28 dias', color: 'bg-pink-100' },
    { id: 'baby1-6', name: 'Bebê', subtitle: '1-6 meses', color: 'bg-rose-100' },
    { id: 'baby7-12', name: 'Bebê', subtitle: '7-12 meses', color: 'bg-amber-100' },
    { id: 'toddler', name: 'Criança', subtitle: '13-24 meses', color: 'bg-orange-100' }
  ];

  const themes = [
    { id: 'amamentacao', name: 'Amamentação', icon: Heart, color: 'text-rose-600' },
    { id: 'alimentacao', name: 'Introdução Alimentar', icon: Utensils, color: 'text-amber-600' },
    { id: 'sono', name: 'Sono', icon: Moon, color: 'text-indigo-600' },
    { id: 'desenvolvimento', name: 'Desenvolvimento', icon: Baby, color: 'text-pink-600' },
    { id: 'vacinas', name: 'Vacinas', icon: Shield, color: 'text-teal-600' },
    { id: 'saude', name: 'Saúde e Doenças', icon: Stethoscope, color: 'text-red-600' },
    { id: 'pais', name: 'Cuidando dos Pais', icon: Users, color: 'text-purple-600' }
  ];

  const ageContent: AgeContent = {
    'newborn': {
      title: 'Recém-Nascido (0-28 dias)',
      sections: [
        {
          title: 'Alimentação',
          content: 'Nesta fase, o bebê deve ser alimentado exclusivamente com leite materno ou fórmula. A amamentação em livre demanda é recomendada, geralmente a cada 2-3 horas.',
          links: ['amamentacao', 'alimentacao']
        },
        {
          title: 'Sono',
          content: 'Recém-nascidos dormem de 16-18 horas por dia, em ciclos curtos. É normal que não diferenciem dia e noite ainda. O ambiente seguro de sono é fundamental para prevenir a SMSL.',
          links: ['sono']
        },
        {
          title: 'Desenvolvimento',
          content: 'O bebê responde a sons altos, foca objetos a 20-30 cm de distância e apresenta reflexos primitivos como sucção e preensão palmar.',
          links: ['desenvolvimento']
        }
      ]
    },
    'baby1-6': {
      title: 'Bebê (1-6 meses)',
      sections: [
        {
          title: 'Alimentação',
          content: 'Continua com aleitamento exclusivo até os 6 meses. Aos 5-6 meses, observe os sinais de prontidão para introdução alimentar: sentar com apoio, levar objetos à boca, interesse pela comida.',
          links: ['amamentacao', 'alimentacao']
        },
        {
          title: 'Sono',
          content: 'Padrão de sono começa a se consolidar. Por volta dos 4 meses, pode ocorrer a regressão de sono, relacionada a um importante salto de desenvolvimento.',
          links: ['sono', 'desenvolvimento']
        },
        {
          title: 'Desenvolvimento',
          content: 'Sorriso social (2 meses), sustenta a cabeça (3 meses), rola (4-5 meses), inicia sons vocálicos e pode começar a sentar com apoio (6 meses).',
          links: ['desenvolvimento']
        }
      ]
    },
    'baby7-12': {
      title: 'Bebê (7-12 meses)',
      sections: [
        {
          title: 'Alimentação',
          content: 'Introdução alimentar em pleno vigor. Ofereça variedade de grupos alimentares, atenção aos cortes seguros e sinais de alergias alimentares.',
          links: ['alimentacao', 'saude']
        },
        {
          title: 'Sono',
          content: 'Geralmente 2 sonecas diurnas. Pode ocorrer regressão de sono aos 8 meses devido à ansiedade da separação. Mantenha rituais consistentes.',
          links: ['sono', 'desenvolvimento']
        },
        {
          title: 'Desenvolvimento',
          content: 'Senta sem apoio (7-8 meses), engatinha (8-10 meses), fica em pé com apoio (9-11 meses), primeiras palavras e permanência do objeto.',
          links: ['desenvolvimento']
        }
      ]
    },
    'toddler': {
      title: 'Criança (13-24 meses)',
      sections: [
        {
          title: 'Alimentação',
          content: 'Transição para comida da família. Pode apresentar seletividade alimentar ("picky eater"). Mantenha ambiente tranquilo e ofereça variedade sem pressão.',
          links: ['alimentacao']
        },
        {
          title: 'Sono',
          content: 'Transição para 1 soneca diurna. Possível regressão aos 18 meses. Autonomia crescente pode gerar resistência ao sono.',
          links: ['sono']
        },
        {
          title: 'Desenvolvimento',
          content: 'Primeiros passos (12-15 meses), explosão de linguagem, brincadeiras simbólicas, fase de birras e descoberta da autonomia.',
          links: ['desenvolvimento']
        }
      ]
    }
  };

  const themeContent: ThemeContent = {
    amamentacao: {
      name: 'Amamentação', title: 'Amamentação',
      sections: [
        { title: '', content: '', links: [], subtitle: 'O Início da Amamentação', text: 'O leite materno é o alimento mais completo para o bebê. Nos primeiros dias, o seio produz o colostro — rico em anticorpos. Inicie a amamentação na primeira hora de vida sempre que possível.' },
        { title: '', content: '', links: [], subtitle: 'Pega e Posicionamento', text: 'Uma boa pega evita dores e garante leite suficiente. O bebê deve abocanhar a aréola, não só o bico. Os lábios ficam virados para fora e o queixo toca o seio. O corpo do bebê deve estar alinhado e voltado para a mãe.' },
        { title: '', content: '', links: [], subtitle: 'Frequência e Duração', text: 'Nos primeiros meses, amamente em livre demanda: 8 a 12 vezes ao dia, a cada 2-3 horas. Deixe o bebê esvaziar um seio antes de oferecer o outro. Sinais de fome: levar as mãos à boca, fazer movimentos de sucção, agitação.' },
        { title: '', content: '', links: [], subtitle: 'Desafios Comuns', text: 'Ingurgitamento, mastite e mamilos doloridos são frequentes. Na maioria dos casos, corrigir a pega resolve as dores. Para ingurgitamento, amamente com frequência. Em caso de mastite (seio vermelho, duro e febre), consulte um médico.' },
        { title: '', content: '', links: [], subtitle: 'Por Quanto Tempo?', text: 'A OMS recomenda amamentação exclusiva até os 6 meses e complementar até os 2 anos ou mais. O desmame natural ocorre quando mãe e bebê estão prontos. Qualquer período de amamentação já traz benefícios importantes.' },
      ]
    },
    alimentacao: {
      name: 'Introdução Alimentar', title: 'Introdução Alimentar',
      sections: [
        { title: '', content: '', links: [], subtitle: 'Quando Começar', text: 'A introdução alimentar começa aos 6 meses completos, com sinais de prontidão: sentar com apoio, interesse pela comida dos adultos e ausência do reflexo de extrusão (não empurra a comida com a língua). Não inicie antes dos 4 meses.' },
        { title: '', content: '', links: [], subtitle: 'Primeiros Alimentos', text: 'Ofereça variedade desde o início: cereais (arroz, macarrão), leguminosas (feijão, lentilha), carnes (frango, boi, peixe), legumes (batata, cenoura, abobrinha) e frutas. Base: comida da família adaptada em textura.' },
        { title: '', content: '', links: [], subtitle: 'BLW e Papinha Tradicional', text: 'No BLW, o bebê come pedaços macios sozinho, desenvolvendo autonomia. Na papinha, começa com purês e avança para pedaços. Ambos são válidos — muitas famílias combinam os dois métodos.' },
        { title: '', content: '', links: [], subtitle: 'Alimentos a Evitar até 2 anos', text: 'Evite: açúcar, mel (risco de botulismo), sal em excesso, refrigerantes, sucos industrializados e ultraprocessados. Leite de vaca como bebida principal deve ser evitado até 1 ano.' },
        { title: '', content: '', links: [], subtitle: 'Alergias Alimentares', text: 'Introduza alimentos alergênicos (ovo, amendoim, peixe, trigo, soja) um por vez com dias de intervalo. Sinais de alergia: urticária, vômitos, diarreia, inchaço. Reação grave (dificuldade de respirar): acione o SAMU (192) imediatamente.' },
      ]
    },
    sono: {
      name: 'Sono', title: 'Sono',
      sections: [
        { title: '', content: '', links: [], subtitle: 'Como é o Sono do Bebê', text: 'Os ciclos de sono do bebê duram ~45 min (vs. 90 min do adulto), com mais tempo em sono leve. Por isso acordam facilmente entre ciclos. Até os 4-6 meses, acordar para mamar à noite é fisiologicamente normal.' },
        { title: '', content: '', links: [], subtitle: 'Ambiente Seguro para Dormir', text: 'Para prevenir a SMSL: coloque o bebê de costas em superfície firme, sem travesseiros, almofadas ou edredons. Temperatura ideal do quarto: 18-22°C. O cobicho pode ser usado sem cobertura sobre a cabeça.' },
        { title: '', content: '', links: [], subtitle: 'Rotinas de Sono', text: 'Uma rotina previsível ajuda o bebê a entender que é hora de dormir: banho, massagem, amamentação, leitura e música calma. A consistência importa mais que a sequência. A partir dos 3-4 meses já é possível estabelecer uma rotina noturna.' },
        { title: '', content: '', links: [], subtitle: 'Regressões de Sono', text: 'Regressões são períodos de piora do sono associados a saltos de desenvolvimento. As mais comuns: 4 meses (mais intensa), 8-10 meses, 12 meses e 18 meses. São temporárias (2-6 semanas). Manter a rotina e oferecer mais acolhimento ajuda.' },
        { title: '', content: '', links: [], subtitle: 'Sonecas Diurnas', text: 'Recém-nascidos dormem 4-5 vezes ao dia; aos 6 meses, 2-3 sonecas; aos 12-18 meses, 1-2 sonecas. A última soneca deve terminar ao menos 2h antes de dormir à noite. Por volta dos 2-3 anos a maioria abandona as sonecas naturalmente.' },
      ]
    },
    desenvolvimento: {
      name: 'Desenvolvimento', title: 'Desenvolvimento',
      sections: [
        { title: '', content: '', links: [], subtitle: '0 a 3 meses', text: 'Reflexo de Moro (susto com sons altos), reconhece a voz dos pais, foca objetos a 20-30 cm, sorriso social por volta de 6-8 semanas, arrulhos e sustentação breve da cabeça de bruços.' },
        { title: '', content: '', links: [], subtitle: '4 a 6 meses', text: 'Sustenta bem a cabeça, rola (4-5 meses), ri alto, reconhece rostos familiares, alcança e segura objetos, leva tudo à boca, começa a sentar com apoio.' },
        { title: '', content: '', links: [], subtitle: '7 a 12 meses', text: 'Senta sem apoio (7-8 meses), engatinha (8-10 meses), fica em pé com apoio (9-11 meses), imita sons e gestos, entende "não", faz pinça, primeiros passos (10-14 meses).' },
        { title: '', content: '', links: [], subtitle: '13 a 24 meses', text: 'Anda com segurança (15-18 meses), aponta para o que quer, fala 10-50 palavras aos 18 meses, combina duas palavras aos 24 meses, brincadeiras de faz-de-conta e fase das birras.' },
        { title: '', content: '', links: [], subtitle: 'Sinais de Atenção', text: 'Consulte o pediatra se: sem sorriso social até 3 meses, sem sons até 6 meses, não senta até 9 meses, não anda até 18 meses, perde habilidades já adquiridas ou não faz contato visual. A identificação precoce é fundamental.' },
      ]
    },
    vacinas: {
      name: 'Vacinas', title: 'Vacinas',
      sections: [
        { title: '', content: '', links: [], subtitle: 'Por que Vacinar?', text: 'As vacinas protegem contra doenças graves que podem causar sequelas permanentes ou ser fatais. A vacinação em massa cria imunidade de rebanho, protegendo também quem não pode ser vacinado.' },
        { title: '', content: '', links: [], subtitle: 'Calendário SUS (0-24 meses)', text: 'Ao nascer: BCG e Hepatite B. 2 meses: Pentavalente, VIP, Pneumocócica 10v, Rotavírus. 3 meses: Meningocócica C. 4 meses: Pentavalente, VIP, Pneumocócica, Rotavírus. 6 meses: Pentavalente, VIP, Influenza. 9 meses: Febre Amarela. 12 meses: Tríplice Viral, Pneumocócica (reforço). 15 meses: DTP, VOP, Meningocócica C (reforços), Varicela.' },
        { title: '', content: '', links: [], subtitle: 'Cuidados Antes e Depois', text: 'Antes: o bebê não precisa de jejum; verifique se não tem febre (contraindicação temporária). Depois: mantenha o local limpo e seco. Em injetáveis, massageie levemente o local. Observe o bebê nas horas seguintes.' },
        { title: '', content: '', links: [], subtitle: 'Reações Esperadas', text: 'Reações leves passam em 1-3 dias: dor, vermelhidão e inchaço no local, febre baixa (até 38°C), irritabilidade e sonolência. Para o desconforto: compressa fria e antitérmico na dose indicada pelo pediatra.' },
        { title: '', content: '', links: [], subtitle: 'Quando Procurar Ajuda', text: 'Procure atendimento se: febre acima de 39°C, choro inconsolável por mais de 3h, convulsões, dificuldade para respirar ou reação alérgica grave (inchaço no rosto, urticária generalizada). Reações graves são raríssimas.' },
      ]
    },
    saude: {
      name: 'Saúde e Doenças Comuns', title: 'Saúde e Doenças Comuns',
      sections: [
        { title: '', content: '', links: [], subtitle: 'Febre: O que Fazer', text: 'Febre é temperatura acima de 37,8°C axilar. Em bebês até 3 meses, qualquer febre exige atendimento imediato. Em maiores de 3 meses, abaixo de 38,5°C geralmente não precisa de medicação — mantenha hidratação. Nunca use AAS (Aspirina) em crianças.' },
        { title: '', content: '', links: [], subtitle: 'Cólicas e Gases', text: 'Afetam ~20% dos bebês, com choro intenso geralmente à tarde/noite. Melhora após 3-4 meses. Ajuda: "posição do aviãozinho" (barriga para baixo no colo), massagem abdominal em sentido horário e calor moderado na barriga.' },
        { title: '', content: '', links: [], subtitle: 'Refluxo', text: 'Regurgitar é normal — o esfíncter esofágico ainda é imaturo. Torna-se patológico quando há choro intenso, recusa ao peito, arqueamento do corpo, tosse crônica ou ganho de peso insatisfatório. Nesses casos, consulte o pediatra.' },
        { title: '', content: '', links: [], subtitle: 'Resfriados e Gripes', text: 'Bebês podem ter 8-10 resfriados por ano. Alívio: soro fisiológico nasal, umidificador e hidratação. Não use descongestionantes ou xaropes sem prescrição. Em menores de 2 meses com febre ou dificuldade respiratória, vá ao pronto-socorro.' },
        { title: '', content: '', links: [], subtitle: 'Quando Ir ao Médico Imediatamente', text: 'Urgência: qualquer febre em menores de 3 meses, dificuldade respiratória, lábios azulados, convulsão, sonolência extrema, recusa total de alimento por 8h+, vômitos em jato repetidos, fezes com sangue ou sinais de desidratação.' },
      ]
    },
    pais: {
      name: 'Cuidando dos Pais', title: 'Cuidando dos Pais',
      sections: [
        { title: '', content: '', links: [], subtitle: 'O Impacto Emocional da Parentalidade', text: 'Ser pai ou mãe é uma das experiências mais transformadoras e exigentes da vida. Sentir exaustão, sobrecarga, culpa e ansiedade é completamente normal. Esses sentimentos não fazem de você um mau pai ou mãe — eles fazem de você humano.' },
        { title: '', content: '', links: [], subtitle: 'Baby Blues e Depressão Pós-Parto', text: 'O baby blues afeta até 80% das mães nos primeiros dias (choro, tristeza, irritabilidade) e passa em até 2 semanas. A depressão pós-parto é mais intensa e duradoura: tristeza profunda, desinteresse pelo bebê e insônia. É tratável — busque ajuda sem hesitar.' },
        { title: '', content: '', links: [], subtitle: 'A Importância do Sono para os Pais', text: 'A privação de sono impacta diretamente a saúde mental. Estratégias: turno noturno (um pai por vez), durma quando o bebê dorme, aceite ajuda de familiares, priorize o sono sobre tarefas domésticas. Não dirija com sonolência extrema.' },
        { title: '', content: '', links: [], subtitle: 'Divisão de Tarefas e Rede de Apoio', text: 'Ambos os cuidadores são capazes de cuidar do bebê. Divida tarefas para evitar sobrecarga. Aceite ajuda e seja específico: "pode ficar com o bebê 2 horas enquanto descanso?". Uma rede de apoio sólida é fundamental para o bem-estar de todos.' },
        { title: '', content: '', links: [], subtitle: 'Autocuidado Não é Luxo', text: 'Você cuida melhor do seu filho quando está bem. Reserve momentos para você, mantenha consultas médicas em dia e peça apoio psicológico se necessário. Seu pediatra pode indicar profissionais de saúde mental especializados em pós-parto.' },
      ]
    },
  };

  const LinkButton: React.FC<LinkButtonProps> = ({ themeId, text }) => (
    <button
      onClick={() => {
        setCurrentView('theme');
        setSelectedTheme(themeId);
        window.scrollTo(0, 0);
      }}
      className="inline-flex items-center text-sm text-rose-600 hover:text-rose-800 font-medium underline"
    >
      {text} <ChevronRight className="w-4 h-4 ml-1" />
    </button>
  );

  const renderHome = () => (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center py-12 px-4">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
          <Heart className="w-16 h-16 text-rose-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao Projeto Aninhar</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Um ambiente acolhedor de informações para você cuidar do seu bebê com segurança e amor.
          Navegue por idade ou por tema para encontrar o que precisa.
        </p>
      </div>

      {/* Navigation by Age */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <Clock className="w-8 h-8 mr-3 text-rose-400" />
          Navegue por Idade
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            {ages.map(age => (
              <button
                key={age.id}
                onClick={() => {
                  setCurrentView('age');
                  setSelectedAge(age.id);
                  window.scrollTo(0, 0);
                }}
                className={`${age.color} p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 aspect-square flex flex-col items-center justify-center`}
              >
                <Baby className="w-16 h-16 mb-4 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-800 mb-1">{age.name}</h3>
                <p className="text-gray-600 text-sm">{age.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation by Theme */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <Book className="w-8 h-8 mr-3 text-rose-400" />
          Navegue por Tema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map(theme => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setCurrentView('theme');
                  setSelectedTheme(theme.id);
                  window.scrollTo(0, 0);
                }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-rose-200 transform hover:-translate-y-1"
              >
                <Icon className={`w-12 h-12 mx-auto mb-4 ${theme.color}`} />
                <h3 className="text-lg font-bold text-gray-800">{theme.name}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAgeView = () => {
    const content = selectedAge ? ageContent[selectedAge] : undefined;

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className="mb-6 flex items-center text-rose-600 hover:text-rose-800 font-medium"
        >
          <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
          Voltar para início
        </button>

        <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-3xl mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{content?.title}</h1>
          <p className="text-gray-600">Informações essenciais para esta fase</p>
        </div>

        <div className="space-y-8">
          {content?.sections.map((section, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
              <div className="flex flex-wrap gap-3">
                {section.links.map((linkId: string, linkIdx: number) => (
                  <LinkButton
                    key={linkIdx}
                    themeId={linkId}
                    text={`Saiba mais: ${themeContent[linkId]?.name || 'Desconhecido'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderThemeView = () => {
    const content = selectedTheme ? themeContent[selectedTheme] : undefined;
    const Icon = content?.icon;

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className="mb-6 flex items-center text-rose-600 hover:text-rose-800 font-medium"
        >
          <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
          Voltar para início
        </button>

        <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-3xl mb-8 text-center">
          {Icon && <Icon className="w-16 h-16 mx-auto mb-4 text-rose-400" />}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{content?.title}</h1>
          <p className="text-gray-600">Guia completo sobre o tema</p>
        </div>

        <div className="space-y-6">
          {content?.sections && content.sections.length > 0 && content.sections.map((section, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{section.subtitle}</h3>
              <p className="text-gray-700 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-rose-50 p-6 rounded-2xl border-2 border-rose-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Navegue por idade</h3>
          <p className="text-gray-600 mb-4">Veja como este tema se aplica em cada fase:</p>
          <div className="flex flex-wrap gap-3">
            {ages.map(age => (
              <button
                key={age.id}
                onClick={() => {
                  setCurrentView('age');
                  setSelectedAge(age.id);
                  window.scrollTo(0, 0);
                }}
                className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-sm font-medium text-gray-700 border-2 border-gray-100 hover:border-rose-200"
              >
                {age.name} ({age.subtitle})
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const navTo = (view: 'home' | 'age' | 'theme' | 'about' | 'contact') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderAbout = () => (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navTo('home')} className="mb-6 flex items-center text-rose-600 hover:text-rose-800 font-medium">
        <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" /> Voltar para início
      </button>
      <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-3xl mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sobre o Projeto Aninhar</h1>
        <p className="text-gray-600">Um ambiente acolhedor de informação para famílias</p>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">O que é o Aninhar?</h2>
          <p className="text-gray-700 leading-relaxed">O Projeto Aninhar é um ambiente virtual de informações para pais, mães e cuidadores de crianças de 0 a 24 meses. Aqui você encontra conteúdo organizado por faixa etária e por temas, tornando mais fácil navegar pelos desafios e descobertas dos primeiros dois anos de vida.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Nossa Missão</h2>
          <p className="text-gray-700 leading-relaxed">Oferecer informações baseadas em evidências de forma acessível e acolhedora, ajudando famílias a cuidar de seus bebês com mais segurança, confiança e tranquilidade.</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Aviso Importante</h2>
          <p className="text-gray-700 leading-relaxed">As informações do Aninhar têm caráter educativo e não substituem a avaliação de um profissional de saúde. Sempre consulte seu pediatra, médico ou outro profissional qualificado para orientações específicas sobre a saúde do seu filho.</p>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navTo('home')} className="mb-6 flex items-center text-rose-600 hover:text-rose-800 font-medium">
        <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" /> Voltar para início
      </button>
      <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fale Conosco</h1>
        <p className="text-gray-600">Sugestões, dúvidas ou colaborações</p>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input type="text" placeholder="Seu nome" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" placeholder="seu@email.com" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea rows={4} placeholder="Como podemos ajudar?" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-300 resize-none" />
            </div>
            <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-lg transition-colors">
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navTo('home')} className="text-xl font-bold text-gray-800 hover:text-rose-600 transition-colors">
            Projeto Aninhar
          </button>
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <nav className="hidden lg:flex space-x-6">
            <button onClick={() => navTo('home')} className="text-gray-700 hover:text-rose-500 font-medium transition-colors">Home</button>
            <button onClick={() => navTo('about')} className="text-gray-700 hover:text-rose-500 font-medium transition-colors">Sobre</button>
            <button onClick={() => navTo('contact')} className="text-gray-700 hover:text-rose-500 font-medium transition-colors">Contato</button>
          </nav>
        </div>
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-white border-t border-gray-100">
            <ul className="space-y-1 p-4">
              <li><button onClick={() => navTo('home')} className="block w-full text-left px-2 py-2 text-gray-700 hover:text-rose-500 font-medium">Home</button></li>
              <li><button onClick={() => navTo('about')} className="block w-full text-left px-2 py-2 text-gray-700 hover:text-rose-500 font-medium">Sobre</button></li>
              <li><button onClick={() => navTo('contact')} className="block w-full text-left px-2 py-2 text-gray-700 hover:text-rose-500 font-medium">Contato</button></li>
            </ul>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && renderHome()}
        {currentView === 'age' && renderAgeView()}
        {currentView === 'theme' && renderThemeView()}
        {currentView === 'about' && renderAbout()}
        {currentView === 'contact' && renderContact()}
      </main>

      <footer className="bg-white/80 border-t border-rose-100 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-gray-600 mb-2">Projeto Aninhar</p>
          <p className="text-sm text-gray-500">Cuidando com amor e informação</p>
        </div>
      </footer>
    </div>
  );
}
