import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { PhotoDto } from '../../../core/models/photo.interface';
import { FavoritesService } from '../../../core/services/favorites.service';
import { PhotoService } from '../../../core/services/photo.service';

@Component({
  selector: 'app-photos-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './photos-list.component.html',
  styleUrl: './photos-list.component.scss',
})
export class PhotosListComponent implements OnInit, OnDestroy {
  private photoService = inject(PhotoService);
  private favoritesService = inject(FavoritesService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  photos = signal<PhotoDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(0);

  ngOnInit() {
    if (this.photos().length === 0) {
      this.loadPhotos();
    }
    this.setupScrollListener();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPhotos() {
    this.loading.set(true);
    this.error.set(null);

    // Calculate next page number
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);

    this.photoService.getPhotos(nextPage, 20).subscribe({
      // Success callback
      next: (newPhotos) => {
        const currentPhotos = this.photos();
        this.photos.set([...currentPhotos, ...newPhotos]);
        this.loading.set(false);
      },
      // Error callback
      error: (_err) => {
        this.error.set('Failed to load photos. Please try again.');
        this.loading.set(false);
        this.currentPage.set(nextPage - 1);
      },
    });
  }

  addToFavorites(photo: PhotoDto) {
    if (this.favoritesService.isFavorite(photo.id)) {
      this.snackBar.open('This photo is already in favorites!', 'Close', {
        duration: 3000,
      });
    } else {
      this.favoritesService.addToFavorites(photo);
      this.snackBar.open('Photo added to favorites!', 'Close', {
        duration: 3000,
      });
    }
  }

  private setupScrollListener() {
    const scrollContainer = document.querySelector('.app-content');
    if (!scrollContainer) return;

    fromEvent(scrollContainer, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isNearBottom(scrollContainer)) {
          this.loadPhotos();
        }
      });
  }

  private isNearBottom(container: Element): boolean {
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollTop + clientHeight >= scrollHeight;
  }
}
