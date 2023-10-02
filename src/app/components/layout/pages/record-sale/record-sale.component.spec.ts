import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSaleComponent } from './record-sale.component';

describe('RecordSaleComponent', () => {
  let component: RecordSaleComponent;
  let fixture: ComponentFixture<RecordSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordSaleComponent]
    });
    fixture = TestBed.createComponent(RecordSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
