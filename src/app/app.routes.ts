import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/photos',
    pathMatch: 'full',
  },
  {
    path: 'photos',
    loadComponent: () =>
      import('./features/photos/photos-list/photos-list.component').then(
        (m) => m.PhotosListComponent
      ),
    title: 'Photos',
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites-list/favorites-list.component').then(
        (m) => m.FavoritesListComponent
      ),
    title: 'Favorites',
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/photo-detail/photo-detail/photo-detail.component').then(
        (m) => m.PhotoDetailComponent
      ),
    title: 'Photo Detail',
  },
  {
    path: '**',
    redirectTo: '/photos',
  },
];
