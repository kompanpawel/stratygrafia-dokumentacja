import { Injectable } from '@angular/core';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeightRule,
  TextDirection,
  ImageRun,
  VerticalAlign,
  VerticalMergeType,
} from 'docx';
import { LAYER_CONFIG_MAP, StratigraphyLayer } from '../models/layer.model';

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const FONT = 'Times New Roman';
const FONT_SIZE = 20; // half-points → 10pt
const FONT_SIZE_HEADER = 20;

// Strona A4
const PAGE_WIDTH_DXA = 11906;  // 210 mm
const MARGIN_H_DXA   = 567;    // ~1 cm marginesy boczne
const MARGIN_V_DXA   = 851;    // ~1.5 cm marginesy górny/dolny
const USABLE_WIDTH_DXA = PAGE_WIDTH_DXA - 2 * MARGIN_H_DXA; // ~10 772 DXA

// Oryginalne proporcje kolumn (suma 12 200)
const ORIG_TOTAL    = 12200;
const ORIG_NR       = 700;
const ORIG_TEXTURE  = 4000;
const ORIG_CHAR     = 2900;
const ORIG_THICKNESS = 1600;
const ORIG_PHASE    = 1500;
const ORIG_DATING   = 1500;

function scaleDxa(orig: number): number {
  return Math.round((orig / ORIG_TOTAL) * USABLE_WIDTH_DXA);
}

const COL_NR        = scaleDxa(ORIG_NR);
const COL_TEXTURE   = scaleDxa(ORIG_TEXTURE);
const COL_CHAR      = scaleDxa(ORIG_CHAR);
const COL_THICKNESS = scaleDxa(ORIG_THICKNESS);
const COL_PHASE     = scaleDxa(ORIG_PHASE);
const COL_DATING    = scaleDxa(ORIG_DATING);

// Szerokość obrazka tekstury obliczona z przeskalowanej kolumny (DXA → cale → px przy 96 dpi)
const TEXTURE_FULL_WIDTH_PX = Math.round((COL_TEXTURE / 1440) * 96);
// Wysokość wiersza danych – stała
const TEXTURE_HEIGHT_PX = 50;
const ROW_HEIGHT_DXA = Math.round((TEXTURE_HEIGHT_PX / 96) * 1440);

function borders() {
  return { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
}

/**
 * Skaluje obrazek równomiernie (object-fit: cover) do pełnych wymiarów komórki,
 * zachowując proporcje wzoru, a następnie przycina do szerokości targetWidth.
 */
function createCroppedBuffer(
  imagePath: string,
  targetWidth: number,
): Promise<ArrayBuffer | null> {
  return new Promise(resolve => {
    if (targetWidth <= 0) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = TEXTURE_HEIGHT_PX;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }

      // Współczynnik skali "cover" – większy z dwóch, żeby obraz wypełnił komórkę
      const scale = Math.max(
        TEXTURE_FULL_WIDTH_PX / img.naturalWidth,
        TEXTURE_HEIGHT_PX / img.naturalHeight,
      );
      const scaledW = img.naturalWidth * scale;
      const scaledH = img.naturalHeight * scale;
      // Wycentruj (opcjonalnie), żeby przycinać symetrycznie
      const offsetX = (TEXTURE_FULL_WIDTH_PX - scaledW) / 2;
      const offsetY = (TEXTURE_HEIGHT_PX - scaledH) / 2;

      ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);

      canvas.toBlob(blob => {
        if (!blob) { resolve(null); return; }
        blob.arrayBuffer().then(resolve).catch(() => resolve(null));
      }, 'image/png');
    };
    img.onerror = () => resolve(null);
    img.src = imagePath;
  });
}

/** Komórka nagłówkowa z pionowym tekstem (dla wąskich kolumn) */
function verticalHeaderCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: borders(),
    textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text, bold: true, font: FONT, size: FONT_SIZE_HEADER }),
        ],
      }),
    ],
  });
}

/** Komórka nagłówkowa z poziomym tekstem (dla szerokich kolumn) */
function horizontalHeaderCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: borders(),
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text, bold: true, font: FONT, size: FONT_SIZE_HEADER }),
        ],
      }),
    ],
  });
}

/** Komórka danych – wyśrodkowany tekst */
function dataCell(text: string, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: borders(),
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, font: FONT, size: FONT_SIZE })],
      }),
    ],
  });
}

type PhaseMerge = 'restart' | 'continue' | undefined;

/** Komórka fazy/datowania ze scaleniem pionowym */
function mergeCell(text: string, width: number, mergeType: PhaseMerge): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: borders(),
    verticalAlign: VerticalAlign.CENTER,
    verticalMerge: mergeType,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: mergeType !== VerticalMergeType.CONTINUE ? text : '',
            font: FONT,
            size: FONT_SIZE,
          }),
        ],
      }),
    ],
  });
}

