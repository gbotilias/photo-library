import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoDto } from '../../../core/models/photo.interface';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-photo-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  photo = signal<PhotoDto | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/photos']);
      return;
    }

    // Find photo in favorites
    const favorites = this.favoritesService.favorites();
    const foundPhoto = favorites.find((p) => p.id === id);

    if (foundPhoto) {
      this.photo.set(foundPhoto);
    } else {
      this.router.navigate(['/photos']);
    }
  }

  removeFromFavorites() {
    const photo = this.photo();
    if (photo) {
      this.favoritesService.removeFromFavorites(photo.id);
      this.router.navigate(['/favorites']);
    }
  }
}
