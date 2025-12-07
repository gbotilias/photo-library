import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosList } from './photos-list';

describe('PhotosList', () => {
  let component: PhotosList;
  let fixture: ComponentFixture<PhotosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
