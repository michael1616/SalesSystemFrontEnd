import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionAddComponent } from './role-permission-add.component';

describe('RolePermissionAddComponent', () => {
  let component: RolePermissionAddComponent;
  let fixture: ComponentFixture<RolePermissionAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolePermissionAddComponent]
    });
    fixture = TestBed.createComponent(RolePermissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
