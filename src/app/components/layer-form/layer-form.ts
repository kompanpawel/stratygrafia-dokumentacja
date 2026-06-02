import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LAYER_CONFIGS, LAYER_CONFIG_MAP, LayerTypeName } from '../../models/layer.model';

@Component({
  selector: 'app-layer-form',
  imports: [FormsModule],
  templateUrl: './layer-form.html',
  styleUrl: './layer-form.css',
})
export class LayerFormComponent {
  readonly sectionTitle = input<string>('Dodaj warstwę');
  readonly fillFromRight = input<boolean>(false);

  readonly layerAdd = output<{ type: LayerTypeName; percentage: number; fillFromRight: boolean; thickness?: string; chronologicalPhase?: string; dating?: string }>();

  readonly configs = LAYER_CONFIGS;
  readonly selectedType = signal<LayerTypeName>('plotno');
  readonly percentage = signal<number>(100);
  readonly thickness = signal<string>('');
  readonly chronologicalPhase = signal<string>('');
  readonly dating = signal<string>('');

  readonly selectedConfig = computed(() => LAYER_CONFIG_MAP.get(this.selectedType()));

  onTypeChange(value: string): void {
    this.selectedType.set(value as LayerTypeName);
  }

  onPercentageChange(value: string): void {
    const num = Number(value);
    if (!isNaN(num)) this.percentage.set(Math.min(100, Math.max(0, num)));
  }

  onThicknessChange(value: string): void {
    this.thickness.set(value);
  }

  onPhaseChange(value: string): void {
    this.chronologicalPhase.set(value);
  }

  onDatingChange(value: string): void {
    this.dating.set(value);
  }

  submit(): void {
    const pct = this.percentage();
    if (pct < 0 || pct > 100) return;
    const thickness = this.thickness().trim();
    const phase = this.chronologicalPhase().trim();
    const dating = this.dating().trim();
    this.layerAdd.emit({
      type: this.selectedType(),
      percentage: pct,
      fillFromRight: this.fillFromRight(),
      thickness: thickness || undefined,
      chronologicalPhase: phase || undefined,
      dating: dating || undefined,
    });
  }

  getBackgroundStyle(imagePath: string): string {
    return `url('${imagePath.replace(/ /g, '%20')}')`;
  }
}
