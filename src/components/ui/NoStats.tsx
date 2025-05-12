// src/components/ui/NoStats.tsx
interface NoStatsProps {
  message?: string;
  subMessage?: string;
}

export const NoStats: React.FC<NoStatsProps> = ({ 
  message = "Sem estatísticas disponíveis",
  subMessage = "Nenhum dado encontrado para esta categoria"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
      <p className="text-gray-500 text-lg font-medium">{message}</p>
      <p className="text-gray-400 text-sm">{subMessage}</p>
    </div>
  )
}