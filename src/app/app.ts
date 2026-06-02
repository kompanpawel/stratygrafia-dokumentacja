import { Component, signal, computed, inject } from '@angular/core';
import { LayerFormComponent } from './components/layer-form/layer-form';
import { StratigraphyTableComponent } from './components/stratigraphy-table/stratigraphy-table';
import { StratigraphyLayer, LayerTypeName } from './models/layer.model';
import { WordExportService } from './services/word-export.service';

type RawLayer = Omit<StratigraphyLayer, 'number'>;

@Component({
  selector: 'app-root',
  imports: [LayerFormComponent, StratigraphyTableComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly _layers = signal<RawLayer[]>([]);
  private readonly wordExport = inject(WordExportService);

  /**
   * Warstwy z automatyczną numeracją:
   * - indeks 0 = warstwa na górze stosu (numer 1, najnowsza)
   * - ostatni indeks = warstwa na dole (numer n, najstarsza)
   * Każda nowo dodana warstwa trafia na górę i dostaje numer 1,
   * a wszystkie poprzednie warstwy dostają wyższe numery.
   */
  readonly layers = computed<StratigraphyLayer[]>(() => {
    const raw = this._layers();
    return raw.map((layer, index) => ({
      ...layer,
      number: index + 1,
    }));
  });

  exportToWord(): void {
    this.wordExport.exportTable(this.layers());
  }

  addLayer(event: { type: LayerTypeName; percentage: number; fillFromRight: boolean; thickness?: string; chronologicalPhase?: string; dating?: string }): void {
    this._layers.update(layers => [
      { id: crypto.randomUUID(), type: event.type, percentage: event.percentage, fillFromRight: event.fillFromRight, thickness: event.thickness, chronologicalPhase: event.chronologicalPhase, dating: event.dating },
      ...layers,
    ]);
  }

  updateLayerThickness(event: { id: string; thickness: string }): void {
    this._layers.update(layers =>
      layers.map(l =>
        l.id === event.id ? { ...l, thickness: event.thickness.trim() || undefined } : l
      )
    );
  }

  updateLayerPhase(event: { id: string; phase: string }): void {
    this._layers.update(layers =>
      layers.map(l =>
        l.id === event.id ? { ...l, chronologicalPhase: event.phase.trim() || undefined } : l
      )
    );
  }

  updateLayerDating(event: { id: string; dating: string }): void {
    this._layers.update(layers =>
      layers.map(l =>
        l.id === event.id ? { ...l, dating: event.dating.trim() || undefined } : l
      )
    );
  }

  updateLayerName(event: { id: string; name: string }): void {
    this._layers.update(layers =>
      layers.map(l =>
        l.id === event.id ? { ...l, customName: event.name || undefined } : l
      )
    );
  }

  removeLayer(id: string): void {
    this._layers.update(layers => layers.filter(l => l.id !== id));
  }

  reorderLayer(event: { id: string; newNumber: number }): void {
    this._layers.update(layers => {
      const fromIndex = layers.findIndex(l => l.id === event.id);
      if (fromIndex === -1) return layers;
      const toIndex = event.newNumber - 1;
      if (toIndex === fromIndex || toIndex < 0 || toIndex >= layers.length) return layers;
      const updated = [...layers];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }
}
