
import { SimulationQuestion } from './types';

export const COMPETENCIES_INFO = {
  C1: "Domínio da norma culta da língua escrita.",
  C2: "Compreender a proposta de redação e aplicar conceitos de várias áreas de conhecimento.",
  C3: "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos.",
  C4: "Conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.",
  C5: "Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos."
};

export const MOCK_QUESTIONS: SimulationQuestion[] = [
  {
    id: 1,
    question: "Sobre o Humanismo, é correto afirmar que:",
    options: [
      "Foca exclusivamente na religião e no teocentrismo.",
      "Representa a transição entre a Idade Média e o Renascimento.",
      "Nega qualquer valor à cultura clássica grega.",
      "Surgiu durante a Revolução Industrial na Inglaterra."
    ],
    correctAnswer: 1,
    explanation: "O Humanismo é o período de transição que coloca o homem no centro das preocupações (antropocentrismo) após o período medieval.",
    // Added missing required properties for SimulationQuestion interface
    subject: "História",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "Na fotossíntese, em qual parte da célula ocorre a fase clara?",
    options: [
      "No estroma do cloroplasto.",
      "No citoplasma celular.",
      "Nos tilacoides do cloroplasto.",
      "Na matriz mitocondrial."
    ],
    correctAnswer: 2,
    explanation: "A fase clara (fotoquímica) ocorre nas membranas dos tilacoides, onde se localiza a clorofila.",
    // Added missing required properties for SimulationQuestion interface
    subject: "Biologia",
    difficulty: "easy"
  }
];

export const PROBABLE_THEMES = [
  {
    title: "Inclusão digital de idosos no Brasil",
    description: "Desafios para integrar a terceira idade na era da informação e combate ao isolamento social."
  },
  {
    title: "Os impactos da IA no mercado de trabalho nacional",
    description: "Equilíbrio entre inovação tecnológica e preservação de empregos tradicionais."
  },
  {
    title: "Crise hídrica e segurança alimentar",
    description: "A relação entre a preservação ambiental e a capacidade produtiva do agronegócio."
  },
  {
    title: "A persistência do estigma associado às doenças mentais",
    description: "Necessidade de políticas públicas de acolhimento e desconstrução de preconceitos."
  }
];
