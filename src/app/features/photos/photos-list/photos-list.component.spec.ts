import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '../../../core/config/environment.config';
import { PhotosListComponent } from './photos-list.component';

describe('PhotosListComponent', () => {
  let component: PhotosListComponent;
  let fixture: ComponentFixture<PhotosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosListComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ENVIRONMENT,
          useValue: { production: false, apiUrl: 'https://picsum.photos/v2/list' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
