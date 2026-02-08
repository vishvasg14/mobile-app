import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicCardPage } from './public-card.page';

describe('PublicCardPage', () => {
  let component: PublicCardPage;
  let fixture: ComponentFixture<PublicCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
