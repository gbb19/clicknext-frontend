type BoardCardProps = {
  board_id: number;
  title: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string; // <-- ตรงนี้
  onClick: (id: number) => void;
  color: "green" | "blue"; // เพิ่ม!
};

export default function BoardCard({
  board_id,
  title,
  description,
  created_at,
  updated_at,
  onClick,
  color,
}: BoardCardProps) {
  return (
    <div
      className={`rounded-lg p-6 shadow-md transition-shadow duration-300 hover:shadow-lg cursor-pointer h-60 transform active:scale-95 flex flex-col ${
        color === "green" ? "bg-green-100" : "bg-blue-100"
      }`}
      onClick={() => onClick(board_id)}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-sm text-gray-500">
            Created: {new Date(created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-gray-600 flex-grow">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-end mt-auto">
        <span className="text-sm text-gray-700">
          Updated: {new Date(updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
