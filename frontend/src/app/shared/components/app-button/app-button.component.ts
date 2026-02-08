import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss']
})
export class AppButtonComponent {
  @Input() text = '';
  @Input() color: string = 'primary';
  @Input() fill: 'clear' | 'outline' | 'solid' | 'default' = 'solid';
  @Input() expand: 'block' | 'full' | undefined;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
