export type LayerTypeName =
  | 'plotno'
  | 'drewno'
  | 'mur'
  | 'kamien'
  | 'ceramika'
  | 'metal_blacha_gwozdzie'
  | 'szklo'
  | 'szkliwo'
  | 'skora'
  | 'pergamin'
  | 'papier'
  | 'tektura'
  | 'haft'
  | 'wloknina'
  | 'watek_mieszany'
  | 'tworzywo_sztuczne'
  | 'kosc_kamienie_szlachetne'
  | 'stiuk'
  | 'zaprawa'
  | 'tynk_kit'
  | 'pobiala'
  | 'sztukateria_odlewy'
  | 'warstwa_malarska'
  | 'laserunek'
  | 'werniks'
  | 'patyna'
  | 'folie_metalowe_zlocenia'
  | 'zloto_w_proszku_bronzy'
  | 'wosk_masy_dublazowe'
  | 'klej';

export interface LayerConfig {
  type: LayerTypeName;
  label: string;
  imagePath: string;
}

export interface StratigraphyLayer {
  id: string;
  type: LayerTypeName;
  percentage: number;
  number: number;
  fillFromRight?: boolean;
  customName?: string;
  thickness?: string;
  chronologicalPhase?: string;
  dating?: string;
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { type: 'plotno', label: 'Płótno / Podobrazie', imagePath: 'assets/obrazki/Plotno.jpg' },
  { type: 'drewno', label: 'Drewno / Krosno', imagePath: 'assets/obrazki/Drewno.jpg' },
  { type: 'mur', label: 'Mur', imagePath: 'assets/obrazki/Mur.jpg' },
  { type: 'kamien', label: 'Kamień', imagePath: 'assets/obrazki/kamień.jpg' },
  { type: 'ceramika', label: 'Ceramika', imagePath: 'assets/obrazki/ceramika.jpg' },
  { type: 'metal_blacha_gwozdzie', label: 'Metal / blacha / gwoździe', imagePath: 'assets/obrazki/metal_blacha_gwoździe.jpg' },
  { type: 'szklo', label: 'Szkło', imagePath: 'assets/obrazki/szkło.jpg' },
  { type: 'szkliwo', label: 'Szkliwo', imagePath: 'assets/obrazki/szkliwo.jpg' },
  { type: 'skora', label: 'Skóra', imagePath: 'assets/obrazki/skóra.jpg' },
  { type: 'pergamin', label: 'Pergamin', imagePath: 'assets/obrazki/pergamin.jpg' },
  { type: 'papier', label: 'Papier', imagePath: 'assets/obrazki/papier.jpg' },
  { type: 'tektura',  label: 'Tektura', imagePath: 'assets/obrazki/Tektura.jpg' },
  { type: 'haft', label: 'Haft', imagePath: 'assets/obrazki/haft.jpg' },
  { type: 'wloknina', label: 'Włóknina', imagePath: 'assets/obrazki/włóknina.jpg' },
  { type: 'watek_mieszany', label: 'Wątek mieszany', imagePath: 'assets/obrazki/wątek mieszany.jpg' },
  { type: 'tworzywo_sztuczne', label: 'Tworzywo sztuczne', imagePath: 'assets/obrazki/tworzywo sztuczne.jpg' },
  { type: 'kosc_kamienie_szlachetne', label: 'Kość / kamienie szlachetne', imagePath: 'assets/obrazki/kość_kamienie szlachetne.jpg' },
  { type: 'stiuk', label: 'Stiuk', imagePath: 'assets/obrazki/stiuk.jpg' },
  // Warstwy technologiczne
  { type: 'zaprawa', label: 'Zaprawa', imagePath: 'assets/obrazki/Zaprawa (na sztalugowe chyba).jpg' },
  { type: 'tynk_kit', label: 'Tynk / kit', imagePath: 'assets/obrazki/Tynk_kit_.jpg' },
  { type: 'pobiala', label: 'Pobiała', imagePath: 'assets/obrazki/pobiała.jpg' },
  { type: 'sztukateria_odlewy', label: 'Sztukateria / odlewy / aplikacje gipsowe', imagePath: 'assets/obrazki/sztukateria_odlewy_aplikacje gipsowe.jpg' },
  { type: 'warstwa_malarska', label: 'Warstwa malarska', imagePath: 'assets/obrazki/Warstwa_mal.jpg' },
  { type: 'laserunek', label: 'Laserunek', imagePath: 'assets/obrazki/laserunek.jpg' },
  { type: 'werniks', label: 'Werniks', imagePath: 'assets/obrazki/Werniks.jpg' },
  { type: 'patyna', label: 'Patyna', imagePath: 'assets/obrazki/patyna.jpg' },
  // Materiały złocące i specjalne
  { type: 'folie_metalowe_zlocenia', label: 'Folie metalowe / złocenia / srebrzenia', imagePath: 'assets/obrazki/folie metalowe_złocenia_srebrzenia.jpg' },
  { type: 'zloto_w_proszku_bronzy', label: 'Złoto w proszku / brązy pozłotnicze', imagePath: 'assets/obrazki/złoto w proszku_brązy pozłotnicze.jpg' },
  { type: 'wosk_masy_dublazowe', label: 'Wosk / masy dublażowe', imagePath: 'assets/obrazki/wosk_masy dublażowe.jpg' },
  { type: 'klej', label: 'Klej', imagePath: 'assets/obrazki/klej.jpg' }
];

export const LAYER_CONFIG_MAP = new Map<LayerTypeName, LayerConfig>(
  LAYER_CONFIGS.map(c => [c.type, c])
);
