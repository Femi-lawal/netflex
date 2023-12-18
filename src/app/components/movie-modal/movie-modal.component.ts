import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-movie-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close.emit()" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        
        <div class="modal-backdrop" [style.background-image]="'url(' + getBackdropUrl() + ')'">
          <div class="backdrop-overlay"></div>
          <div class="modal-header">
            <h1 class="movie-title">{{ movie.title || movie.name }}</h1>
            <div class="movie-actions">
              <button class="btn btn-primary btn-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Play
              </button>
              <button class="action-circle" aria-label="Add to My List">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button class="action-circle" aria-label="Like">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="movie-meta">
            <span class="rating" [class.good]="movie.vote_average >= 7">
              {{ (movie.vote_average * 10).toFixed(0) }}% Match
            </span>
            <span class="year">{{ getYear() }}</span>
            <span class="badge">HD</span>
          </div>
          
          <div class="movie-info">
            <div class="info-main">
              <p class="overview">{{ movie.overview }}</p>
            </div>
            <div class="info-side">
              <p><span class="label">Genres:</span> {{ getGenres() }}</p>
              <p><span class="label">Rating:</span> {{ movie.vote_average.toFixed(1) }} / 10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2rem;
      overflow-y: auto;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      position: relative;
      width: 100%;
      max-width: 850px;
      background: var(--color-background-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: scaleIn 0.3s ease;
      margin-top: 2rem;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-background);
      border: none;
      color: var(--color-text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--transition-fast);
    }

    .close-btn:hover {
      background: var(--color-surface);
    }

    .modal-backdrop {
      position: relative;
      width: 100%;
      height: 400px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
    }

    .backdrop-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, var(--color-background-card) 0%, transparent 50%);
    }

    .modal-header {
      position: relative;
      z-index: 2;
      padding: 2rem;
      width: 100%;
    }

    .movie-title {
      font-size: var(--font-size-4xl);
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
    }

    .movie-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .action-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid var(--color-text-secondary);
      background: rgba(20, 20, 20, 0.6);
      color: var(--color-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .action-circle:hover {
      border-color: var(--color-text-primary);
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: 1.5rem 2rem 2rem;
    }

    .movie-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .rating {
      font-weight: 600;
      color: var(--color-text-muted);
    }

    .rating.good {
      color: #46d369;
    }

    .year {
      color: var(--color-text-secondary);
    }

    .badge {
      padding: 0.2rem 0.5rem;
      border: 1px solid var(--color-text-secondary);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }

    .movie-info {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
    }

    .overview {
      font-size: var(--font-size-base);
      line-height: 1.6;
      color: var(--color-text-primary);
    }

    .info-side p {
      margin-bottom: 0.5rem;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }

    .label {
      color: var(--color-text-muted);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 0;
      }

      .modal-content {
        margin-top: 0;
        border-radius: 0;
        min-height: 100vh;
      }

      .modal-backdrop {
        height: 300px;
      }

      .movie-title {
        font-size: var(--font-size-2xl);
      }

      .movie-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieModalComponent {
  @Input() movie!: Movie;
  @Output() close = new EventEmitter<void>();

  private genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };

  constructor(private tmdbService: TmdbService) {}

  getBackdropUrl(): string {
    return this.tmdbService.getImageUrl(this.movie.backdrop_path, 'w1280');
  }

  getYear(): string {
    const date = this.movie.release_date || this.movie.first_air_date;
    return date ? date.split('-')[0] : '';
  }

  getGenres(): string {
    if (!this.movie.genre_ids || this.movie.genre_ids.length === 0) {
      return 'N/A';
    }
    return this.movie.genre_ids
      .slice(0, 3)
      .map(id => this.genreMap[id] || 'Unknown')
      .join(', ');
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
