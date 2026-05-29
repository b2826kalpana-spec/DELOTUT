/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  name: string;
  icon?: string; // name of a Lucide icon
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // base price in rubles
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  isPopular?: boolean;
}

export interface Master {
  id: string;
  fullName: string;
  phone: string;
  telegram: string;
  rating: number;
  serviceIds: string[]; // List of service IDs they can perform
  districtIds: string[]; // List of district IDs they serve
  status: 'pending' | 'active' | 'inactive' | 'approved' | 'rejected' | 'paused' | string;
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientTelegram?: string;
  district?: string;
  status: 'new' | 'in_progress' | 'completed' | string;
  createdAt: string; // ISO date string
  serviceIds: string[]; // IDs of ordered services
  totalCost: number;
  assignedMasterId: string | null;
}

export interface District {
  id: string;
  name: string;
}
