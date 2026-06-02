import { Injectable } from '@angular/core';
import { StratigraphyLayer } from '../models/layer.model';

@Injectable({ providedIn: 'root' })
export class WordExportService {
  exportTable(_layers: StratigraphyLayer[]): void {}
}
