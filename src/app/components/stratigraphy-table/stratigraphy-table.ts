import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LAYER_CONFIG_MAP, StratigraphyLayer } from '../../models/layer.model';
import { Modal } from '../modal/modal';

type PhaseGroupPos = 'single' | 'first' | 'middle' | 'last' | null;

interface LayerRow {
  layer: StratigraphyLayer;
  phaseGroupPos: PhaseGroupPos;
  datingGroupPos: PhaseGroupPos;
}

@Component({
  selector: 'app-stratigraphy-table',
  imports: [FormsModule, Modal],
  templateUrl: './stratigraphy-table.html',
  styleUrl: './stratigraphy-table.css',
})
export class StratigraphyTableComponent {
  readonly layers = input<StratigraphyLayer[]>([]);
  readonly layerRemove = output<string>();
  readonly layerNumberChange = output<{ id: string; newNumber: number }>();
  readonly layerPercentageChange = output<{ id: string; percentage: number }>();
  readonly layerThicknessChange = output<{ id: string; thickness: string }>();
  readonly layerPhaseChange = output<{ id: string; phase: string }>();
  readonly layerDatingChange = output<{ id: string; dating: string }>();
  readonly layerNameChange = output<{ id: string; name: string }>();

  isModalOpen = signal<boolean>(false);
  activeRowId = signal<string>('');
  activeInitialValue = signal<number>(0);
  activeNameValue = signal<string | undefined>('');

  openEditModal(id: string, percentage: number, name?: string): void {
    this.activeRowId.set(id);
    this.activeInitialValue.set(percentage);
    this.activeNameValue.set(name);
    this.isModalOpen.set(true);
  }

  handleSave(result: {id: string, newValue: number}): void {
    this.layerPercentageChange.emit({ id: result.id, percentage: result.newValue });
    this.closeModal()
  }

  readonly layerRows = computed<LayerRow[]>(() => {
    const layers = this.layers();
    const phasePositions = this.computeGroupPositions(layers, l => l.chronologicalPhase);
    const datingPositions = this.computeGroupPositions(layers, l => l.dating);
    return layers.map((layer, i) => ({
      layer,
      phaseGroupPos: phasePositions[i],
      datingGroupPos: datingPositions[i],
    }));
  });

  private computeGroupPositions(layers: StratigraphyLayer[], getValue: (l: StratigraphyLayer) => string | undefined): PhaseGroupPos[] {
    const result: PhaseGroupPos[] = new Array(layers.length).fill(null);
    let i = 0;
    while (i < layers.length) {
      const val = getValue(layers[i])?.trim();
      if (!val) {
        result[i] = null;
        i++;
        continue;
      }
      let j = i + 1;
      while (j < layers.length && getValue(layers[j])?.trim() === val) {
        j++;
      }
      const span = j - i;
      if (span === 1) {
        result[i] = 'single';
      } else {
        result[i] = 'first';
        for (let k = i + 1; k < j - 1; k++) result[k] = 'middle';
        result[j - 1] = 'last';
      }
      i = j;
    }
    return result;
  }

  getConfig(layer: StratigraphyLayer) {
    return LAYER_CONFIG_MAP.get(layer.type);
  }

  getBackgroundStyle(imagePath: string): string {
    return `url('${imagePath.replace(/ /g, '%20')}')`;
  }

  remove(id: string): void {
    this.layerRemove.emit(id);
  }

  onNumberChange(id: string, value: string): void {
    const num = parseInt(value, 10);
    const total = this.layers().length;
    if (!isNaN(num) && num >= 1 && num <= total) {
      this.layerNumberChange.emit({ id, newNumber: num });
    }
  }

  onPercentageChange(id: string, value: number): void {
    this.layerPercentageChange.emit({id, percentage: value})
  }

  onThicknessChange(id: string, value: string): void {
    this.layerThicknessChange.emit({ id, thickness: value });
  }

  onPhaseChange(id: string, value: string): void {
    this.layerPhaseChange.emit({ id, phase: value });
  }

  onDatingChange(id: string, value: string): void {
    this.layerDatingChange.emit({ id, dating: value });
  }

  onNameChange(id: string, value: string): void {
    this.layerNameChange.emit({ id, name: value });
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
