import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JuegoPage } from './juego.page';

describe('JuegoPage', () => {
  let component: JuegoPage;
  let fixture: ComponentFixture<JuegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
