import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { PhotoDto } from '../../../core/models/photo.interface';
import { FavoritesService } from '../../../core/services/favorites.service';
import { PhotoDetailComponent } from './photo-detail.component';

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let router: Router;
  let favoritesService: FavoritesService;

  const mockPhoto: PhotoDto = {
    id: '123',
    url: 'https://picsum.photos/600/600?image=123',
    thumbnailUrl: 'https://picsum.photos/300/300?image=123',
    isFavorite: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    favoritesService = TestBed.inject(FavoritesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /photos when no id', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    vi.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue(null);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/photos']);
  });

  it('should navigate to /photos when photo not found', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    vi.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('999');
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/photos']);
  });

  it('should load photo from favorites', () => {
    favoritesService.addToFavorites(mockPhoto);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.photo()).toEqual(mockPhoto);

    const compiled = fixture.nativeElement;
    const img = compiled.querySelector('.detail-image');
    const button = compiled.querySelector('.btn-remove');

    expect(img).toBeTruthy();
    expect(img.src).toContain('600/600');
    expect(button).toBeTruthy();
  });

  it('should remove photo and navigate to /favorites', () => {
    favoritesService.addToFavorites(mockPhoto);
    component.ngOnInit();

    const navigateSpy = vi.spyOn(router, 'navigate');
    component.removeFromFavorites();

    expect(favoritesService.isFavorite('123')).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });
});
