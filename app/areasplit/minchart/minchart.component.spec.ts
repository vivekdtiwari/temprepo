import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinchartComponent } from './minchart.component';

describe('MinchartComponent', () => {
  let component: MinchartComponent;
  let fixture: ComponentFixture<MinchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
