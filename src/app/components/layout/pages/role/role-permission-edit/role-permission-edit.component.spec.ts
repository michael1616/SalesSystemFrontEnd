import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionEditComponent } from './role-permission-edit.component';

describe('RolePermissionEditComponent', () => {
  let component: RolePermissionEditComponent;
  let fixture: ComponentFixture<RolePermissionEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolePermissionEditComponent]
    });
    fixture = TestBed.createComponent(RolePermissionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
