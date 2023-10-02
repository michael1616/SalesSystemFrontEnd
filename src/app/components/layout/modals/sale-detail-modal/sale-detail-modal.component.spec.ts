import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailModalComponent } from './sale-detail-modal.component';

describe('SaleDetailModalComponent', () => {
  let component: SaleDetailModalComponent;
  let fixture: ComponentFixture<SaleDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleDetailModalComponent]
    });
    fixture = TestBed.createComponent(SaleDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
