import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService, Trip, User } from '../firebase.service';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.css']
})
export class TripDetail implements OnInit {
  trip = signal<Trip | null>(null);
  currentUser = signal<User>({
    id: 'user-001',
    name: 'Alex Morgan',
    avatar: '👤',
    email: 'alex@example.com'
  });
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tripId = params.get('id');
      if (tripId) {
        this.loadTrip(tripId);
      }
    });
  }

  loadTrip(tripId: string) {
    this.isLoading.set(true);
    this.firebaseService.getTrip(tripId).subscribe(
      trip => {
        if (trip) {
          this.trip.set(trip);
          this.isLoading.set(false);
        } else {
          this.errorMessage.set('Trip not found');
          this.isLoading.set(false);
        }
      },
      error => {
        this.errorMessage.set('Error loading trip');
        console.error('Error loading trip:', error);
        this.isLoading.set(false);
      }
    );
  }

  isOwner(): boolean {
    const trip = this.trip();
    return trip ? trip.ownerId === this.currentUser().id : false;
  }

  isMember(): boolean {
    const trip = this.trip();
    return trip ? trip.members.includes(this.currentUser().id) : false;
  }

  joinTrip() {
    const trip = this.trip();
    if (trip) {
      this.firebaseService.joinTrip(trip.id, this.currentUser().id).subscribe(
        updatedTrip => {
          if (updatedTrip) {
            this.trip.set(updatedTrip);
          }
        }
      );
    }
  }

  leaveTrip() {
    const trip = this.trip();
    if (trip && confirm('Are you sure you want to leave this trip?')) {
      this.firebaseService.leaveTrip(trip.id, this.currentUser().id).subscribe(
        updatedTrip => {
          if (updatedTrip) {
            this.trip.set(updatedTrip);
          }
        }
      );
    }
  }

  editTrip() {
    const trip = this.trip();
    if (trip && this.isOwner()) {
      // Navigate to edit page (to be implemented)
      console.log('Edit trip:', trip.id);
    }
  }

  deleteTrip() {
    const trip = this.trip();
    if (trip && this.isOwner()) {
      if (confirm(`Are you sure you want to delete "${trip.title}"?`)) {
        this.firebaseService.deleteTrip(trip.id, this.currentUser().id).subscribe(
          success => {
            if (success) {
              this.router.navigate(['/my-trips']);
            }
          }
        );
      }
    }
  }

  goBack() {
    this.router.navigate(['/my-trips']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    // placeholder logout handler
    console.log('User logged out');
    this.router.navigate(['/']);
  }

  getStatusColor(): string {
    const trip = this.trip();
    if (!trip) return 'gray';
    switch (trip.status) {
      case 'Planning':
        return 'blue';
      case 'Ongoing':
        return 'green';
      case 'Completed':
        return 'gray';
      default:
        return 'gray';
    }
  }
}
