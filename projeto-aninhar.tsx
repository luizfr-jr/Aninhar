import React, { useState } from 'react';
import { Book, Baby, Utensils, Moon, Heart, Stethoscope, Shield, Users, Home, Clock, ChevronRight, Menu, X } from 'lucide-react';

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

export default function ProjetoAninhar() {
  const [currentView, setCurrentView] = useState<'home' | 'age' | 'theme'>('home');
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
    amamentacao: { name: 'Amamentação', title: 'Amamentação' },
    alimentacao: { name: 'Introdução Alimentar', title: 'Introdução Alimentar' },
    sono: { name: 'Sono', title: 'Sono' },
    desenvolvimento: { name: 'Desenvolvimento', title: 'Desenvolvimento' },
    saude: { name: 'Saúde e Doenças Comuns', title: 'Saúde e Doenças Comuns' },
    pais: { name: 'Cuidando dos Pais', title: 'Cuidando dos Pais' }
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
                {section.links.map((linkId: string, linkIdx: number) => {
                  const theme = themes.find(t => t.id === linkId);
                  return (
                    <LinkButton
                      key={linkIdx}
                      themeId={linkId}
                      text={`Saiba mais: ${themeContent[linkId]?.name || 'Desconhecido'}`}
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Projeto Aninhar</h1>
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <nav className="hidden lg:flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-indigo-500">Home</a>
            <a href="#" className="text-gray-700 hover:text-indigo-500">Sobre</a>
            <a href="#" className="text-gray-700 hover:text-indigo-500">Contato</a>
          </nav>
        </div>
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-white shadow-md">
            <ul className="space-y-2 p-4">
              <li><a href="#" className="block text-gray-700 hover:text-indigo-500">Home</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-indigo-500">Sobre</a></li>
              <li><a href="#" className="block text-gray-700 hover:text-indigo-500">Contato</a></li>
            </ul>
          </nav>
        )}
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