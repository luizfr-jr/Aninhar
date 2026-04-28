import React, { useState } from 'react';
import { Book, Baby, Utensils, Moon, Heart, Stethoscope, Shield, Users, ChevronRight, Menu, X, Droplets, FileText, ClipboardList, AlertTriangle } from 'lucide-react';

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
    { id: 'baby1-6', name: 'Bebê', subtitle: '1-6 meses', color: 'bg-violet-100' },
    { id: 'baby7-12', name: 'Bebê', subtitle: '7-12 meses', color: 'bg-amber-100' },
    { id: 'toddler', name: 'Criança', subtitle: '13-24 meses', color: 'bg-orange-100' }
  ];

  const themes = [
    { id: 'amamentacao', name: 'Amamentação', icon: Heart, color: 'text-violet-600' },
    { id: 'alimentacao', name: 'Introdução Alimentar', icon: Utensils, color: 'text-amber-600' },
    { id: 'sono', name: 'Sono', icon: Moon, color: 'text-indigo-600' },
    { id: 'desenvolvimento', name: 'Desenvolvimento', icon: Baby, color: 'text-pink-600' },
    { id: 'vacinas', name: 'Vacinas', icon: Shield, color: 'text-teal-600' },
    { id: 'saude', name: 'Saúde e Doenças', icon: Stethoscope, color: 'text-red-600' },
    { id: 'pais', name: 'Cuidando dos Pais', icon: Users, color: 'text-purple-600' },
    { id: 'higiene', name: 'Higiene e Cuidados Diários', icon: Droplets, color: 'text-cyan-600' },
    { id: 'acidentes', name: 'Segurança e Prevenção de Acidentes', icon: AlertTriangle, color: 'text-orange-600' },
    { id: 'primeirosPassos', name: 'Primeiros Passos', icon: ClipboardList, color: 'text-emerald-600' },
    { id: 'licencas', name: 'Licenças Maternidade e Paternidade', icon: FileText, color: 'text-blue-600' },
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
        { title: '', content: '', links: [], subtitle: 'Posições de Amamentação', text: 'Posição cavaleiro: bebê sentado com as pernas abertas sobre sua coxa — ótima para bebês com refluxo. Posição invertida: a cabeça do bebê é apoiada com as mãos e as perninhas ficam por baixo da sua axila — indicada para bebês prematuros ou com dificuldade de pega. Posição deitada: mãe e bebê deitados de lado frente a frente — ideal para amamentações noturnas e pós-parto cesárea.' },
        { title: '', content: '', links: [], subtitle: 'Frequência e Duração', text: 'Nos primeiros meses, amamente em livre demanda: 8 a 12 vezes ao dia, a cada 2-3 horas. Deixe o bebê esvaziar um seio antes de oferecer o outro. Sinais de fome: levar as mãos à boca, fazer movimentos de sucção, agitação.' },
        { title: '', content: '', links: [], subtitle: 'Como Saber se o Bebê Está Mamando Bem?', text: 'O bebê está mamando bem quando: mama em livre demanda (8 ou mais vezes por dia), ganha peso de forma adequada, urina várias vezes ao dia com urina clara, faz cocô pastoso e amarelado após as mamadas, demonstra estar satisfeito após mamar e dorme tranquilo. Choro frequente não significa, por si só, que o leite é insuficiente. Consultas regulares com o pediatra ajudam a acompanhar esse processo.' },
        { title: '', content: '', links: [], subtitle: 'Almofada de Amamentação', text: 'Ajuda a manter a postura e colocar a criança na altura ideal, aumentando o conforto e auxiliando a posição adequada durante a mamada.' },
        { title: '', content: '', links: [], subtitle: 'Sutiã de Amamentação', text: 'Escolha um sutiã confortável, sem compressão abaixo da borda. Sutiãs que tenham abertura pela frente facilitam a amamentação e o acesso rápido.' },
        { title: '', content: '', links: [], subtitle: 'Bombas Extratoras', text: 'São um bom acessório para quando o leite precisa ser armazenado — como na volta ao trabalho. Pode ser manual ou elétrica: a melhor opção é a que você se adapta e se sente mais confortável.' },
        { title: '', content: '', links: [], subtitle: 'Tipoias de Amamentação', text: 'Ajudam na sustentação de seios volumosos ou pesados. Permitem que a mãe mantenha as mãos livres, facilitando a pega e o posicionamento do bebê.' },
        { title: '', content: '', links: [], subtitle: 'Rosquinhas de Amamentação', text: 'São rosquinhas feitas de tecido usadas dentro do sutiã/top. Auxiliam na prevenção de fissuras, pois garantem que o mamilo e a aréola fiquem suspensos e não em contato direto com o tecido, mantendo a região seca. Protegem mamilos machucados evitando atrito constante. IMPORTANTE: as rosquinhas podem ficar úmidas com o leite, por isso devem ser lavadas e trocadas com frequência.' },
        { title: '', content: '', links: [], subtitle: 'Conchas e Absorventes (Atenção!)', text: 'Embora pareçam práticos, costumam deixar os mamilos úmidos, aumentando a chance de lesões e contaminação por bactérias e fungos. NÃO são recomendados — prefira as rosquinhas de amamentação.' },
        { title: '', content: '', links: [], subtitle: 'Desafios Comuns', text: 'Ingurgitamento, mastite e mamilos doloridos são frequentes. Na maioria dos casos, corrigir a pega resolve as dores. Para ingurgitamento, amamente com frequência. Em caso de mastite (seio vermelho, duro e febre), consulte um médico.' },
        { title: '', content: '', links: [], subtitle: 'Por Quanto Tempo Amamentar?', text: 'A OMS recomenda amamentação exclusiva até os 6 meses e complementar até os 2 anos ou mais. O desmame natural ocorre quando mãe e bebê estão prontos. Qualquer período de amamentação já traz benefícios importantes.' },
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
        { title: '', content: '', links: [], subtitle: 'Fórmulas Infantis: Quando Usar?', text: 'A fórmula infantil é indicada quando a amamentação não é possível ou insuficiente — por decisão da mãe, condição médica ou impossibilidade de produção de leite. Nunca substitua a fórmula por leite de vaca antes dos 12 meses. A decisão deve ser orientada pelo pediatra, que indicará o tipo adequado para cada bebê.' },
        { title: '', content: '', links: [], subtitle: 'Fórmulas Infantis: Tipos', text: 'Fórmula de partida (fase 1): indicada de 0 a 6 meses. Fórmula de seguimento (fase 2): de 6 a 12 meses. Fórmula de crescimento (fase 3): de 12 a 24 meses. Existem ainda fórmulas especiais: sem lactose (para intolerância), fórmula extensamente hidrolisada ou de aminoácidos (para alergia à proteína do leite de vaca — APLV), e fórmulas para prematuros. Sempre siga a indicação do pediatra.' },
        { title: '', content: '', links: [], subtitle: 'Fórmulas Infantis: Preparo e Higiene', text: 'Use sempre água filtrada ou fervida e resfriada para preparo. Siga rigorosamente a proporção indicada na embalagem — fórmula mais concentrada ou diluída pode ser prejudicial. Prepare apenas o necessário para cada mamada. A mamadeira e o bico devem ser esterilizados regularmente (água fervente por 5 minutos). Armazene fórmula preparada na geladeira por no máximo 24 horas. Descarte qualquer sobra após a mamada.' },
        { title: '', content: '', links: [], subtitle: 'Alimentação Complementar (12-24 meses)', text: 'A partir dos 12 meses, o bebê pode fazer a transição gradual para a comida da família. Mantenha a amamentação complementar sempre que possível. Nessa fase, é comum a seletividade alimentar (picky eater) — ofereça variedade sem pressão. Inclua lanches saudáveis entre as refeições: frutas, iogurte natural, queijo, legumes cozidos. Evite ultraprocessados, açúcar e sal em excesso.' },
      ]
    },
    sono: {
      name: 'Sono', title: 'Sono',
      sections: [
        { title: '', content: '', links: [], subtitle: 'Como é o Sono do Bebê', text: 'Os ciclos de sono do bebê duram ~45 min (vs. 90 min do adulto), com mais tempo em sono leve. Por isso acordam facilmente entre ciclos. Até os 4-6 meses, acordar para mamar à noite é fisiologicamente normal.' },
        { title: '', content: '', links: [], subtitle: 'Ambiente Seguro para Dormir', text: 'O bebê deve dormir no mesmo quarto dos pais, mas evite cama compartilhada. A posição correta é de barriga para cima — sempre. Cuide para que o rosto não seja encoberto por lençóis ou cobertores. Vestir o bebê com camadas de roupas é preferível ao uso de cobertas. Sacos de dormir vestíveis também podem ser usados — devem deixar cabeça e braços livres. Tudo que for macio ou solto é risco e deve ser removido: sem bichos de pelúcia, almofadas, travesseiros, protetores de berço ou edredons. Use lençóis de elástico presos ao colchão.' },
        { title: '', content: '', links: [], subtitle: 'Rotinas de Sono', text: 'Uma rotina previsível ajuda o bebê a entender que é hora de dormir: banho, massagem, amamentação, leitura e música calma. A consistência importa mais que a sequência. A partir dos 3-4 meses já é possível estabelecer uma rotina noturna.' },
        { title: '', content: '', links: [], subtitle: 'Regressões de Sono', text: 'Regressões são períodos de piora do sono associados a saltos de desenvolvimento. As mais comuns: 4 meses (mais intensa), 8-10 meses, 12 meses e 18 meses. São temporárias (2-6 semanas). Manter a rotina e oferecer mais acolhimento ajuda.' },
        { title: '', content: '', links: [], subtitle: 'Sonecas Diurnas', text: 'Recém-nascidos dormem 4-5 vezes ao dia; aos 6 meses, 2-3 sonecas; aos 12-18 meses, 1-2 sonecas. A última soneca deve terminar ao menos 2h antes de dormir à noite. Por volta dos 2-3 anos a maioria abandona as sonecas naturalmente.' },
        { title: '', content: '', links: [], subtitle: 'Ruído Branco', text: 'O ruído branco é um som contínuo e uniforme (como chuva, ventilador ou máquinas específicas) que imita os sons do ambiente intrauterino. Pode ajudar a acalmar bebês agitados e a manter o sono mais estável ao "mascarar" ruídos externos do ambiente. Como usar com segurança: mantenha o volume baixo (no máximo 50 decibéis — como uma conversa normal), coloque a fonte sonora a pelo menos 1 metro do bebê e evite uso contínuo por tempo prolongado. Não é obrigatório — é apenas uma ferramenta auxiliar.' },
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
        { title: '', content: '', links: [], subtitle: 'Dicas de Estímulo: 0-6 meses', text: 'Converse e cante para o bebê — ele reconhece a sua voz desde antes de nascer. Faça contato visual e imite suas expressões. Tummy time (tempo de bruços) com supervisão fortalece pescoço e prepara para rolar. Ofereça chocalhos e objetos coloridos a cerca de 20-30 cm do rosto. Passeios ao ar livre estimulam os sentidos. Massagens suaves fortalecem o vínculo.' },
        { title: '', content: '', links: [], subtitle: 'Dicas de Estímulo: 7-24 meses', text: '7-12 meses: esconde-esconde, brinquedos de encaixe, bater palmas, imitar sons e gestos, explorar diferentes texturas. 13-24 meses: livros com figuras e texturas, brincadeiras de faz-de-conta, blocos de montar, música e dança. A leitura compartilhada desde bebê é uma das melhores formas de estimular linguagem e vínculo afetivo — qualquer livro é bem-vindo.' },
        { title: '', content: '', links: [], subtitle: 'Uso de Telas: O que diz a Ciência', text: 'A Sociedade Brasileira de Pediatria (SBP) recomenda: ZERO telas para crianças até 2 anos. A exposição precoce está associada a prejuízos no desenvolvimento da linguagem, qualidade do sono, capacidade de atenção e habilidades sociais. Isso inclui TV ao fundo, celular para "acalmar" e videochamadas longas. A melhor tela para um bebê é o rosto dos seus cuidadores.' },
        { title: '', content: '', links: [], subtitle: 'Alternativas às Telas', text: 'Em vez de telas: leia livros com figuras, brinque com objetos simples do cotidiano (panelas, colheres, potes), ofereça brincadeiras sensoriais (areia, água, massinha atóxica), ouça músicas e cantigas, faça passeios ao ar livre. Ruído branco pode ser uma alternativa para acalmar o bebê sem estimulação visual de telas.' },
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
    higiene: {
      name: 'Higiene e Cuidados Diários', title: 'Higiene e Cuidados Diários',
      icon: Droplets,
      sections: [
        { title: '', content: '', links: [], subtitle: 'Banho do Bebê: Preparação e Segurança', text: 'Antes de começar, aqueça bem o ambiente — bebês perdem calor facilmente. Deixe tudo à mão: toalha, fralda limpa, roupinhas e produtos de higiene. Teste sempre a temperatura da água: deve estar entre 36,9°C e 37,5°C — use seu cotovelo ou um termômetro.' },
        { title: '', content: '', links: [], subtitle: 'Banho do Bebê: O Momento do Banho', text: 'Para o banho de imersão, coloque o bebê na banheira com água até a cintura. Uma dica é colocá-lo enrolado na fraldinha e ir desenrolando devagar. Use apenas produtos suaves, hipoalergênicos e feitos para a pele do bebê. Para lavar o couro cabeludo, use a quantidade de um pequeno círculo (como uma moeda), faça movimentos suaves, enxágue bem e seque com toques suaves — nunca esfregue e jamais use secador.' },
        { title: '', content: '', links: [], subtitle: 'Banho do Bebê: Cuidados Finais', text: 'Não se preocupe em retirar o vérnix (camadinha esbranquiçada) — ela hidrata, protege e será naturalmente reabsorvida. Ao tirar o bebê da água, seque com toques gentis usando toalha macia e bem seca. Crie um ambiente de carinho: coloque música calma e converse ou cante durante o banho.' },
        { title: '', content: '', links: [], subtitle: 'Cuidados com o Coto Umbilical', text: 'Mantenha o coto limpo e seco. Não é necessário usar álcool ou nenhum produto — água limpa e secagem cuidadosa são suficientes na maioria dos casos. O coto cai sozinho entre 7 e 21 dias. Procure o pediatra se houver vermelhidão ao redor, cheiro forte, secreção ou sangramento.' },
        { title: '', content: '', links: [], subtitle: 'Troca de Fraldas e Prevenção de Assaduras', text: 'Troque a fralda com frequência — ao menos a cada 2-3 horas ou sempre que estiver suja. Limpe de frente para trás com toalhinha umedecida sem perfume. Para prevenir assaduras: mantenha a área seca, use creme de barreira (óxido de zinco) em cada troca e deixe o bebê um tempo sem fralda ao dia. Assaduras persistentes ou com aspecto de candidíase (fungal) requerem tratamento específico.' },
        { title: '', content: '', links: [], subtitle: 'Higiene das Unhas', text: 'As unhas do recém-nascido são finas e podem ser compridas ao nascer. Inicialmente, lixe com lixas suaves para bebês. Após, faça um corte reto com tesoura sem ponta. Higienize suas mãos e os materiais antes. Escolha um momento em que o bebê esteja calmo ou adormecido. Se cortar além do desejado, lave com sabão neutro e aplique leve pressão com gaze limpa. Unha encravada (bordas inflamadas): interrompa o corte e consulte o pediatra.' },
        { title: '', content: '', links: [], subtitle: 'Higiene Oral: Antes dos Dentes', text: 'Antes dos primeiros dentes, não é necessário fazer higiene bucal especial — a gengiva se limpa naturalmente. Fique atento ao surgimento do primeiro dente para iniciar os cuidados.' },
        { title: '', content: '', links: [], subtitle: 'Higiene Oral: Com os Primeiros Dentes', text: 'Desde a primeira pontinha de dente, inicie a escovação com escova macia ou extra macia, cabeça pequena. Use pasta com flúor (mínimo 1100 ppm — verifique nos ingredientes), na quantidade de um grão de arroz. Escove pelo menos 2x ao dia: manhã e antes de dormir. A escovação deve ser feita por um adulto. Fio dental: use se os dentes estiverem muito juntos.' },
        { title: '', content: '', links: [], subtitle: 'Primeira Consulta com o Dentista', text: 'Quando surgirem os primeiros dentes, agende uma consulta com odontopediatra. O dentista recomendará dieta e práticas adequadas para a saúde oral e é importante o bebê se familiarizar com o ambiente odontológico. Dica: uma alimentação saudável e rica em nutrientes ajuda na formação dos dentes — evite açúcar e ultraprocessados.' },
      ]
    },
    primeirosPassos: {
      name: 'Primeiros Passos', title: 'Primeiros Passos — Guia do Recém-Nascido',
      icon: ClipboardList,
      sections: [
        { title: '', content: '', links: [], subtitle: 'Compromissos da Primeira Semana', text: 'Após a alta hospitalar, é fundamental garantir que o bebê receba os cuidados médicos necessários. Siga todas as recomendações do hospital e do pediatra. Os principais compromissos são: realizar as vacinas iniciais (Hepatite B e BCG), fazer o Teste do Pezinho entre o 3° e 5° dia de vida e agendar a primeira consulta pediátrica nos primeiros 7 dias de vida.' },
        { title: '', content: '', links: [], subtitle: 'Primeiras Vacinas: Hepatite B e BCG', text: 'Durante a internação em hospitais SUS, o recém-nascido normalmente recebe as primeiras vacinas antes da alta. Caso não tenha recebido, a vacina contra Hepatite B (protege o fígado) e a vacina BCG (protege contra formas graves de tuberculose) devem ser realizadas o quanto antes no posto de saúde, de forma gratuita.' },
        { title: '', content: '', links: [], subtitle: 'Testes de Triagem Neonatal', text: 'Teste do Pezinho: realizado entre o 3° e 5° dia de vida, detecta doenças como fenilcetonúria, hipotireoidismo e fibrose cística. Pelo SUS é gratuito; na rede privada inclui 100 a 200+ doenças. Teste da Orelhinha: avalia a audição, deve ser feito antes de 1 mês. Teste do Olhinho: detecta patologias oculares. Teste do Coraçãozinho: detecta doenças cardíacas. Teste da Linguinha: diagnostica anquiloglossia (língua presa).' },
        { title: '', content: '', links: [], subtitle: 'Primeira Consulta Pediátrica', text: 'É altamente recomendada nos primeiros 7 dias de vida. O pediatra avaliará: ganho de peso, icterícia (pele amarelada), reflexo de sucção, condições da pele e do cordão umbilical, e iniciará suplementações necessárias. É também o momento ideal para os pais tirarem dúvidas sobre amamentação e cuidados com o bebê.' },
        { title: '', content: '', links: [], subtitle: 'Certidão de Nascimento', text: 'Registrar o bebê é exigência legal e garante à criança acesso à saúde, educação e benefícios sociais. O registro pode ser feito no cartório de registro civil ou no próprio hospital/maternidade. Prazo: até 15 dias após o nascimento (pode ser prorrogado para 45 dias ou 3 meses em locais distantes). Documentos: Declaração de Nascido Vivo (DNV), RG ou CNH dos pais e certidão de casamento. O primeiro registro e a primeira via são totalmente gratuitos.' },
        { title: '', content: '', links: [], subtitle: 'Sinais de Alerta no Recém-Nascido', text: 'Procure ajuda imediatamente se o bebê apresentar: gemido persistente ao respirar, parada de respiração por mais de 20 segundos, respiração difícil ou pele azulada (cianose), febre acima de 37,5-38°C ou temperatura abaixo de 36°C, palidez intensa ou pele marmorizada, dificuldade para mamar ou sonolência excessiva, choro incomum ou difícil de consolar, convulsões (olhar parado, tremores), cheiro forte no umbigo com vermelhidão ou secreção, diarreia ou ausência de evacuação por mais de 3 dias.' },
        { title: '', content: '', links: [], subtitle: 'Cuidados com a Mãe no Pós-Parto', text: 'O puerpério é uma jornada de recuperação. Procure orientação médica imediatamente se notar: febre (≥37,8°C), sangramento excessivo ou com coágulos grandes, dores fortes e persistentes, falta de ar ou palpitações, inchaço excessivo nas pernas/tornozelos/rosto, sintomas depressivos (tristeza profunda, desinteresse, pensamentos negativos). No pós-parto vaginal, atenção à cicatrização do períneo. Na cesárea, observe a incisão. Mamas avermelhadas, endurecidas e com febre podem indicar mastite — procure o médico.' },
      ]
    },
    licencas: {
      name: 'Licenças Maternidade e Paternidade', title: 'Licenças Maternidade e Paternidade',
      icon: FileText,
      sections: [
        { title: '', content: '', links: [], subtitle: 'Licença-Maternidade: Duração', text: 'A licença-maternidade dura 120 dias. Esse período vale tanto para parto quanto para adoção ou guarda judicial. Em caso de aborto não criminoso, a licença é de 14 dias. Se a empresa participa do Programa Empresa Cidadã, a licença pode ser prorrogada de 120 para 180 dias (60 dias extras).' },
        { title: '', content: '', links: [], subtitle: 'Licença-Maternidade: Início e Salário', text: 'A lei permite iniciar a licença até 28 dias antes da data prevista para o parto — o médico informa a data provável e autoriza o início antecipado. O salário-maternidade da empregada com carteira assinada é pago diretamente pela empresa, que depois compensa os valores junto ao INSS. Não existe carência mínima: basta ter uma contribuição válida antes do parto.' },
        { title: '', content: '', links: [], subtitle: 'Licença-Maternidade: Como Pedir', text: 'Para empregadas com carteira assinada, o pedido é feito diretamente pela empresa. Documentos normalmente exigidos: documento com foto, atestado médico com data provável do parto (para início antecipado), certidão de nascimento (após o parto) e termo de guarda ou adoção, se for o caso.' },
        { title: '', content: '', links: [], subtitle: 'Licença-Paternidade: Duração e Pagamento', text: 'A licença-paternidade é de 5 dias corridos. Se a empresa participa do Programa Empresa Cidadã, pode ser de 20 dias corridos. Começa a contar no dia do nascimento do filho (desde que seja dia útil). Os dias são pagos pela empresa como parte da remuneração normal do empregado. Não existe requerimento no INSS para esse benefício.' },
        { title: '', content: '', links: [], subtitle: 'Licença-Paternidade: Como Pedir', text: 'O colaborador deve: informar o nascimento ao RH imediatamente e entregar a certidão de nascimento da criança. Documentos necessários: certidão de nascimento da criança e documento pessoal com foto.' },
      ]
    },
    acidentes: {
      name: 'Segurança e Prevenção de Acidentes', title: 'Segurança e Prevenção de Acidentes',
      icon: AlertTriangle,
      sections: [
        { title: '', content: '', links: [], subtitle: 'Por que Prevenir Acidentes?', text: 'Acidentes domésticos são a principal causa de morte de crianças de 0 a 14 anos no Brasil, e muitos podem ser facilmente evitados com medidas simples e atenção redobrada. Cuidar é também antecipar e prevenir.' },
        { title: '', content: '', links: [], subtitle: 'Prevenindo Quedas', text: 'Nunca deixe o bebê sozinho em superfícies elevadas — mesmo que ainda não role. No trocador, mantenha sempre uma mão firme no bebê. Se a campainha ou telefone tocar, leve o bebê consigo ou coloque-o no berço. Não use almofadas como barreiras nas laterais da cama — são risco de sufocamento. Cadeirinhas e bebê confortos nunca devem ser colocados em superfícies elevadas. Se a casa tiver escadas, use portões de segurança firmemente instalados.' },
        { title: '', content: '', links: [], subtitle: 'Casa Segura', text: 'Evite contato da criança com peças e objetos pequenos. Certifique-se de que brinquedos são apropriados para a idade e não têm peças que possam ser engolidas. Remédios, produtos de limpeza e cosméticos devem ficar em armários altos e trancados. Nunca deixe sacos plásticos, cordões ou fios próximos ao bebê. Use protetores nas tomadas. Nunca segure o bebê no colo enquanto bebe líquidos quentes. Nunca deixe cabos de panela voltados para fora do fogão. Use travas em armários e gavetas com itens perigosos. Nunca deixe baldes ou bacias com água no chão. Mantenha a tampa do vaso sanitário fechada. Nunca use talco ou produtos em pó na criança.' },
        { title: '', content: '', links: [], subtitle: 'Segurança no Carro', text: 'A cadeirinha é obrigatória por lei e salva vidas. Ela deve ser instalada corretamente, de costas para o sentido do movimento até os 2 anos (ou até atingir o limite de peso da cadeirinha). Nunca coloque a cadeirinha virada para frente antes do tempo indicado. Leia o manual da cadeirinha e, se possível, peça a um técnico para verificar a instalação.' },
        { title: '', content: '', links: [], subtitle: 'Prevenção de Engasgo', text: 'Evite oferecer alimentos redondos inteiros (uva, tomate-cereja, azeitona), alimentos duros sem cozinhar adequadamente e objetos pequenos ao alcance. Cortes seguros: uva ao meio (no sentido do comprimento), salsichas em quartos longitudinais. Na introdução alimentar, adapte sempre a textura à idade. Mantenha objetos pequenos (moedas, botões, baterias) fora do alcance.' },
        { title: '', content: '', links: [], subtitle: 'Manobra de Desengasgo', text: 'Se o bebê engasgar e não conseguir respirar: em menores de 1 ano, segure-o de bruços sobre seu antebraço e dê até 5 tapinhas firmes nas costas (entre as omoplatas) com a palma da mão. Depois vire-o de costas e faça até 5 compressões no peito com 2 dedos. Repita até o objeto sair ou o bebê conseguir respirar. Se perder a consciência, acione o SAMU (192) e inicie RCP. Procure um curso de primeiros socorros para bebês.' },
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
      className="inline-flex items-center text-sm text-violet-600 hover:text-violet-800 font-medium underline"
    >
      {text} <ChevronRight className="w-4 h-4 ml-1" />
    </button>
  );

  const renderHome = () => (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-12 px-4">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 flex items-center justify-center">
          <Heart className="w-16 h-16 text-violet-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao Projeto Aninhar</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Um ambiente acolhedor de informações para você cuidar do seu bebê com segurança e amor.
          Explore os temas abaixo para encontrar o que precisa.
        </p>
      </div>

      {/* Navigation by Theme */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <Book className="w-8 h-8 mr-3 text-violet-500" />
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
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-violet-300 transform hover:-translate-y-1"
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
          className="mb-6 flex items-center text-violet-600 hover:text-violet-800 font-medium"
        >
          <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
          Voltar para início
        </button>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-3xl mb-8">
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
          className="mb-6 flex items-center text-violet-600 hover:text-violet-800 font-medium"
        >
          <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" />
          Voltar para início
        </button>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-3xl mb-8 text-center">
          {Icon && <Icon className="w-16 h-16 mx-auto mb-4 text-violet-400" />}
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

        <div className="mt-12 bg-violet-50 p-6 rounded-2xl border-2 border-violet-100">
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
                className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-sm font-medium text-gray-700 border-2 border-gray-100 hover:border-violet-200"
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
      <button onClick={() => navTo('home')} className="mb-6 flex items-center text-violet-600 hover:text-violet-800 font-medium">
        <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" /> Voltar para início
      </button>
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-3xl mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 flex items-center justify-center">
          <Heart className="w-10 h-10 text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sobre o Projeto Aninhar</h1>
        <p className="text-gray-600">Um ambiente acolhedor de informação para famílias</p>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Quem Somos</h2>
          <p className="text-gray-700 leading-relaxed">O PROJETO ANINHAR é fruto de um trabalho de Mestrado, ligado ao Programa de Pós-Graduação em Saúde Materno Infantil da Universidade Franciscana (UFN), uma iniciativa desenvolvida por uma <strong>Pediatra e Mestranda</strong>, dedicada a transformar o conhecimento científico em apoio prático e acessível. Embora seja uma ferramenta gratuita disponível para famílias de todo o Brasil, temos um vínculo especial com a <strong>Maternidade Santa Isabel do Hospital Casa de Saúde, localizado em Santa Maria/RS</strong>, de onde nasce a inspiração e o desejo de facilitar a transição dos pais para casa com seu bebê.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Nossa Missão</h2>
          <p className="text-gray-700 leading-relaxed">Nossa missão é clara: <strong>simplificar a jornada de cuidados com seu recém-nascido</strong>. Acreditamos que a informação certa, no momento certo, tem o poder de tornar a maternidade e a paternidade mais leves. Por isso, oferecemos um conteúdo <strong>seguro, claro e integralmente baseado em evidências científicas</strong>.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">O que Você Encontrará Aqui</h2>
          <ul className="text-gray-700 leading-relaxed space-y-2">
            <li>• <strong>Dicas e Textos Esclarecedores:</strong> Conteúdo didático sobre as dúvidas mais comuns da fase neonatal.</li>
            <li>• <strong>Vídeos Práticos:</strong> Guias visuais para o dia a dia de cuidados.</li>
            <li>• <strong>Área de Dúvidas:</strong> Um canal dedicado onde você poderá retirar suas perguntas e buscar o amparo necessário.</li>
          </ul>
        </div>
        <div className="bg-violet-50 p-6 rounded-2xl border-2 border-violet-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Aviso Importante</h2>
          <p className="text-gray-700 leading-relaxed">As informações do Aninhar têm caráter educativo e não substituem a avaliação de um profissional de saúde. Sempre consulte seu pediatra, médico ou outro profissional qualificado para orientações específicas sobre a saúde do seu filho.</p>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navTo('home')} className="mb-6 flex items-center text-violet-600 hover:text-violet-800 font-medium">
        <ChevronRight className="w-5 h-5 mr-1 transform rotate-180" /> Voltar para início
      </button>
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fale Conosco</h1>
        <p className="text-gray-600">Sugestões, dúvidas ou colaborações</p>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input type="text" placeholder="Seu nome" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-violet-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" placeholder="seu@email.com" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-violet-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea rows={4} placeholder="Como podemos ajudar?" className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-violet-300 resize-none" />
            </div>
            <button className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 rounded-lg transition-colors">
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b-4 border-violet-500">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navTo('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-violet-600">Projeto Aninhar</span>
              <span className="text-xs text-gray-400 font-medium">NinMa Hub · UFN</span>
            </div>
          </button>
          <button
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <nav className="hidden lg:flex space-x-6">
            <button onClick={() => navTo('home')} className="text-gray-700 hover:text-violet-500 font-medium transition-colors">Home</button>
            <button onClick={() => navTo('about')} className="text-gray-700 hover:text-violet-500 font-medium transition-colors">Sobre</button>
            <button onClick={() => navTo('contact')} className="text-gray-700 hover:text-violet-500 font-medium transition-colors">Contato</button>
          </nav>
        </div>
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-white border-t border-gray-100">
            <ul className="space-y-1 p-4">
              <li><button onClick={() => navTo('home')} className="block w-full text-left px-2 py-2 text-gray-700 hover:text-violet-500 font-medium">Home</button></li>
              <li><button onClick={() => navTo('about')} className="block w-full text-left px-2 py-2 text-gray-700 hover:text-violet-500 font-medium">Sobre</button></li>
              <li><button onClick={() => navTo('contact')} className="block w-full text-left px-2 py-2 text-gray-700 hover:text-violet-500 font-medium">Contato</button></li>
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

      <footer className="bg-white border-t-4 border-violet-500 mt-16">
        <div className="container mx-auto px-4 py-10">
          {/* Logos */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-8">
            {/* NinMa Hub Logo */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <div className="flex items-end gap-1 leading-none">
                  <span className="text-3xl font-bold" style={{color:'#7B68C8'}}>nin</span>
                  <span className="text-3xl font-bold" style={{color:'#7B68C8'}}>Ma</span>
                  <span className="text-3xl font-bold text-gray-700 ml-1">hub</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  <span>Núcleo de Inovação </span>
                  <span className="font-bold text-gray-600">Materno Infantil UFN</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            {/* Oryum Tech Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-2xl font-bold tracking-widest text-gray-700">ORYUM TECH</span>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center space-y-2 border-t border-gray-100 pt-6">
            <p className="text-sm font-semibold text-violet-600">Projeto Aninhar — Cuidando com amor e informação</p>
            <p className="text-xs text-gray-500">
              Desenvolvido por <span className="font-medium text-gray-700">Luiz Fernando Rodrigues Junior</span> e <span className="font-medium text-gray-700">Kalleby Evangelho Mota</span>
            </p>
            <p className="text-xs text-gray-400">
              Uma iniciativa <span className="font-medium">NinMa Hub</span> · Universidade Franciscana (UFN) · Tecnologia <span className="font-medium">Oryum Tech</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
