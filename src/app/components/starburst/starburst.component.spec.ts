import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarburstComponent } from './starburst.component';

describe('StarburstComponent', () => {
  let component: StarburstComponent;
  let fixture: ComponentFixture<StarburstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarburstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarburstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
