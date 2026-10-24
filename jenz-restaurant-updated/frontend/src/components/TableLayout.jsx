import TableCard from "./TableCard";

// Renders the restaurant floor plan. Table positions come from the backend
// (table.position.x / .y as % coordinates) so admins can rearrange the floor
// without touching frontend code. Falls back to a sensible layout if a table
// has no position saved yet.
const STATUS_STYLES = {
  available: "bg-cream border-gold text-charcoal hover:border-burgundy cursor-pointer",
  selected: "bg-burgundy border-burgundy text-cream scale-110 shadow-xl cursor-pointer",
  unavailable: "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60",
};

const shapeClass = {
  round: "rounded-full",
  square: "rounded-lg",
  rectangle: "rounded-lg",
  bench: "rounded-2xl",
};

const TableLayout = ({ tables, unavailableIds = [], selectedTableId, onSelect }) => {
  return (
    <div className="relative w-full aspect-[16/10] bg-[#efe8d8] border-4 border-charcoal rounded-xl overflow-hidden shadow-inner">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-charcoal/50">
        Window Area
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-charcoal/50">
        Entrance
      </div>

      {tables.map((table) => {
        const isUnavailable = unavailableIds.includes(table._id);
        const isSelected = selectedTableId === table._id;
        const status = isSelected ? "selected" : isUnavailable ? "unavailable" : "available";

        return (
          <TableCard
            key={table._id}
            table={table}
            status={status}
            statusClass={`${STATUS_STYLES[status]} ${shapeClass[table.shape] || "rounded-lg"}`}
            onClick={() => !isUnavailable && onSelect(table)}
          />
        );
      })}
    </div>
  );
};

export default TableLayout;
