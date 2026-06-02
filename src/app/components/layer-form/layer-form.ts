import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LayerTypeName } from '../../models/layer.model';

export interface LayerAddEvent {
  type: LayerTypeName;
  percentage: number;
  fillFromRight: boolean;
  thickness?: string;
  chronologicalPhase?: string;
  dating?: string;
}

@Component({
  selector: 'app-layer-form',
  standalone: true,
  template: `
    <section class="layer-form">
      <h2 class="section-title">{{ sectionTitle }}</h2>
      <button type="button" class="btn-add" (click)="addDefaultLayer()">Dodaj warstwę</button>
    </section>
  `,
})
export class LayerFormComponent {
  @Input() sectionTitle = 'Dodaj warstwę';
  @Input() fillFromRight = false;
  @Output() readonly layerAdd = new EventEmitter<LayerAddEvent>();

  addDefaultLayer(): void {
    this.layerAdd.emit({
      type: 'Warstwa',
      percentage: 100,
      fillFromRight: this.fillFromRight,
    });
  }
}
