import {
  Baby,
  Utensils,
  Moon,
  Heart,
  Stethoscope,
  Shield,
  Users,
  Droplets,
  FileText,
  ClipboardList,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export interface TopicImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TopicVideo {
  /** Link original do YouTube, por exemplo https://www.youtube.com/watch?v=ID. */
  url: string;
  title: string;
}

export interface TopicLink {
  label: string;
  url: string;
}

export interface TopicSection {
  /** Mantenha o id ao editar títulos para preservar os links diretos. */
  id: string;
  title: string;
  text: string;
  links: TopicLink[];
  image?: TopicImage;
  video?: TopicVideo;
}

export interface Topic {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  sections: TopicSection[];
}

/** A ordem deste array define a ordem no menu. Conteúdo livremente editável. */
export const topics: Topic[] = [
  {
    id: "primeirosPassos",
    name: "Primeiros Dias",
    title: "Primeiros Dias — Guia do Recém-Nascido",
    description:
      "Os primeiros cuidados, as consultas e as descobertas com o seu recém-nascido.",
    icon: ClipboardList,
    color: "text-emerald-600",
    sections: [
      {
        id: "compromissos-da-primeira-semana",
        title: "Compromissos da Primeira Semana",
        text: "Após a alta hospitalar, é fundamental garantir que o bebê receba os cuidados médicos necessários. Siga todas as recomendações do hospital e do pediatra. Os principais compromissos são: realizar as vacinas iniciais (Hepatite B e BCG), fazer o Teste do Pezinho entre o 3° e 5° dia de vida e agendar a primeira consulta pediátrica nos primeiros 7 dias de vida.",
        links: [],
      },
      {
        id: "primeiras-vacinas-hepatite-b-e-bcg",
        title: "Primeiras Vacinas: Hepatite B e BCG",
        text: "Durante a internação em hospitais SUS, o recém-nascido normalmente recebe as primeiras vacinas antes da alta. Caso não tenha recebido, a vacina contra Hepatite B (protege o fígado) e a vacina BCG (protege contra formas graves de tuberculose) devem ser realizadas o quanto antes no posto de saúde, de forma gratuita.",
        links: [],
      },
      {
        id: "testes-de-triagem-neonatal",
        title: "Testes de Triagem Neonatal",
        text: "Teste do Pezinho: realizado entre o 3° e 5° dia de vida, detecta doenças como fenilcetonúria, hipotireoidismo e fibrose cística. Pelo SUS é gratuito; na rede privada inclui 100 a 200+ doenças. Teste da Orelhinha: avalia a audição, deve ser feito antes de 1 mês. Teste do Olhinho: detecta patologias oculares. Teste do Coraçãozinho: detecta doenças cardíacas. Teste da Linguinha: diagnostica anquiloglossia (língua presa).",
        links: [],
      },
      {
        id: "primeira-consulta-pediatrica",
        title: "Primeira Consulta Pediátrica",
        text: "É altamente recomendada nos primeiros 7 dias de vida. O pediatra avaliará: ganho de peso, icterícia (pele amarelada), reflexo de sucção, condições da pele e do cordão umbilical, e iniciará suplementações necessárias. É também o momento ideal para os pais tirarem dúvidas sobre amamentação e cuidados com o bebê.",
        links: [],
      },
      {
        id: "certidao-de-nascimento",
        title: "Certidão de Nascimento",
        text: "Registrar o bebê é exigência legal e garante à criança acesso à saúde, educação e benefícios sociais. O registro pode ser feito no cartório de registro civil ou no próprio hospital/maternidade. Prazo: até 15 dias após o nascimento (pode ser prorrogado para 45 dias ou 3 meses em locais distantes). Documentos: Declaração de Nascido Vivo (DNV), RG ou CNH dos pais e certidão de casamento. O primeiro registro e a primeira via são totalmente gratuitos.",
        links: [],
      },
      {
        id: "sinais-de-alerta-no-recem-nascido",
        title: "Sinais de Alerta no Recém-Nascido",
        text: "Procure ajuda imediatamente se o bebê apresentar: gemido persistente ao respirar, parada de respiração por mais de 20 segundos, respiração difícil ou pele azulada (cianose), febre acima de 37,5-38°C ou temperatura abaixo de 36°C, palidez intensa ou pele marmorizada, dificuldade para mamar ou sonolência excessiva, choro incomum ou difícil de consolar, convulsões (olhar parado, tremores), cheiro forte no umbigo com vermelhidão ou secreção, diarreia ou ausência de evacuação por mais de 3 dias.",
        links: [],
      },
      {
        id: "cuidados-com-a-mae-no-pos-parto",
        title: "Cuidados com a Mãe no Pós-Parto",
        text: "O puerpério é uma jornada de recuperação. Procure orientação médica imediatamente se notar: febre (≥37,8°C), sangramento excessivo ou com coágulos grandes, dores fortes e persistentes, falta de ar ou palpitações, inchaço excessivo nas pernas/tornozelos/rosto, sintomas depressivos (tristeza profunda, desinteresse, pensamentos negativos). No pós-parto vaginal, atenção à cicatrização do períneo. Na cesárea, observe a incisão. Mamas avermelhadas, endurecidas e com febre podem indicar mastite — procure o médico.",
        links: [],
      },
    ],
  },
  {
    id: "amamentacao",
    name: "Amamentação",
    title: "Amamentação",
    description:
      "Acolhimento e orientação para viver a amamentação no seu tempo.",
    icon: Heart,
    color: "text-rose-500",
    sections: [
      {
        id: "o-inicio-da-amamentacao",
        title: "O Início da Amamentação",
        text: "O leite materno é o alimento mais completo para o bebê. Nos primeiros dias, o seio produz o colostro — rico em anticorpos. Inicie a amamentação na primeira hora de vida sempre que possível.",
        links: [],
      },
      {
        id: "pega-e-posicionamento",
        title: "Pega e Posicionamento",
        text: "Uma boa pega evita dores e garante leite suficiente. O bebê deve abocanhar a aréola, não só o bico. Os lábios ficam virados para fora e o queixo toca o seio. O corpo do bebê deve estar alinhado e voltado para a mãe.",
        links: [],
      },
      {
        id: "posicoes-de-amamentacao",
        title: "Posições de Amamentação",
        text: "Posição cavaleiro: bebê sentado com as pernas abertas sobre sua coxa — ótima para bebês com refluxo. Posição invertida: a cabeça do bebê é apoiada com as mãos e as perninhas ficam por baixo da sua axila — indicada para bebês prematuros ou com dificuldade de pega. Posição deitada: mãe e bebê deitados de lado frente a frente — ideal para amamentações noturnas e pós-parto cesárea.",
        links: [],
      },
      {
        id: "frequencia-e-duracao",
        title: "Frequência e Duração",
        text: "Nos primeiros meses, amamente em livre demanda: 8 a 12 vezes ao dia, a cada 2-3 horas. Deixe o bebê esvaziar um seio antes de oferecer o outro. Sinais de fome: levar as mãos à boca, fazer movimentos de sucção, agitação.",
        links: [],
      },
      {
        id: "como-saber-se-o-bebe-esta-mamando-bem",
        title: "Como Saber se o Bebê Está Mamando Bem?",
        text: "O bebê está mamando bem quando: mama em livre demanda (8 ou mais vezes por dia), ganha peso de forma adequada, urina várias vezes ao dia com urina clara, faz cocô pastoso e amarelado após as mamadas, demonstra estar satisfeito após mamar e dorme tranquilo. Choro frequente não significa, por si só, que o leite é insuficiente. Consultas regulares com o pediatra ajudam a acompanhar esse processo.",
        links: [],
      },
      {
        id: "almofada-de-amamentacao",
        title: "Almofada de Amamentação",
        text: "Ajuda a manter a postura e colocar a criança na altura ideal, aumentando o conforto e auxiliando a posição adequada durante a mamada.",
        links: [],
      },
      {
        id: "sutia-de-amamentacao",
        title: "Sutiã de Amamentação",
        text: "Escolha um sutiã confortável, sem compressão abaixo da borda. Sutiãs que tenham abertura pela frente facilitam a amamentação e o acesso rápido.",
        links: [],
      },
      {
        id: "bombas-extratoras",
        title: "Bombas Extratoras",
        text: "São um bom acessório para quando o leite precisa ser armazenado — como na volta ao trabalho. Pode ser manual ou elétrica: a melhor opção é a que você se adapta e se sente mais confortável.",
        links: [],
      },
      {
        id: "tipoias-de-amamentacao",
        title: "Tipoias de Amamentação",
        text: "Ajudam na sustentação de seios volumosos ou pesados. Permitem que a mãe mantenha as mãos livres, facilitando a pega e o posicionamento do bebê.",
        links: [],
      },
      {
        id: "rosquinhas-de-amamentacao",
        title: "Rosquinhas de Amamentação",
        text: "São rosquinhas feitas de tecido usadas dentro do sutiã/top. Auxiliam na prevenção de fissuras, pois garantem que o mamilo e a aréola fiquem suspensos e não em contato direto com o tecido, mantendo a região seca. Protegem mamilos machucados evitando atrito constante. IMPORTANTE: as rosquinhas podem ficar úmidas com o leite, por isso devem ser lavadas e trocadas com frequência.",
        links: [],
      },
      {
        id: "conchas-e-absorventes-atencao",
        title: "Conchas e Absorventes (Atenção!)",
        text: "Embora pareçam práticos, costumam deixar os mamilos úmidos, aumentando a chance de lesões e contaminação por bactérias e fungos. NÃO são recomendados — prefira as rosquinhas de amamentação.",
        links: [],
      },
      {
        id: "desafios-comuns",
        title: "Desafios Comuns",
        text: "Ingurgitamento, mastite e mamilos doloridos são frequentes. Na maioria dos casos, corrigir a pega resolve as dores. Para ingurgitamento, amamente com frequência. Em caso de mastite (seio vermelho, duro e febre), consulte um médico.",
        links: [],
      },
      {
        id: "por-quanto-tempo-amamentar",
        title: "Por Quanto Tempo Amamentar?",
        text: "A OMS recomenda amamentação exclusiva até os 6 meses e complementar até os 2 anos ou mais. O desmame natural ocorre quando mãe e bebê estão prontos. Qualquer período de amamentação já traz benefícios importantes.",
        links: [],
      },
    ],
  },
  {
    id: "alimentacao",
    name: "Introdução Alimentar",
    title: "Introdução Alimentar",
    description:
      "Sabores, texturas e hábitos para uma relação saudável com a comida.",
    icon: Utensils,
    color: "text-amber-600",
    sections: [
      {
        id: "quando-comecar",
        title: "Quando Começar",
        text: "A introdução alimentar começa aos 6 meses completos, com sinais de prontidão: sentar com apoio, interesse pela comida dos adultos e ausência do reflexo de extrusão (não empurra a comida com a língua). Não inicie antes dos 4 meses.",
        links: [],
      },
      {
        id: "primeiros-alimentos",
        title: "Primeiros Alimentos",
        text: "Ofereça variedade desde o início: cereais (arroz, macarrão), leguminosas (feijão, lentilha), carnes (frango, boi, peixe), legumes (batata, cenoura, abobrinha) e frutas. Base: comida da família adaptada em textura.",
        links: [],
      },
      {
        id: "blw-e-papinha-tradicional",
        title: "BLW e Papinha Tradicional",
        text: "No BLW, o bebê come pedaços macios sozinho, desenvolvendo autonomia. Na papinha, começa com purês e avança para pedaços. Ambos são válidos — muitas famílias combinam os dois métodos.",
        links: [],
      },
      {
        id: "alimentos-a-evitar-ate-2-anos",
        title: "Alimentos a Evitar até 2 anos",
        text: "Evite: açúcar, mel (risco de botulismo), sal em excesso, refrigerantes, sucos industrializados e ultraprocessados. Leite de vaca como bebida principal deve ser evitado até 1 ano.",
        links: [],
      },
      {
        id: "alergias-alimentares",
        title: "Alergias Alimentares",
        text: "Introduza alimentos alergênicos (ovo, amendoim, peixe, trigo, soja) um por vez com dias de intervalo. Sinais de alergia: urticária, vômitos, diarreia, inchaço. Reação grave (dificuldade de respirar): acione o SAMU (192) imediatamente.",
        links: [],
      },
      {
        id: "formulas-infantis-quando-usar",
        title: "Fórmulas Infantis: Quando Usar?",
        text: "A fórmula infantil é indicada quando a amamentação não é possível ou insuficiente — por decisão da mãe, condição médica ou impossibilidade de produção de leite. Nunca substitua a fórmula por leite de vaca antes dos 12 meses. A decisão deve ser orientada pelo pediatra, que indicará o tipo adequado para cada bebê.",
        links: [],
      },
      {
        id: "formulas-infantis-tipos",
        title: "Fórmulas Infantis: Tipos",
        text: "Fórmula de partida (fase 1): indicada de 0 a 6 meses. Fórmula de seguimento (fase 2): de 6 a 12 meses. Fórmula de crescimento (fase 3): de 12 a 24 meses. Existem ainda fórmulas especiais: sem lactose (para intolerância), fórmula extensamente hidrolisada ou de aminoácidos (para alergia à proteína do leite de vaca — APLV), e fórmulas para prematuros. Sempre siga a indicação do pediatra.",
        links: [],
      },
      {
        id: "formulas-infantis-preparo-e-higiene",
        title: "Fórmulas Infantis: Preparo e Higiene",
        text: "Use sempre água filtrada ou fervida e resfriada para preparo. Siga rigorosamente a proporção indicada na embalagem — fórmula mais concentrada ou diluída pode ser prejudicial. Prepare apenas o necessário para cada mamada. A mamadeira e o bico devem ser esterilizados regularmente (água fervente por 5 minutos). Armazene fórmula preparada na geladeira por no máximo 24 horas. Descarte qualquer sobra após a mamada.",
        links: [],
      },
      {
        id: "alimentacao-complementar-12-24-meses",
        title: "Alimentação Complementar (12-24 meses)",
        text: "A partir dos 12 meses, o bebê pode fazer a transição gradual para a comida da família. Mantenha a amamentação complementar sempre que possível. Nessa fase, é comum a seletividade alimentar (picky eater) — ofereça variedade sem pressão. Inclua lanches saudáveis entre as refeições: frutas, iogurte natural, queijo, legumes cozidos. Evite ultraprocessados, açúcar e sal em excesso.",
        links: [],
      },
    ],
  },
  {
    id: "sono",
    name: "Sono",
    title: "Sono",
    description:
      "Entenda o sono do bebê e prepare um ambiente seguro para descansar.",
    icon: Moon,
    color: "text-indigo-600",
    sections: [
      {
        id: "como-e-o-sono-do-bebe",
        title: "Como é o Sono do Bebê",
        text: "Os ciclos de sono do bebê duram ~45 min (vs. 90 min do adulto), com mais tempo em sono leve. Por isso acordam facilmente entre ciclos. Até os 4-6 meses, acordar para mamar à noite é fisiologicamente normal.",
        links: [],
      },
      {
        id: "ambiente-seguro-para-dormir",
        title: "Ambiente Seguro para Dormir",
        text: "O bebê deve dormir no mesmo quarto dos pais, mas evite cama compartilhada. A posição correta é de barriga para cima — sempre. Cuide para que o rosto não seja encoberto por lençóis ou cobertores. Vestir o bebê com camadas de roupas é preferível ao uso de cobertas. Sacos de dormir vestíveis também podem ser usados — devem deixar cabeça e braços livres. Tudo que for macio ou solto é risco e deve ser removido: sem bichos de pelúcia, almofadas, travesseiros, protetores de berço ou edredons. Use lençóis de elástico presos ao colchão.",
        links: [],
      },
      {
        id: "rotinas-de-sono",
        title: "Rotinas de Sono",
        text: "Uma rotina previsível ajuda o bebê a entender que é hora de dormir: banho, massagem, amamentação, leitura e música calma. A consistência importa mais que a sequência. A partir dos 3-4 meses já é possível estabelecer uma rotina noturna.",
        links: [],
      },
      {
        id: "regressoes-de-sono",
        title: "Regressões de Sono",
        text: "Regressões são períodos de piora do sono associados a saltos de desenvolvimento. As mais comuns: 4 meses (mais intensa), 8-10 meses, 12 meses e 18 meses. São temporárias (2-6 semanas). Manter a rotina e oferecer mais acolhimento ajuda.",
        links: [],
      },
      {
        id: "sonecas-diurnas",
        title: "Sonecas Diurnas",
        text: "Recém-nascidos dormem 4-5 vezes ao dia; aos 6 meses, 2-3 sonecas; aos 12-18 meses, 1-2 sonecas. A última soneca deve terminar ao menos 2h antes de dormir à noite. Por volta dos 2-3 anos a maioria abandona as sonecas naturalmente.",
        links: [],
      },
      {
        id: "ruido-branco",
        title: "Ruído Branco",
        text: 'O ruído branco é um som contínuo e uniforme (como chuva, ventilador ou máquinas específicas) que imita os sons do ambiente intrauterino. Pode ajudar a acalmar bebês agitados e a manter o sono mais estável ao "mascarar" ruídos externos do ambiente. Como usar com segurança: mantenha o volume baixo (no máximo 50 decibéis — como uma conversa normal), coloque a fonte sonora a pelo menos 1 metro do bebê e evite uso contínuo por tempo prolongado. Não é obrigatório — é apenas uma ferramenta auxiliar.',
        links: [],
      },
    ],
  },
  {
    id: "desenvolvimento",
    name: "Desenvolvimento",
    title: "Desenvolvimento",
    description:
      "Acompanhe as descobertas e incentive o desenvolvimento com carinho.",
    icon: Baby,
    color: "text-pink-600",
    sections: [
      {
        id: "0-a-3-meses",
        title: "0 a 3 meses",
        text: "Reflexo de Moro (susto com sons altos), reconhece a voz dos pais, foca objetos a 20-30 cm, sorriso social por volta de 6-8 semanas, arrulhos e sustentação breve da cabeça de bruços.",
        links: [],
      },
      {
        id: "4-a-6-meses",
        title: "4 a 6 meses",
        text: "Sustenta bem a cabeça, rola (4-5 meses), ri alto, reconhece rostos familiares, alcança e segura objetos, leva tudo à boca, começa a sentar com apoio.",
        links: [],
      },
      {
        id: "7-a-12-meses",
        title: "7 a 12 meses",
        text: 'Senta sem apoio (7-8 meses), engatinha (8-10 meses), fica em pé com apoio (9-11 meses), imita sons e gestos, entende "não", faz pinça, primeiros passos (10-14 meses).',
        links: [],
      },
      {
        id: "13-a-24-meses",
        title: "13 a 24 meses",
        text: "Anda com segurança (15-18 meses), aponta para o que quer, fala 10-50 palavras aos 18 meses, combina duas palavras aos 24 meses, brincadeiras de faz-de-conta e fase das birras.",
        links: [],
      },
      {
        id: "sinais-de-atencao",
        title: "Sinais de Atenção",
        text: "Consulte o pediatra se: sem sorriso social até 3 meses, sem sons até 6 meses, não senta até 9 meses, não anda até 18 meses, perde habilidades já adquiridas ou não faz contato visual. A identificação precoce é fundamental.",
        links: [],
      },
      {
        id: "dicas-de-estimulo-0-6-meses",
        title: "Dicas de Estímulo: 0-6 meses",
        text: "Converse e cante para o bebê — ele reconhece a sua voz desde antes de nascer. Faça contato visual e imite suas expressões. Tummy time (tempo de bruços) com supervisão fortalece pescoço e prepara para rolar. Ofereça chocalhos e objetos coloridos a cerca de 20-30 cm do rosto. Passeios ao ar livre estimulam os sentidos. Massagens suaves fortalecem o vínculo.",
        links: [],
      },
      {
        id: "dicas-de-estimulo-7-24-meses",
        title: "Dicas de Estímulo: 7-24 meses",
        text: "7-12 meses: esconde-esconde, brinquedos de encaixe, bater palmas, imitar sons e gestos, explorar diferentes texturas. 13-24 meses: livros com figuras e texturas, brincadeiras de faz-de-conta, blocos de montar, música e dança. A leitura compartilhada desde bebê é uma das melhores formas de estimular linguagem e vínculo afetivo — qualquer livro é bem-vindo.",
        links: [],
      },
      {
        id: "uso-de-telas-o-que-diz-a-ciencia",
        title: "Uso de Telas: O que diz a Ciência",
        text: 'A Sociedade Brasileira de Pediatria (SBP) recomenda: ZERO telas para crianças até 2 anos. A exposição precoce está associada a prejuízos no desenvolvimento da linguagem, qualidade do sono, capacidade de atenção e habilidades sociais. Isso inclui TV ao fundo, celular para "acalmar" e videochamadas longas. A melhor tela para um bebê é o rosto dos seus cuidadores.',
        links: [],
      },
      {
        id: "alternativas-as-telas",
        title: "Alternativas às Telas",
        text: "Em vez de telas: leia livros com figuras, brinque com objetos simples do cotidiano (panelas, colheres, potes), ofereça brincadeiras sensoriais (areia, água, massinha atóxica), ouça músicas e cantigas, faça passeios ao ar livre. Ruído branco pode ser uma alternativa para acalmar o bebê sem estimulação visual de telas.",
        links: [],
      },
    ],
  },
  {
    id: "vacinas",
    name: "Vacinas",
    title: "Vacinas",
    description:
      "Proteção desde o início e orientações para acompanhar a vacinação.",
    icon: Shield,
    color: "text-teal-600",
    sections: [
      {
        id: "por-que-vacinar",
        title: "Por que Vacinar?",
        text: "As vacinas protegem contra doenças graves que podem causar sequelas permanentes ou ser fatais. A vacinação em massa cria imunidade de rebanho, protegendo também quem não pode ser vacinado.",
        links: [],
      },
      {
        id: "calendario-sus-0-24-meses",
        title: "Calendário SUS (0-24 meses)",
        text: "Ao nascer: BCG e Hepatite B. 2 meses: Pentavalente, VIP, Pneumocócica 10v, Rotavírus. 3 meses: Meningocócica C. 4 meses: Pentavalente, VIP, Pneumocócica, Rotavírus. 6 meses: Pentavalente, VIP, Influenza. 9 meses: Febre Amarela. 12 meses: Tríplice Viral, Pneumocócica (reforço). 15 meses: DTP, VOP, Meningocócica C (reforços), Varicela.",
        links: [],
      },
      {
        id: "cuidados-antes-e-depois",
        title: "Cuidados Antes e Depois",
        text: "Antes: o bebê não precisa de jejum; verifique se não tem febre (contraindicação temporária). Depois: mantenha o local limpo e seco. Em injetáveis, massageie levemente o local. Observe o bebê nas horas seguintes.",
        links: [],
      },
      {
        id: "reacoes-esperadas",
        title: "Reações Esperadas",
        text: "Reações leves passam em 1-3 dias: dor, vermelhidão e inchaço no local, febre baixa (até 38°C), irritabilidade e sonolência. Para o desconforto: compressa fria e antitérmico na dose indicada pelo pediatra.",
        links: [],
      },
      {
        id: "quando-procurar-ajuda",
        title: "Quando Procurar Ajuda",
        text: "Procure atendimento se: febre acima de 39°C, choro inconsolável por mais de 3h, convulsões, dificuldade para respirar ou reação alérgica grave (inchaço no rosto, urticária generalizada). Reações graves são raríssimas.",
        links: [],
      },
    ],
  },
  {
    id: "saude",
    name: "Saúde e Doenças",
    title: "Saúde e Doenças",
    description:
      "Cuidados com a saúde e sinais que merecem atenção no dia a dia.",
    icon: Stethoscope,
    color: "text-red-600",
    sections: [
      {
        id: "febre-o-que-fazer",
        title: "Febre: O que Fazer",
        text: "Febre é temperatura acima de 37,8°C axilar. Em bebês até 3 meses, qualquer febre exige atendimento imediato. Em maiores de 3 meses, abaixo de 38,5°C geralmente não precisa de medicação — mantenha hidratação. Nunca use AAS (Aspirina) em crianças.",
        links: [],
      },
      {
        id: "colicas-e-gases",
        title: "Cólicas e Gases",
        text: 'Afetam ~20% dos bebês, com choro intenso geralmente à tarde/noite. Melhora após 3-4 meses. Ajuda: "posição do aviãozinho" (barriga para baixo no colo), massagem abdominal em sentido horário e calor moderado na barriga.',
        links: [],
      },
      {
        id: "refluxo",
        title: "Refluxo",
        text: "Regurgitar é normal — o esfíncter esofágico ainda é imaturo. Torna-se patológico quando há choro intenso, recusa ao peito, arqueamento do corpo, tosse crônica ou ganho de peso insatisfatório. Nesses casos, consulte o pediatra.",
        links: [],
      },
      {
        id: "resfriados-e-gripes",
        title: "Resfriados e Gripes",
        text: "Bebês podem ter 8-10 resfriados por ano. Alívio: soro fisiológico nasal, umidificador e hidratação. Não use descongestionantes ou xaropes sem prescrição. Em menores de 2 meses com febre ou dificuldade respiratória, vá ao pronto-socorro.",
        links: [],
      },
      {
        id: "quando-ir-ao-medico-imediatamente",
        title: "Quando Ir ao Médico Imediatamente",
        text: "Urgência: qualquer febre em menores de 3 meses, dificuldade respiratória, lábios azulados, convulsão, sonolência extrema, recusa total de alimento por 8h+, vômitos em jato repetidos, fezes com sangue ou sinais de desidratação.",
        links: [],
      },
    ],
  },
  {
    id: "pais",
    name: "Cuidando dos Pais",
    title: "Cuidando dos Pais",
    description: "O bem-estar de quem cuida também precisa de cuidado.",
    icon: Users,
    color: "text-purple-600",
    sections: [
      {
        id: "o-impacto-emocional-da-parentalidade",
        title: "O Impacto Emocional da Parentalidade",
        text: "Ser pai ou mãe é uma das experiências mais transformadoras e exigentes da vida. Sentir exaustão, sobrecarga, culpa e ansiedade é completamente normal. Esses sentimentos não fazem de você um mau pai ou mãe — eles fazem de você humano.",
        links: [],
      },
      {
        id: "baby-blues-e-depressao-pos-parto",
        title: "Baby Blues e Depressão Pós-Parto",
        text: "O baby blues afeta até 80% das mães nos primeiros dias (choro, tristeza, irritabilidade) e passa em até 2 semanas. A depressão pós-parto é mais intensa e duradoura: tristeza profunda, desinteresse pelo bebê e insônia. É tratável — busque ajuda sem hesitar.",
        links: [],
      },
      {
        id: "a-importancia-do-sono-para-os-pais",
        title: "A Importância do Sono para os Pais",
        text: "A privação de sono impacta diretamente a saúde mental. Estratégias: turno noturno (um pai por vez), durma quando o bebê dorme, aceite ajuda de familiares, priorize o sono sobre tarefas domésticas. Não dirija com sonolência extrema.",
        links: [],
      },
      {
        id: "divisao-de-tarefas-e-rede-de-apoio",
        title: "Divisão de Tarefas e Rede de Apoio",
        text: 'Ambos os cuidadores são capazes de cuidar do bebê. Divida tarefas para evitar sobrecarga. Aceite ajuda e seja específico: "pode ficar com o bebê 2 horas enquanto descanso?". Uma rede de apoio sólida é fundamental para o bem-estar de todos.',
        links: [],
      },
      {
        id: "autocuidado-nao-e-luxo",
        title: "Autocuidado Não é Luxo",
        text: "Você cuida melhor do seu filho quando está bem. Reserve momentos para você, mantenha consultas médicas em dia e peça apoio psicológico se necessário. Seu pediatra pode indicar profissionais de saúde mental especializados em pós-parto.",
        links: [],
      },
    ],
  },
  {
    id: "higiene",
    name: "Higiene e Cuidados Diários",
    title: "Higiene e Cuidados Diários",
    description:
      "Banho, fraldas e pequenos cuidados que fazem parte da rotina.",
    icon: Droplets,
    color: "text-cyan-600",
    sections: [
      {
        id: "banho-do-bebe-preparacao-e-seguranca",
        title: "Banho do Bebê: Preparação e Segurança",
        text: "Antes de começar, aqueça bem o ambiente — bebês perdem calor facilmente. Deixe tudo à mão: toalha, fralda limpa, roupinhas e produtos de higiene. Teste sempre a temperatura da água: deve estar entre 36,9°C e 37,5°C — use seu cotovelo ou um termômetro.",
        links: [],
      },
      {
        id: "banho-do-bebe-o-momento-do-banho",
        title: "Banho do Bebê: O Momento do Banho",
        text: "Para o banho de imersão, coloque o bebê na banheira com água até a cintura. Uma dica é colocá-lo enrolado na fraldinha e ir desenrolando devagar. Use apenas produtos suaves, hipoalergênicos e feitos para a pele do bebê. Para lavar o couro cabeludo, use a quantidade de um pequeno círculo (como uma moeda), faça movimentos suaves, enxágue bem e seque com toques suaves — nunca esfregue e jamais use secador.",
        links: [],
      },
      {
        id: "banho-do-bebe-cuidados-finais",
        title: "Banho do Bebê: Cuidados Finais",
        text: "Não se preocupe em retirar o vérnix (camadinha esbranquiçada) — ela hidrata, protege e será naturalmente reabsorvida. Ao tirar o bebê da água, seque com toques gentis usando toalha macia e bem seca. Crie um ambiente de carinho: coloque música calma e converse ou cante durante o banho.",
        links: [],
      },
      {
        id: "cuidados-com-o-coto-umbilical",
        title: "Cuidados com o Coto Umbilical",
        text: "Mantenha o coto limpo e seco. Não é necessário usar álcool ou nenhum produto — água limpa e secagem cuidadosa são suficientes na maioria dos casos. O coto cai sozinho entre 7 e 21 dias. Procure o pediatra se houver vermelhidão ao redor, cheiro forte, secreção ou sangramento.",
        links: [],
      },
      {
        id: "troca-de-fraldas-e-prevencao-de-assaduras",
        title: "Troca de Fraldas e Prevenção de Assaduras",
        text: "Troque a fralda com frequência — ao menos a cada 2-3 horas ou sempre que estiver suja. Limpe de frente para trás com toalhinha umedecida sem perfume. Para prevenir assaduras: mantenha a área seca, use creme de barreira (óxido de zinco) em cada troca e deixe o bebê um tempo sem fralda ao dia. Assaduras persistentes ou com aspecto de candidíase (fungal) requerem tratamento específico.",
        links: [],
      },
      {
        id: "higiene-das-unhas",
        title: "Higiene das Unhas",
        text: "As unhas do recém-nascido são finas e podem ser compridas ao nascer. Inicialmente, lixe com lixas suaves para bebês. Após, faça um corte reto com tesoura sem ponta. Higienize suas mãos e os materiais antes. Escolha um momento em que o bebê esteja calmo ou adormecido. Se cortar além do desejado, lave com sabão neutro e aplique leve pressão com gaze limpa. Unha encravada (bordas inflamadas): interrompa o corte e consulte o pediatra.",
        links: [],
      },
      {
        id: "higiene-oral-antes-dos-dentes",
        title: "Higiene Oral: Antes dos Dentes",
        text: "Antes dos primeiros dentes, não é necessário fazer higiene bucal especial — a gengiva se limpa naturalmente. Fique atento ao surgimento do primeiro dente para iniciar os cuidados.",
        links: [],
      },
      {
        id: "higiene-oral-com-os-primeiros-dentes",
        title: "Higiene Oral: Com os Primeiros Dentes",
        text: "Desde a primeira pontinha de dente, inicie a escovação com escova macia ou extra macia, cabeça pequena. Use pasta com flúor (mínimo 1100 ppm — verifique nos ingredientes), na quantidade de um grão de arroz. Escove pelo menos 2x ao dia: manhã e antes de dormir. A escovação deve ser feita por um adulto. Fio dental: use se os dentes estiverem muito juntos.",
        links: [],
      },
      {
        id: "primeira-consulta-com-o-dentista",
        title: "Primeira Consulta com o Dentista",
        text: "Quando surgirem os primeiros dentes, agende uma consulta com odontopediatra. O dentista recomendará dieta e práticas adequadas para a saúde oral e é importante o bebê se familiarizar com o ambiente odontológico. Dica: uma alimentação saudável e rica em nutrientes ajuda na formação dos dentes — evite açúcar e ultraprocessados.",
        links: [],
      },
    ],
  },
  {
    id: "acidentes",
    name: "Segurança e Prevenção de Acidentes",
    title: "Segurança e Prevenção de Acidentes",
    description:
      "Prepare a casa e os passeios para explorar o mundo com segurança.",
    icon: AlertTriangle,
    color: "text-orange-600",
    sections: [
      {
        id: "por-que-prevenir-acidentes",
        title: "Por que Prevenir Acidentes?",
        text: "Acidentes domésticos são a principal causa de morte de crianças de 0 a 14 anos no Brasil, e muitos podem ser facilmente evitados com medidas simples e atenção redobrada. Cuidar é também antecipar e prevenir.",
        links: [],
      },
      {
        id: "prevenindo-quedas",
        title: "Prevenindo Quedas",
        text: "Nunca deixe o bebê sozinho em superfícies elevadas — mesmo que ainda não role. No trocador, mantenha sempre uma mão firme no bebê. Se a campainha ou telefone tocar, leve o bebê consigo ou coloque-o no berço. Não use almofadas como barreiras nas laterais da cama — são risco de sufocamento. Cadeirinhas e bebê confortos nunca devem ser colocados em superfícies elevadas. Se a casa tiver escadas, use portões de segurança firmemente instalados.",
        links: [],
      },
      {
        id: "casa-segura",
        title: "Casa Segura",
        text: "Evite contato da criança com peças e objetos pequenos. Certifique-se de que brinquedos são apropriados para a idade e não têm peças que possam ser engolidas. Remédios, produtos de limpeza e cosméticos devem ficar em armários altos e trancados. Nunca deixe sacos plásticos, cordões ou fios próximos ao bebê. Use protetores nas tomadas. Nunca segure o bebê no colo enquanto bebe líquidos quentes. Nunca deixe cabos de panela voltados para fora do fogão. Use travas em armários e gavetas com itens perigosos. Nunca deixe baldes ou bacias com água no chão. Mantenha a tampa do vaso sanitário fechada. Nunca use talco ou produtos em pó na criança.",
        links: [],
      },
      {
        id: "seguranca-no-carro",
        title: "Segurança no Carro",
        text: "A cadeirinha é obrigatória por lei e salva vidas. Ela deve ser instalada corretamente, de costas para o sentido do movimento até os 2 anos (ou até atingir o limite de peso da cadeirinha). Nunca coloque a cadeirinha virada para frente antes do tempo indicado. Leia o manual da cadeirinha e, se possível, peça a um técnico para verificar a instalação.",
        links: [],
      },
      {
        id: "prevencao-de-engasgo",
        title: "Prevenção de Engasgo",
        text: "Evite oferecer alimentos redondos inteiros (uva, tomate-cereja, azeitona), alimentos duros sem cozinhar adequadamente e objetos pequenos ao alcance. Cortes seguros: uva ao meio (no sentido do comprimento), salsichas em quartos longitudinais. Na introdução alimentar, adapte sempre a textura à idade. Mantenha objetos pequenos (moedas, botões, baterias) fora do alcance.",
        links: [],
      },
      {
        id: "manobra-de-desengasgo",
        title: "Manobra de Desengasgo",
        text: "Se o bebê engasgar e não conseguir respirar: em menores de 1 ano, segure-o de bruços sobre seu antebraço e dê até 5 tapinhas firmes nas costas (entre as omoplatas) com a palma da mão. Depois vire-o de costas e faça até 5 compressões no peito com 2 dedos. Repita até o objeto sair ou o bebê conseguir respirar. Se perder a consciência, acione o SAMU (192) e inicie RCP. Procure um curso de primeiros socorros para bebês.",
        links: [],
      },
    ],
  },
  {
    id: "licencas",
    name: "Licenças Maternidade e Paternidade",
    title: "Licenças Maternidade e Paternidade",
    description: "Informações sobre direitos e os primeiros dias em família.",
    icon: FileText,
    color: "text-blue-600",
    sections: [
      {
        id: "licenca-maternidade-duracao",
        title: "Licença-Maternidade: Duração",
        text: "A licença-maternidade dura 120 dias. Esse período vale tanto para parto quanto para adoção ou guarda judicial. Em caso de aborto não criminoso, a licença é de 14 dias. Se a empresa participa do Programa Empresa Cidadã, a licença pode ser prorrogada de 120 para 180 dias (60 dias extras).",
        links: [],
      },
      {
        id: "licenca-maternidade-inicio-e-salario",
        title: "Licença-Maternidade: Início e Salário",
        text: "A lei permite iniciar a licença até 28 dias antes da data prevista para o parto — o médico informa a data provável e autoriza o início antecipado. O salário-maternidade da empregada com carteira assinada é pago diretamente pela empresa, que depois compensa os valores junto ao INSS. Não existe carência mínima: basta ter uma contribuição válida antes do parto.",
        links: [],
      },
      {
        id: "licenca-maternidade-como-pedir",
        title: "Licença-Maternidade: Como Pedir",
        text: "Para empregadas com carteira assinada, o pedido é feito diretamente pela empresa. Documentos normalmente exigidos: documento com foto, atestado médico com data provável do parto (para início antecipado), certidão de nascimento (após o parto) e termo de guarda ou adoção, se for o caso.",
        links: [],
      },
      {
        id: "licenca-paternidade-duracao-e-pagamento",
        title: "Licença-Paternidade: Duração e Pagamento",
        text: "A licença-paternidade é de 5 dias corridos. Se a empresa participa do Programa Empresa Cidadã, pode ser de 20 dias corridos. Começa a contar no dia do nascimento do filho (desde que seja dia útil). Os dias são pagos pela empresa como parte da remuneração normal do empregado. Não existe requerimento no INSS para esse benefício.",
        links: [],
      },
      {
        id: "licenca-paternidade-como-pedir",
        title: "Licença-Paternidade: Como Pedir",
        text: "O colaborador deve: informar o nascimento ao RH imediatamente e entregar a certidão de nascimento da criança. Documentos necessários: certidão de nascimento da criança e documento pessoal com foto.",
        links: [],
      },
    ],
  },
];

export interface TopicSearchResult {
  topic: Topic;
  /** Ausente quando a correspondência é no título/descrição do tema. */
  section?: TopicSection;
  excerpt: string;
}

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function excerptAroundMatch(text: string, terms: string[]): string {
  const normalized = normalizeSearch(text);
  const positions = terms
    .map((term) => normalized.indexOf(term))
    .filter((index) => index >= 0);
  const match = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, match - 48)) + 1);
  const end = Math.min(text.length, start + 180);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/** All words must match, regardless of accents/case or their order. */
export function searchTopics(query: string): TopicSearchResult[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return topics
    .flatMap((topic) => {
      const title = normalizeSearch(`${topic.name} ${topic.title}`);
      const metadata = normalizeSearch(
        `${topic.name} ${topic.title} ${topic.description}`,
      );
      const results: TopicSearchResult[] = [];
      if (terms.every((term) => metadata.includes(term))) {
        results.push({ topic, excerpt: topic.description });
      }
      for (const section of topic.sections) {
        const content = normalizeSearch(
          `${topic.name} ${topic.title} ${section.title} ${section.text}`,
        );
        if (terms.every((term) => content.includes(term))) {
          results.push({
            topic,
            section,
            excerpt: excerptAroundMatch(section.text, terms),
          });
        }
      }
      // Put topic-title matches first, then direct section-title matches.
      return results.map((result) => ({
        result,
        priority:
          !result.section && terms.every((term) => title.includes(term))
            ? 0
            : result.section &&
                terms.every((term) =>
                  normalizeSearch(result.section!.title).includes(term),
                )
              ? 1
              : 2,
      }));
    })
    .sort((a, b) => a.priority - b.priority)
    .map(({ result }) => result);
}
