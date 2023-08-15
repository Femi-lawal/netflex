import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { MovieRowComponent } from './components/movie-row/movie-row.component';
import { Movie, TmdbService } from './services/tmdb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroBannerComponent, MovieRowComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main class="main-content">
      <app-hero-banner [movie]="featuredMovie"></app-hero-banner>
      
      <div class="content-rows">
        @if (trendingMovies.length) {
          <app-movie-row title="Trending Now" [movies]="trendingMovies"></app-movie-row>
        }
        
        @if (topRatedMovies.length) {
          <app-movie-row title="Top Rated" [movies]="topRatedMovies"></app-movie-row>
        }
        
        @if (actionMovies.length) {
          <app-movie-row title="Action & Adventure" [movies]="actionMovies"></app-movie-row>
        }
        
        @if (comedyMovies.length) {
          <app-movie-row title="Comedy" [movies]="comedyMovies"></app-movie-row>
        }
        
        @if (horrorMovies.length) {
          <app-movie-row title="Horror" [movies]="horrorMovies"></app-movie-row>
        }
        
        @if (popularTVShows.length) {
          <app-movie-row title="Popular TV Shows" [movies]="popularTVShows"></app-movie-row>
        }
      </div>
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2023 Netflex. A Netflix Clone for Educational Purposes.</p>
        <p class="footer-credit">Built with Angular 17 &amp; TMDB API</p>
      </div>
    </footer>
  `,
  styles: [`
    .main-content {
      min-height: 100vh;
    }

    .content-rows {
      position: relative;
      margin-top: -150px;
      z-index: 10;
      padding-bottom: var(--spacing-3xl);
    }

    .footer {
      background: var(--color-background);
      padding: var(--spacing-3xl) var(--content-padding);
      text-align: center;
      border-top: 1px solid var(--color-border);
    }

    .footer-content p {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .footer-credit {
      margin-top: var(--spacing-sm);
      font-size: var(--font-size-xs) !important;
    }

    @media (max-width: 768px) {
      .content-rows {
        margin-top: -100px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  featuredMovie: Movie | null = null;
  trendingMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  comedyMovies: Movie[] = [];
  horrorMovies: Movie[] = [];
  popularTVShows: Movie[] = [];

  constructor(private tmdbService: TmdbService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    // Load trending movies for hero and first row
    this.tmdbService.getTrending().subscribe(response => {
      this.trendingMovies = response.results.slice(0, 20);
      // Use a random trending movie with a backdrop for the hero
      const moviesWithBackdrop = this.trendingMovies.filter(m => m.backdrop_path);
      if (moviesWithBackdrop.length > 0) {
        this.featuredMovie = moviesWithBackdrop[Math.floor(Math.random() * Math.min(5, moviesWithBackdrop.length))];
      } else {
        this.featuredMovie = this.trendingMovies[0] || null;
      }
    });

    // Load top rated movies
    this.tmdbService.getTopRatedMovies().subscribe(response => {
      this.topRatedMovies = response.results.slice(0, 20);
    });

    // Load action movies
    this.tmdbService.getActionMovies().subscribe(response => {
      this.actionMovies = response.results.slice(0, 20);
    });

    // Load comedy movies
    this.tmdbService.getComedyMovies().subscribe(response => {
      this.comedyMovies = response.results.slice(0, 20);
    });

    // Load horror movies
    this.tmdbService.getHorrorMovies().subscribe(response => {
      this.horrorMovies = response.results.slice(0, 20);
    });

    // Load popular TV shows
    this.tmdbService.getPopularTVShows().subscribe(response => {
      this.popularTVShows = response.results.slice(0, 20);
    });
  }
}
