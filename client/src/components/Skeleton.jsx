import React from 'react';
import './Skeleton.css';

export const HomeSkeleton = () => (
  <div className="skeleton-home">
    <div>
      <div className="skeleton skeleton-header" />
      <div className="skeleton skeleton-subheader" />
    </div>
    <div className="skeleton-row">
      <div className="skeleton skeleton-stat" />
      <div className="skeleton skeleton-stat" />
      <div className="skeleton skeleton-stat" />
    </div>
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-card--tall skeleton" />
  </div>
);

export const WorkoutSkeleton = () => (
  <div className="skeleton-home">
    <div className="skeleton skeleton-header" />
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-list-item" />
    <div className="skeleton skeleton-list-item" />
    <div className="skeleton skeleton-list-item" />
  </div>
);

export const NutritionSkeleton = () => (
  <div className="skeleton-home">
    <div className="skeleton skeleton-header" />
    <div className="skeleton-row">
      <div className="skeleton skeleton-stat" />
      <div className="skeleton skeleton-stat" />
      <div className="skeleton skeleton-stat" />
      <div className="skeleton skeleton-stat" />
    </div>
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-card" />
  </div>
);

export const AnalyticsSkeleton = () => (
  <div className="skeleton-home">
    <div className="skeleton skeleton-header" />
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-card" />
    <div className="skeleton skeleton-card" />
  </div>
);
