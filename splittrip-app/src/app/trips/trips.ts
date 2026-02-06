import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, CurrencyRates } from '../api.service';
import { FirebaseService, Trip, User } from '../firebase.service';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class Trips implements OnInit {
  trips = signal<Trip[]>([]);
  selectedFilter = signal<'All' | 'Ongoing' | 'Planning' | 'Completed'>('All');
  isLoadingTrips = signal(false);
  currencyRates = signal<CurrencyRates>({});
  isLoadingRates = signal(false);
  currentUser = signal<User>({
    id: 'user-001',
    name: 'Alex Morgan',
    avatar: '👤',
    email: 'alex@example.com'
  });

  constructor(
    private router: Router,
    private apiService: ApiService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.loadTrips();
    this.loadCurrentUser();
    this.loadCurrencyRates();
  }

  loadCurrentUser() {
    this.firebaseService.getCurrentUser().subscribe(user => {
      this.currentUser.set(user);
    });
  }

  loadTrips() {
    this.isLoadingTrips.set(true);
    this.firebaseService.getTrips().subscribe(
      trips => {
        console.log('Loaded trips:', trips);
        this.trips.set(trips);
        this.isLoadingTrips.set(false);
      },
      error => {
        console.error('Error fetching trips:', error);
        this.isLoadingTrips.set(false);
      }
    );
  }

  setFilter(filter: string) {
    this.selectedFilter.set(filter as 'All' | 'Ongoing' | 'Planning' | 'Completed');
  }

  getFilteredTrips() {
    if (this.selectedFilter() === 'All') {
      return this.trips();
    }
    return this.trips().filter(trip => trip.status === this.selectedFilter());
  }

  isOwner(trip: Trip): boolean {
    return trip.ownerId === this.currentUser().id;
  }

  isMember(trip: Trip): boolean {
    return trip.members.includes(this.currentUser().id);
  }

  loadCurrencyRates() {
    this.isLoadingRates.set(true);
    this.apiService.getCurrencyRates('USD').subscribe({
      next: (data) => {
        this.currencyRates.set(data);
        this.isLoadingRates.set(false);
      },
      error: () => {
        this.currencyRates.set({
          EUR: 0.92,
          GBP: 0.79,
          JPY: 149.50,
          AUD: 1.53,
          CAD: 1.36,
          CHF: 0.88,
          INR: 83.12,
          MXN: 17.05,
          SGD: 1.34,
          HKD: 7.81
        });
        this.isLoadingRates.set(false);
      }
    });
  }

  joinTrip(trip: Trip) {
    this.firebaseService.joinTrip(trip.id, this.currentUser().id).subscribe(
      updated => {
        if (updated) {
          console.log('Joined trip:', trip.title);
          this.loadTrips(); // Reload trips to update UI
        }
      }
    );
  }

  leaveTrip(trip: Trip) {
    if (confirm('Are you sure you want to leave this trip?')) {
      this.firebaseService.leaveTrip(trip.id, this.currentUser().id).subscribe(
        updated => {
          if (updated) {
            console.log('Left trip:', trip.title);
            this.loadTrips(); // Reload trips to update UI
          }
        }
      );
    }
  }

  viewTrip(tripId: string) {
    console.log('Viewing trip:', tripId);
    // Navigate to trip details
  }

  editTrip(tripId: string) {
    const trip = this.trips().find(t => t.id === tripId);
    if (trip && this.isOwner(trip)) {
      console.log('Editing trip:', tripId);
      // Navigate to edit page
    } else {
      alert('You can only edit trips you created');
    }
  }

  deleteTrip(tripId: string) {
    const trip = this.trips().find(t => t.id === tripId);
    if (trip && this.isOwner(trip)) {
      if (confirm(`Are you sure you want to delete "${trip.title}"?`)) {
        this.firebaseService.deleteTrip(tripId, this.currentUser().id).subscribe(
          success => {
            if (success) {
              console.log('Deleted trip:', tripId);
              this.loadTrips(); // Reload trips to update UI
            }
          }
        );
      }
    } else {
      alert('You can only delete trips you created');
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
