type Activity = {
  id: string;
  type: string;
  name: string;
  user: string;
  current: number;
  cycle?: number;
  total: number;
};

export default Activity;

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
