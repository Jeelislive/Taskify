export const TASK_CATEGORIES = ["Work", "Personal", "Health", "Errands"] as const;

export const IMPACT_LEVELS = ["Low", "Medium", "High"] as const;

export const PRIORITY_LEVELS = ["P1", "P2", "P3"] as const;

export const CATEGORY_COLORS = {
  Work: {
    bg: "bg-blue-950/30",
    border: "border-blue-900",
    text: "text-blue-400",
    hover: "hover:border-blue-800",
    accent: "bg-blue-600",
  },
  Personal: {
    bg: "bg-purple-950/30",
    border: "border-purple-900",
    text: "text-purple-400",
    hover: "hover:border-purple-800",
    accent: "bg-purple-600",
  },
  Health: {
    bg: "bg-green-950/30",
    border: "border-green-900",
    text: "text-green-400",
    hover: "hover:border-green-800",
    accent: "bg-green-600",
  },
  Errands: {
    bg: "bg-orange-950/30",
    border: "border-orange-900",
    text: "text-orange-400",
    hover: "hover:border-orange-800",
    accent: "bg-orange-600",
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

