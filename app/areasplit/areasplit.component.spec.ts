import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasplitComponent } from './areasplit.component';

describe('AreasplitComponent', () => {
  let component: AreasplitComponent;
  let fixture: ComponentFixture<AreasplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
