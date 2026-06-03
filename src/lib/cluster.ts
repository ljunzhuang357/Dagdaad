export interface ClusterStyle {
  emoji: string;
  gradient: string;
  accent: string;
}

const clusterStyles: Record<string, ClusterStyle> = {
  geluk: {
    emoji: "🌈",
    gradient: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
    accent: "#FFB74D",
  },
  dankbaarheid: {
    emoji: "🌻",
    gradient: "linear-gradient(135deg, #FFF8E1, #FFE0B2)",
    accent: "#FFCC02",
  },
  eenzaamheid: {
    emoji: "🤝",
    gradient: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
    accent: "#81C784",
  },
  journaling: {
    emoji: "✍️",
    gradient: "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
    accent: "#CE93D8",
  },
  algemeen: {
    emoji: "✨",
    gradient: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
    accent: "#FFB74D",
  },
};

const slugCluster: Record<string, string> = {
  "waarom-kleine-goede-daden-je-gelukkiger-maken": "geluk",
  "de-3-goede-dingen-oefening-wat-het-is-en-waarom-het-werkt": "geluk",
  "train-je-brein-in-positiviteit": "geluk",
  "elke-dag-een-goede-daad-waarom-frequentie-belangrijker-is-dan-omvang": "geluk",
  "dankbaarheidsdagboek-volhouden-7-manieren": "dankbaarheid",
  "het-dankboek-versus-een-app": "dankbaarheid",
  "dankbaarheid-op-het-werk": "dankbaarheid",
  "waarom-s-avonds-schrijven-beter-is": "dankbaarheid",
  "eenzaamheid-in-nederland-wat-jij-als-buur-kan-doen": "eenzaamheid",
  "5-kleine-gebaren-die-eenzaamheid-verminderen": "eenzaamheid",
  "hoe-praat-je-met-een-eenzame-buur": "eenzaamheid",
  "vrijwilligerswerk-zonder-vaste-verplichting": "eenzaamheid",
  "dagboek-schrijven-6-voordelen-mentale-gezondheid": "journaling",
  "hoe-maak-je-van-een-goede-gewoonte-een-blijvende-gewoonte": "journaling",
  "journaling-voor-beginners-zo-begin-je-zonder-druk": "journaling",
};

export function getClusterStyle(slug: string): ClusterStyle {
  const cluster = slugCluster[slug] || "algemeen";
  return clusterStyles[cluster];
}
