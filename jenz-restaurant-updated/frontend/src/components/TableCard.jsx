import { Armchair } from "lucide-react";

// A single table placed absolutely on the floor plan at table.position.x/y (%)
const seatCountToChairs = (capacity) => Math.min(capacity, 8);

const TableCard = ({ table, statusClass, onClick }) => {
  const chairs = seatCountToChairs(table.capacity);
  const isBench = table.shape === "bench";

  return (
    <button
      onClick={onClick}
      style={{ left: `${table.position?.x ?? 50}%`, top: `${table.position?.y ?? 50}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
      title={`${table.tableNumber} — ${table.capacity} seats — ${table.location}`}
    >
      {!isBench && (
        <div className="flex gap-1 mb-2">
          {Array.from({ length: Math.ceil(chairs / 2) }).map((_, i) => (
            <Armchair key={i} size={12} className="text-charcoal/40" />
          ))}
        </div>
      )}

      <div
        className={`flex flex-col items-center justify-center border-2 font-semibold transition-all duration-200 ${statusClass} ${
          isBench ? "w-28 h-10" : "w-16 h-16"
        }`}
      >
        <span className="text-xs">{table.tableNumber}</span>
        <span className="text-[10px] opacity-80">{table.capacity} seats</span>
      </div>

      {!isBench && (
        <div className="flex gap-1 mt-1">
          {Array.from({ length: Math.floor(chairs / 2) }).map((_, i) => (
            <Armchair key={i} size={12} className="text-charcoal/40" />
          ))}
        </div>
      )}
    </button>
  );
};

export default TableCard;
