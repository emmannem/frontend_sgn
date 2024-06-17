import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistenciasComponent } from './existencias.component';

describe('ExistenciasComponent', () => {
  let component: ExistenciasComponent;
  let fixture: ComponentFixture<ExistenciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExistenciasComponent]
    });
    fixture = TestBed.createComponent(ExistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
