import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites';

@Component({
  selector: 'app-favorites-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.scss',
})
export class FavoritesListComponent {
  private router = inject(Router);
  favoritesService = inject(FavoritesService);

  onPhotoClick(photoId: string) {
    this.router.navigate(['/photos', photoId]);
  }
}
