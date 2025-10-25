export const TASK_CATEGORIES = ["Work", "Personal", "Health", "Errands"] as const;

export const IMPACT_LEVELS = ["Low", "Medium", "High"] as const;

export const PRIORITY_LEVELS = ["P1", "P2", "P3"] as const;

export const CATEGORY_COLORS = {
  Work: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    hover: "hover:bg-blue-200",
  },
  Personal: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-800",
    hover: "hover:bg-purple-200",
  },
  Health: {
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-800",
    hover: "hover:bg-green-200",
  },
  Errands: {
    bg: "bg-orange-100",
    border: "border-orange-300",
    text: "text-orange-800",
    hover: "hover:bg-orange-200",
  },
};

export const IMPACT_COLORS = {
  Low: "text-gray-600",
  Medium: "text-yellow-600",
  High: "text-red-600",
};

export const PRIORITY_COLORS = {
  P1: "text-red-600 font-bold",
  P2: "text-orange-600 font-semibold",
  P3: "text-blue-600",
};

