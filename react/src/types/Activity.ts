export type Activity = {
  id: string;
  type: string;
  name: string;
  user: string;
  total?: number;
  cycle?: number;
} & (
  | {
      current: number;
    }
  | {
      left: number;
    }
);

export function getIcon({ type }: Activity): string {
  switch (type) {
    case "climbing":
      return "🧗";
    case "horse-riding":
      return "🏇";
    case "dance":
      return "💃";
    case "karate":
      return "🥷";
    case "swimming":
      return "🏊‍♀️";
    case "music":
      return "🎵";
  }
  return "";
}
