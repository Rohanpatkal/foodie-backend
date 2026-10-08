# Foodie - Backend API

RESTful API backend for Foodie online food ordering platform built with **Node.js**, **Express**, **TypeScript**, and **MongoDB (Mongoose)**.

## Features
- JWT authentication with HTTP-only cookies and role-based access control (Customer / Admin)
- Restaurant and Menu catalog management
- Order processing and lifecycle updates
- Delivery tracking and ratings
- MongoDB aggregation pipelines and automated database seeding

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Update your MongoDB connection URI and secrets in `.env`.

3. Seed initial database data (optional):
```bash
npm run seed
```

4. Start development server:
```bash
npm run dev
```

The API will be available at [http://localhost:5000](http://localhost:5000).
