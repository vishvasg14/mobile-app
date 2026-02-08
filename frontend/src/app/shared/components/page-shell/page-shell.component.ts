import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './page-shell.component.html',
  styleUrls: ['./page-shell.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageShellComponent {
  @Input() title = '';
  @Input() showHeader = true;
  @Input() showFooter = false;
}
