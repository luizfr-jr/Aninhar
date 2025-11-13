import React, { useState } from 'react';
import { Book, Baby, Utensils, Moon, Heart, Stethoscope, Shield, Users, Home, Clock, ChevronRight, Menu, X } from 'lucide-react';

export default function ProjetoAninhar() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
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

  const ageContent = {
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

  const themeContent = {
    'amamentacao': {
      title: 'Amamentação',
      icon: Heart,
      sections: [
        { subtitle: 'Benefícios', text: 'O leite materno é o alimento ideal, protege contra infecções, fortalece o vínculo e está sempre na temperatura perfeita.' },
        { subtitle: 'Pega Correta', text: 'O bebê deve abocanhar não só o mamilo, mas também boa parte da aréola. A boca fica bem aberta, lábios virados para fora.' },
        { subtitle: 'Livre Demanda', text: 'Amamente sempre que o bebê demonstrar sinais de fome, sem horários rígidos, especialmente nos primeiros meses.' },
        { subtitle: 'Dificuldades Comuns', text: 'Fissuras, ingurgitamento, mastite. Procure ajuda de consultora de amamentação se necessário.' }
      ]
    },
    'alimentacao': {
      title: 'Introdução Alimentar',
      icon: Utensils,
      sections: [
        { subtitle: 'Sinais de Prontidão (6 meses)', text: 'Sentar com apoio mínimo, levar objetos à boca, interesse pela comida, perdeu reflexo de protrusão da língua.' },
        { subtitle: 'Método Tradicional', text: 'Papinhas amassadas, oferecendo diferentes texturas gradualmente. Inicia com consistência mais líquida.' },
        { subtitle: 'BLW (Baby-Led Weaning)', text: 'Bebê se alimenta sozinho com alimentos em pedaços, explorando texturas, sabores e desenvolvendo autonomia.' },
        { subtitle: 'Cortes Seguros', text: 'Evite alimentos redondos e duros. Corte uvas ao meio no comprimento, cenoura cozida em palitos, evite pipoca e amendoim inteiro.' },
        { subtitle: 'Alergias Alimentares', text: 'Principais alérgenos: leite de vaca, ovo, trigo, soja, amendoim, castanhas, peixe, frutos do mar. Introduza um de cada vez.' }
      ]
    },
    'sono': {
      title: 'Sono',
      icon: Moon,
      sections: [
        { subtitle: 'Ambiente Seguro', text: 'Berço vazio (sem travesseiros, cobertores soltos), de barriga para cima, colchão firme. Previne SMSL.' },
        { subtitle: 'Rituais de Sono', text: 'Sequência previsível: banho, massagem, história, canção. Ajuda o bebê a reconhecer que é hora de dormir.' },
        { subtitle: 'Regressões de Sono', text: 'Comuns aos 4, 8 e 18 meses, relacionadas a saltos de desenvolvimento. São temporárias, mantenha rotina.' },
        { subtitle: 'Sonecas', text: 'Fundamentais para o sono noturno. Bebês muito cansados dormem pior à noite.' },
        { subtitle: 'Ruído Branco', text: 'Pode ajudar a mascarar sons externos e acalmar o bebê, lembrando o útero materno.' }
      ]
    },
    'desenvolvimento': {
      title: 'Desenvolvimento',
      icon: Baby,
      sections: [
        { subtitle: 'Motor', text: 'Controle da cabeça → rolar → sentar → engatinhar → ficar em pé → andar. Cada bebê tem seu ritmo.' },
        { subtitle: 'Cognitivo', text: 'Permanência do objeto (8-12 meses), causa e efeito, resolução de problemas simples.' },
        { subtitle: 'Linguagem', text: 'Balbucio → primeiras palavras (12 meses) → explosão vocabular (18-24 meses) → frases simples.' },
        { subtitle: 'Social/Afetivo', text: 'Sorriso social, angústia da separação (8-12 meses), brincadeiras paralelas, descoberta da autonomia.' },
        { subtitle: 'Sinais de Alerta', text: 'Ausência de sorriso social aos 3 meses, não sustenta cabeça aos 4 meses, não senta aos 9 meses, não anda aos 18 meses.' },
        { subtitle: 'Estímulo', text: 'Brinque com objetos do dia a dia, converse, cante, leia livros, permita exploração segura do ambiente.' }
      ]
    },
    'saude': {
      title: 'Saúde e Doenças Comuns',
      icon: Stethoscope,
      sections: [
        { subtitle: 'Febre', text: 'Acima de 37,8°C axilar. Em menores de 3 meses, procure médico imediatamente. Ofereça líquidos.' },
        { subtitle: 'Cólicas', text: 'Comuns até 3-4 meses. Massagens, compressa morna, colo. Geralmente melhoram com maturação intestinal.' },
        { subtitle: 'Refluxo', text: 'Comum em bebês. Se ganhar peso bem, é fisiológico. Atenção a sinais de desconforto excessivo.' },
        { subtitle: 'Assaduras', text: 'Troque fraldas frequentemente, use pomada barreira, deixe o bumbum arejado quando possível.' },
        { subtitle: 'Engasgo - Primeiros Socorros', text: 'Menores de 1 ano: 5 tapas nas costas + 5 compressões torácicas. Maiores de 1 ano: Manobra de Heimlich.' },
        { subtitle: 'Quando ir à Emergência', text: 'Febre em menor de 3 meses, dificuldade respiratória, letargia, vômitos persistentes, desidratação, convulsões.' }
      ]
    },
    'pais': {
      title: 'Cuidando dos Pais',
      icon: Users,
      sections: [
        { subtitle: 'Baby Blues vs Depressão Pós-Parto', text: 'Baby blues: primeiros 15 dias, choro fácil, melhora sozinho. DPP: após 2 semanas, tristeza profunda, necessita tratamento.' },
        { subtitle: 'Rede de Apoio', text: 'Aceite ajuda. Não hesite em pedir. Conecte-se com outros pais. Você não precisa fazer tudo sozinho.' },
        { subtitle: 'Relacionamento do Casal', text: 'Comuniquem-se, dividam tarefas, reservem momentos a dois (mesmo em casa), sejam pacientes.' },
        { subtitle: 'Autocuidado', text: 'Reserve tempo para si, mesmo que 10 minutos. Durma quando o bebê dorme. Cuide da sua saúde física e mental.' },
        { subtitle: 'Saúde Mental', text: 'Ansiedade e depressão são comuns. Não tenha vergonha de buscar ajuda profissional. Você merece apoio.' }
      ]
    }
  };

  const LinkButton = ({ themeId, text }) => (
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
    const content = ageContent[selectedAge];
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{content.title}</h1>
          <p className="text-gray-600">Informações essenciais para esta fase</p>
        </div>

        <div className="space-y-8">
          {content.sections.map((section, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
              <div className="flex flex-wrap gap-3">
                {section.links.map(linkId => {
                  const theme = themes.find(t => t.id === linkId);
                  return (
                    <LinkButton
                      key={linkId}
                      themeId={linkId}
                      text={`Saiba mais: ${theme.name}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderThemeView = () => {
    const content = themeContent[selectedTheme];
    const Icon = content.icon;
    
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
          <Icon className="w-16 h-16 mx-auto mb-4 text-rose-400" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{content.title}</h1>
          <p className="text-gray-600">Guia completo sobre o tema</p>
        </div>

        <div className="space-y-6">
          {content.sections.map((section, idx) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-rose-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-200 to-amber-200 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-800">PROJETO</h1>
                <p className="text-lg text-rose-400 font-semibold -mt-1">ANINHAR</p>
              </div>
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-rose-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Início</span>
              </button>
            </nav>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-rose-600 font-medium transition-colors w-full py-2"
              >
                <Home className="w-5 h-5" />
                <span>Início</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && renderHome()}
        {currentView === 'age' && renderAgeView()}
        {currentView === 'theme' && renderThemeView()}
      </main>

      {/* Footer */}
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