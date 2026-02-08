import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './app-popup.component.html',
  styleUrls: ['./app-popup.component.scss']
})
export class AppPopupComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
