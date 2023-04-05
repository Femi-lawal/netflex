import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = environment.tmdb.apiKey;
  private baseUrl = environment.tmdb.baseUrl;
  private imageBaseUrl = environment.tmdb.imageBaseUrl;

  // Fallback data for when API key is not configured
  private fallbackMovies: Movie[] = [
    {
      id: 1,
      title: 'Stranger Things',
      name: 'Stranger Things',
      overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.6,
      first_air_date: '2016-07-15',
      genre_ids: [18, 10765, 9648]
    },
    {
      id: 2,
      title: 'The Crown',
      name: 'The Crown',
      overview: 'This drama follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.2,
      first_air_date: '2016-11-04',
      genre_ids: [18]
    },
    {
      id: 3,
      title: 'Wednesday',
      name: 'Wednesday',
      overview: 'Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic ability.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.1,
      first_air_date: '2022-11-23',
      genre_ids: [10765, 9648, 35]
    },
    {
      id: 4,
      title: 'Squid Game',
      name: 'Squid Game',
      overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 7.8,
      first_air_date: '2021-09-17',
      genre_ids: [10759, 9648, 18]
    },
    {
      id: 5,
      title: 'Money Heist',
      name: 'Money Heist',
      overview: 'Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.3,
      first_air_date: '2017-05-02',
      genre_ids: [80, 18]
    },
    {
      id: 6,
      title: 'Breaking Bad',
      name: 'Breaking Bad',
      overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 9.5,
      first_air_date: '2008-01-20',
      genre_ids: [18, 80]
    }
  ];

  constructor(private http: HttpClient) {}

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return this.getPlaceholderImage();
    }
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getPlaceholderImage(): string {
    return 'data:image/svg+xml,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
        <rect fill="#232323" width="500" height="750"/>
        <text fill="#666" font-family="Inter, sans-serif" font-size="24" text-anchor="middle" x="250" y="375">No Image</text>
      </svg>
    `);
  }

  getBackdropPlaceholder(): string {
    return 'data:image/svg+xml,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e"/>
            <stop offset="100%" style="stop-color:#16213e"/>
          </linearGradient>
        </defs>
        <rect fill="url(#grad)" width="1920" height="1080"/>
        <text fill="#e50914" font-family="Inter, sans-serif" font-size="120" font-weight="800" text-anchor="middle" x="960" y="500">NETFLEX</text>
        <text fill="#666" font-family="Inter, sans-serif" font-size="32" text-anchor="middle" x="960" y="580">Stream Unlimited Movies & Shows</text>
      </svg>
    `);
  }

  private getFallbackData(): Observable<MovieResponse> {
    return of({
      page: 1,
      results: this.fallbackMovies,
      total_pages: 1,
      total_results: this.fallbackMovies.length
    });
  }

  private makeRequest(endpoint: string): Observable<MovieResponse> {
    if (this.apiKey === 'YOUR_TMDB_API_KEY') {
      return this.getFallbackData();
    }
    
    return this.http.get<MovieResponse>(`${this.baseUrl}${endpoint}`, {
      params: {
        api_key: this.apiKey,
        language: 'en-US'
      }
    }).pipe(
      catchError(() => this.getFallbackData())
    );
  }

  getTrending(): Observable<MovieResponse> {
    return this.makeRequest('/trending/all/week');
  }

  getPopularMovies(): Observable<MovieResponse> {
    return this.makeRequest('/movie/popular');
  }

  getTopRatedMovies(): Observable<MovieResponse> {
    return this.makeRequest('/movie/top_rated');
  }

  getUpcomingMovies(): Observable<MovieResponse> {
    return this.makeRequest('/movie/upcoming');
  }

  getPopularTVShows(): Observable<MovieResponse> {
    return this.makeRequest('/tv/popular');
  }

  getTopRatedTVShows(): Observable<MovieResponse> {
    return this.makeRequest('/tv/top_rated');
  }

  getNetflixOriginals(): Observable<MovieResponse> {
    // Netflix provider ID is 8
    return this.makeRequest('/discover/tv?with_networks=213');
  }

  getActionMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=28');
  }

  getComedyMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=35');
  }

  getHorrorMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=27');
  }

  getRomanceMovies(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=10749');
  }

  getDocumentaries(): Observable<MovieResponse> {
    return this.makeRequest('/discover/movie?with_genres=99');
  }
}
