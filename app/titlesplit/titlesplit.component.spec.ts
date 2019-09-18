import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlesplitComponent } from './titlesplit.component';

describe('TitlesplitComponent', () => {
  let component: TitlesplitComponent;
  let fixture: ComponentFixture<TitlesplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlesplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlesplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
