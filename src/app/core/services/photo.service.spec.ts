import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '../config/environment.config';
import { PhotoDto } from '../models/photo.interface';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ENVIRONMENT,
          useValue: { production: false, apiUrl: 'https://picsum.photos' },
        },
      ],
    });
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and map photos from API', async () => {
    const photos = await new Promise<PhotoDto[]>((resolve, reject) => {
      service.getPhotos(1, 5).subscribe({
        next: resolve,
        error: reject,
      });
    });

    // Verify array is returned
    expect(Array.isArray(photos)).toBe(true);

    if (photos.length > 0) {
      // Verify mapping structure
      const photo = photos[0];
      expect(photo.id).toBeDefined();
      expect(photo.url).toBeDefined();
      expect(photo.thumbnailUrl).toBeDefined();
      expect(photo.isFavorite).toBe(false);
    }
  });
});
