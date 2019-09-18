import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilbarComponent } from './utilbar.component';

describe('UtilbarComponent', () => {
  let component: UtilbarComponent;
  let fixture: ComponentFixture<UtilbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