/** @deprecated Użyj mergeCell */
function phaseCell(text: string, mergeType: PhaseMerge): TableCell {
  return mergeCell(text, COL_PHASE, mergeType);
}

/**
 * Dla każdej warstwy oblicza typ scalenia pionowego na podstawie podanego pola:
 * - 'restart': pierwsza w grupie kolejnych warstw z tą samą wartością
 * - 'continue': kolejne warstwy w tej samej grupie
 * - undefined: warstwa bez wartości (brak scalenia)
 */
function computeMergeTypes(layers: StratigraphyLayer[], getValue: (l: StratigraphyLayer) => string | undefined): PhaseMerge[] {
  const result: PhaseMerge[] = new Array(layers.length).fill(undefined);
  let i = 0;
  while (i < layers.length) {
    const val = getValue(layers[i])?.trim();
    if (!val) {
      result[i] = undefined;
      i++;
      continue;
    }
    let j = i + 1;
    while (j < layers.length && getValue(layers[j])?.trim() === val) {
      j++;
    }
    result[i] = VerticalMergeType.RESTART;
    for (let k = i + 1; k < j; k++) {
      result[k] = VerticalMergeType.CONTINUE;
    }
    i = j;
  }
  return result;
}

@Injectable({ providedIn: 'root' })
export class WordExportService {
  async exportTable(layers: StratigraphyLayer[]): Promise<void> {
    // Generuj przeskalowane i przycięte PNG dla każdej warstwy
    const tiledBuffers = await Promise.all(
      layers.map(layer => {
        const config = LAYER_CONFIG_MAP.get(layer.type);
        if (!config) return Promise.resolve(null);
        const targetWidth = Math.round(TEXTURE_FULL_WIDTH_PX * (layer.percentage / 100));
        return createCroppedBuffer(config.imagePath, targetWidth);
      })
    );

    const phaseMergeTypes = computeMergeTypes(layers, l => l.chronologicalPhase);
    const datingMergeTypes = computeMergeTypes(layers, l => l.dating);

    const headerRow = new TableRow({
      tableHeader: true,
      height: { value: 1400, rule: HeightRule.ATLEAST },
      children: [
        verticalHeaderCell('Nr warstwy', COL_NR),
        horizontalHeaderCell('Oznaczenie graficzne warstwy', COL_TEXTURE),
        horizontalHeaderCell('Charakterystyka warstwy', COL_CHAR),
        verticalHeaderCell('Grubość warstwy (mm)', COL_THICKNESS),
        verticalHeaderCell('Faza chronologiczna', COL_PHASE),
        verticalHeaderCell('Datowanie', COL_DATING),
      ],
    });

    const dataRows = layers.map((layer, i) => {
      const config = LAYER_CONFIG_MAP.get(layer.type);
      const buf = tiledBuffers[i];
      const imgWidth = Math.round(TEXTURE_FULL_WIDTH_PX * (layer.percentage / 100));

      const textureCell = new TableCell({
        width: { size: COL_TEXTURE, type: WidthType.DXA },
        borders: borders(),
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 0, bottom: 30, left: 0, right: 0 },
        children: [
          new Paragraph({
            alignment: layer.fillFromRight ? AlignmentType.RIGHT : AlignmentType.LEFT,
            spacing: { before: 0, after: 0 },
            children:
              buf && imgWidth > 0
                ? [
                    new ImageRun({
                      data: buf,
                      transformation: { width: imgWidth, height: TEXTURE_HEIGHT_PX },
                      type: 'png',
                    }),
                  ]
                : [new TextRun({ text: layer.customName ?? config?.label ?? '', font: FONT, size: FONT_SIZE })],
          }),
        ],
      });

      return new TableRow({
        height: { value: ROW_HEIGHT_DXA, rule: HeightRule.EXACT },
        children: [
          dataCell(String(layer.number), COL_NR),
          textureCell,
          dataCell(layer.customName ?? config?.label ?? '', COL_CHAR),
          dataCell(layer.thickness ?? '-', COL_THICKNESS),
          mergeCell(layer.chronologicalPhase?.trim() ?? '', COL_PHASE, phaseMergeTypes[i]),
          mergeCell(layer.dating?.trim() ?? '', COL_DATING, datingMergeTypes[i]),
        ],
      });
    });

    const table = new Table({
      alignment: AlignmentType.CENTER,
      width: { size: USABLE_WIDTH_DXA, type: WidthType.DXA },
      rows: [headerRow, ...dataRows],
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: MARGIN_V_DXA,
                right: MARGIN_H_DXA,
                bottom: MARGIN_V_DXA,
                left: MARGIN_H_DXA,
              },
            },
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Przekrój stratygraficzny', bold: true, font: FONT, size: 28 }),
              ],
              spacing: { after: 200 },
            }),
            table,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stratygrafia.docx';
    a.click();
    URL.revokeObjectURL(url);
  }
}

