// Tipos para os dados de comparação
export interface TeamComparisonData {
  teams: {
    time1: {
      id: number;
      nome: string;
      sigla: string;
      cor: string;
      logo: string;
      estatisticas: {
        passe?: any;
        corrida?: any;
        recepcao?: any;
        defesa?: any;
      };
      destaques: any;
    };
    time2: {
      id: number;
      nome: string;
      sigla: string;
      cor: string;
      logo: string;
      estatisticas: {
        passe?: any;
        corrida?: any;
        recepcao?: any;
        defesa?: any;
      };
      destaques: any;
    };
  };
}

export interface ChartDataSet {
  passeData: Array<{ name: string; [key: string]: any }>;
  corridaData: Array<{ name: string; [key: string]: any }>;
  recepcaoData: Array<{ name: string; [key: string]: any }>;
  defesaData: Array<{ name: string; [key: string]: any }>;
}

// Função principal para preparar dados dos gráficos
export const prepareChartData = (comparisonData: TeamComparisonData): ChartDataSet => {
  if (!comparisonData) {
    return { passeData: [], corridaData: [], recepcaoData: [], defesaData: [] };
  }

  const time1 = comparisonData.teams.time1;
  const time2 = comparisonData.teams.time2;

  return {
    passeData: preparePasseData(time1, time2),
    corridaData: prepareCorridaData(time1, time2),
    recepcaoData: prepareRecepcaoData(time1, time2),
    defesaData: prepareDefesaData(time1, time2)
  };
};

// Preparar dados de passe
const preparePasseData = (time1: any, time2: any) => [
  {
    name: "Passes Completos",
    [time1.nome]: time1.estatisticas.passe?.passes_completos || 0,
    [time2.nome]: time2.estatisticas.passe?.passes_completos || 0
  },
  {
    name: "Passes Tentados",
    [time1.nome]: time1.estatisticas.passe?.passes_tentados || 0,
    [time2.nome]: time2.estatisticas.passe?.passes_tentados || 0
  },
  {
    name: "TDs de Passe",
    [time1.nome]: time1.estatisticas.passe?.tds_passe || 0,
    [time2.nome]: time2.estatisticas.passe?.tds_passe || 0
  },
  {
    name: "Interceptações",
    [time1.nome]: time1.estatisticas.passe?.int_sofridas || 0,
    [time2.nome]: time2.estatisticas.passe?.int_sofridas || 0
  },
  {
    name: "Sacks Sofridos",
    [time1.nome]: time1.estatisticas.passe?.sacks_sofridos || 0,
    [time2.nome]: time2.estatisticas.passe?.sacks_sofridos || 0
  }
];

// Preparar dados de corrida
const prepareCorridaData = (time1: any, time2: any) => [
  {
    name: "Corridas",
    [time1.nome]: time1.estatisticas.corrida?.corridas || 0,
    [time2.nome]: time2.estatisticas.corrida?.corridas || 0
  },
  {
    name: "Jardas",
    [time1.nome]: time1.estatisticas.corrida?.jds_corridas || 0,
    [time2.nome]: time2.estatisticas.corrida?.jds_corridas || 0
  },
  {
    name: "TDs Corrida",
    [time1.nome]: time1.estatisticas.corrida?.tds_corridos || 0,
    [time2.nome]: time2.estatisticas.corrida?.tds_corridos || 0
  },
  {
    name: "Extra Point (1)",
    [time1.nome]: time1.estatisticas.corrida?.corrida_xp1 || 0,
    [time2.nome]: time2.estatisticas.corrida?.corrida_xp1 || 0
  },
  {
    name: "Extra Point (2)",
    [time1.nome]: time1.estatisticas.corrida?.corrida_xp2 || 0,
    [time2.nome]: time2.estatisticas.corrida?.corrida_xp2 || 0
  }
];

// Preparar dados de recepção
const prepareRecepcaoData = (time1: any, time2: any) => [
  {
    name: "Recepções",
    [time1.nome]: time1.estatisticas.recepcao?.recepcoes || 0,
    [time2.nome]: time2.estatisticas.recepcao?.recepcoes || 0
  },
  {
    name: "Alvos",
    [time1.nome]: time1.estatisticas.recepcao?.alvos || 0,
    [time2.nome]: time2.estatisticas.recepcao?.alvos || 0
  },
  {
    name: "Jardas",
    [time1.nome]: time1.estatisticas.recepcao?.jds_recepcao || 0,
    [time2.nome]: time2.estatisticas.recepcao?.jds_recepcao || 0
  },
  {
    name: "TDs Recepção",
    [time1.nome]: time1.estatisticas.recepcao?.tds_recepcao || 0,
    [time2.nome]: time2.estatisticas.recepcao?.tds_recepcao || 0
  },
  {
    name: "Drops",
    [time1.nome]: time1.estatisticas.recepcao?.drops || 0,
    [time2.nome]: time2.estatisticas.recepcao?.drops || 0
  }
];

// Preparar dados de defesa
const prepareDefesaData = (time1: any, time2: any) => [
  {
    name: "Flag Retirada",
    [time1.nome]: time1.estatisticas.defesa?.flag_retirada || 0,
    [time2.nome]: time2.estatisticas.defesa?.flag_retirada || 0
  },
  {
    name: "Sacks",
    [time1.nome]: time1.estatisticas.defesa?.sack || 0,
    [time2.nome]: time2.estatisticas.defesa?.sack || 0
  },
  {
    name: "Pressão",
    [time1.nome]: time1.estatisticas.defesa?.pressao || 0,
    [time2.nome]: time2.estatisticas.defesa?.pressao || 0
  },
  {
    name: "Interceptações",
    [time1.nome]: time1.estatisticas.defesa?.interceptacao_forcada || 0,
    [time2.nome]: time2.estatisticas.defesa?.interceptacao_forcada || 0
  },
  {
    name: "Passes Desviados",
    [time1.nome]: time1.estatisticas.defesa?.passe_desviado || 0,
    [time2.nome]: time2.estatisticas.defesa?.passe_desviado || 0
  }
];

// Função para calcular percentual de passes
export const calculatePassPercentage = (completos: number, tentados: number): string => {
  return tentados > 0 ? `${Math.round((completos / tentados) * 100)}%` : '0%';
};