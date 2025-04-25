import { statsExplanations } from "@/utils/statsExplanation"

export const StatsExplicacao: React.FC<{ type: string }> = ({ type }) => {
    const explanation = statsExplanations[type as keyof typeof statsExplanations]
    if (!explanation) return null
  
    return (
      <div className="bg-white rounded-lg p-4 mt-4 text-sm">
        <p className="font mb-2">{explanation.title}</p>
        <p className="mb-2">{explanation.description}</p>
        <p className="text-xs my-3">{explanation.totalPlayers}</p>
        <div className="text-xs">
          {explanation.tiers.map((tier, index) => (
            <p className="font-bold" key={index}>{tier}</p>
          ))}
        </div>
      </div>
    )
  }