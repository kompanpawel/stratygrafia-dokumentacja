import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StratigraphyLayer } from '../../models/layer.model';

@Component({
  selector: 'app-stratigraphy-table',
  standalone: true,
  template: `
    <table class="stratigraphy-table">
      <tbody>
        @for (layer of layers; track layer.id) {
          <tr>
            <td>{{ layer.number }}</td>
            <td>{{ layer.customName || layer.type }}</td>
            <td>
              <button type="button" (click)="remove(layer.id)">Usuń</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class StratigraphyTableComponent {
  @Input() layers: StratigraphyLayer[] = [];

  @Output() readonly layerRemove = new EventEmitter<string>();
  @Output() readonly layerNumberChange = new EventEmitter<{ id: string; newNumber: number }>();
  @Output() readonly layerThicknessChange = new EventEmitter<{ id: string; thickness: string }>();
  @Output() readonly layerPhaseChange = new EventEmitter<{ id: string; phase: string }>();
  @Output() readonly layerDatingChange = new EventEmitter<{ id: string; dating: string }>();
  @Output() readonly layerNameChange = new EventEmitter<{ id: string; name: string }>();

  remove(id: string): void {
    this.layerRemove.emit(id);
  }
}
