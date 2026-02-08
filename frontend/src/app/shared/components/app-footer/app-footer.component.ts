import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

export interface FooterItem {
  label: string;
  icon?: string;
  value?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent {
  @Input() items: FooterItem[] = [];
  @Output() itemSelected = new EventEmitter<FooterItem>();

  select(item: FooterItem) {
    this.itemSelected.emit(item);
  }
}
