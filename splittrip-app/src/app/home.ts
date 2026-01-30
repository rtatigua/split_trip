import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  // User state
  currentUser = signal({ name: 'Alex Morgan', avatar: '👤' });
  
  // Stats for highlights section
  stats = signal([
    { number: '10k+', label: 'Active Travelers', icon: '✈️' },
    { number: '500+', label: 'Destinations', icon: '🌍' },
    { number: 'AI', label: 'Smart Planning', icon: '🤖' }
  ]);

  isLoading = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  explorePlans() {
    this.router.navigate(['/my-trips']);
  }

  startPlanning() {
    this.router.navigate(['/plan']);
  }

  navigateTo(section: string) {
    if (section === 'explore') {
      this.router.navigate(['/my-trips']);
    } else if (section === 'my-trips') {
      this.router.navigate(['/my-trips']);
    }
  }

  logout() {
    console.log('Logout clicked');
    // In a real app, handle logout logic here
  }
}

