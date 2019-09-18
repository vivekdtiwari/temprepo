import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalstackComponent } from './finalstack.component';

describe('FinalstackComponent', () => {
  let component: FinalstackComponent;
  let fixture: ComponentFixture<FinalstackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalstackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalstackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
