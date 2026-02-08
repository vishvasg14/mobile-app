import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export interface DropdownOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './app-dropdown.component.html',
  styleUrls: ['./app-dropdown.component.scss']
})
export class AppDropdownComponent {
  @Input() label = '';
  @Input() placeholder = 'Select';
  @Input() value: any;
  @Input() options: DropdownOption[] = [];
  @Input() disabled = false;
  @Input() interface: 'alert' | 'action-sheet' | 'popover' = 'popover';
  @Output() valueChange = new EventEmitter<any>();

  onChange(ev: any) {
    this.valueChange.emit(ev.detail.value);
  }
}
