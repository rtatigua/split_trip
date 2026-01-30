import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  duration: string;
  members: string[];
  memberCount: number;
  budget: string;
  image: string;
  status: 'Planning' | 'Ongoing' | 'Completed';
  ownerId: string;
  ownerName: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private currentUser = signal<User>({
    id: 'user-001',
    name: 'Alex Morgan',
    avatar: '👤',
    email: 'alex@example.com'
  });

  // Mock database - in production, this would be real Firebase
  private mockTripsDatabase: Trip[] = [
    {
      id: 'trip-001',
      title: 'Paris City Break',
      destination: '🇫🇷 Paris',
      duration: '5 days',
      members: ['user-001', 'user-002', 'user-003'],
      memberCount: 3,
      budget: '$2,400',
      image: '🗼',
      status: 'Ongoing',
      ownerId: 'user-001',
      ownerName: 'Alex Morgan',
      createdAt: Date.now() - 86400000
    },
    {
      id: 'trip-002',
      title: 'Tokyo Adventure',
      destination: '🇯🇵 Tokyo',
      duration: '7 days',
      members: ['user-002', 'user-004'],
      memberCount: 2,
      budget: '$3,200',
      image: '🗾',
      status: 'Planning',
      ownerId: 'user-002',
      ownerName: 'Jordan Smith',
      createdAt: Date.now() - 172800000
    },
    {
      id: 'trip-003',
      title: 'Barcelona Beach',
      destination: '🇪🇸 Barcelona',
      duration: '4 days',
      members: ['user-001', 'user-003', 'user-004', 'user-005'],
      memberCount: 4,
      budget: '$1,800',
      image: '🏖️',
      status: 'Planning',
      ownerId: 'user-003',
      ownerName: 'Sam Johnson',
      createdAt: Date.now() - 259200000
    },
    {
      id: 'trip-004',
      title: 'New York Exploration',
      destination: '🇺🇸 NYC',
      duration: '6 days',
      members: ['user-002', 'user-005'],
      memberCount: 2,
      budget: '$2,800',
      image: '🗽',
      status: 'Completed',
      ownerId: 'user-004',
      ownerName: 'Casey Williams',
      createdAt: Date.now() - 345600000
    },
    {
      id: 'trip-005',
      title: 'Rome Historical Tour',
      destination: '🇮🇹 Rome',
      duration: '5 days',
      members: ['user-003', 'user-005'],
      memberCount: 2,
      budget: '$2,100',
      image: '🏛️',
      status: 'Planning',
      ownerId: 'user-005',
      ownerName: 'Taylor Brown',
      createdAt: Date.now() - 432000000
    }
  ];

  constructor() {}

  getCurrentUser(): Observable<User> {
    return of(this.currentUser());
  }

  // Get all trips
  getTrips(): Observable<Trip[]> {
    return of(this.mockTripsDatabase);
  }

  // Get trips the user owns or is a member of
  getUserTrips(userId: string): Observable<Trip[]> {
    const userTrips = this.mockTripsDatabase.filter(
      trip => trip.ownerId === userId || trip.members.includes(userId)
    );
    return of(userTrips);
  }

  // Get a single trip
  getTrip(tripId: string): Observable<Trip | undefined> {
    const trip = this.mockTripsDatabase.find(t => t.id === tripId);
    return of(trip);
  }

  // Create a new trip
  createTrip(trip: Omit<Trip, 'id' | 'createdAt'>): Observable<Trip> {
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      createdAt: Date.now()
    };
    this.mockTripsDatabase.push(newTrip);
    return of(newTrip);
  }

  // Update trip (only if user is owner)
  updateTrip(tripId: string, updates: Partial<Trip>, userId: string): Observable<Trip | null> {
    const trip = this.mockTripsDatabase.find(t => t.id === tripId);
    if (!trip || trip.ownerId !== userId) {
      console.error('Not authorized to update this trip');
      return of(null);
    }
    Object.assign(trip, updates);
    return of(trip);
  }

  // Delete trip (only if user is owner)
  deleteTrip(tripId: string, userId: string): Observable<boolean> {
    const tripIndex = this.mockTripsDatabase.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
      return of(false);
    }
    const trip = this.mockTripsDatabase[tripIndex];
    if (trip.ownerId !== userId) {
      console.error('Not authorized to delete this trip');
      return of(false);
    }
    this.mockTripsDatabase.splice(tripIndex, 1);
    return of(true);
  }

  // Join a trip (add user to members)
  joinTrip(tripId: string, userId: string): Observable<Trip | null> {
    const trip = this.mockTripsDatabase.find(t => t.id === tripId);
    if (!trip) {
      return of(null);
    }
    if (!trip.members.includes(userId)) {
      trip.members.push(userId);
      trip.memberCount = trip.members.length;
    }
    return of(trip);
  }

  // Leave a trip (remove user from members)
  leaveTrip(tripId: string, userId: string): Observable<Trip | null> {
    const trip = this.mockTripsDatabase.find(t => t.id === tripId);
    if (!trip) {
      return of(null);
    }
    const index = trip.members.indexOf(userId);
    if (index > -1) {
      trip.members.splice(index, 1);
      trip.memberCount = trip.members.length;
    }
    return of(trip);
  }

  // Check if user is member of trip
  isMemberOfTrip(tripId: string, userId: string): boolean {
    const trip = this.mockTripsDatabase.find(t => t.id === tripId);
    return trip ? trip.members.includes(userId) : false;
  }

  // Check if user owns trip
  isOwnerOfTrip(tripId: string, userId: string): boolean {
    const trip = this.mockTripsDatabase.find(t => t.id === tripId);
    return trip ? trip.ownerId === userId : false;
  }

  // Update user profile
  updateUserProfile(userId: string, updates: Partial<User>): Observable<User> {
    const current = this.currentUser();
    if (current.id === userId) {
      const updated = { ...current, ...updates };
      this.currentUser.set(updated);
      return of(updated);
    }
    return of(current);
  }
}
