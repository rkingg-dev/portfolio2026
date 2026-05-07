# RKINGG // Portfolio 2026

Modern web experiences designed with clarity, built with structure, and focused on how people actually use products.

This project started as a personal portfolio, but eventually evolved into a larger experimental workspace where I can continuously improve my workflow, design systems, and full stack development skills using Next.js and Supabase.

The goal of this project is not only to showcase selected work, but also to create a real environment for exploring frontend architecture, backend systems, UI/UX direction, authentication flows, API handling, dashboards, and client management tools.

---

## Overview

Portfolio2026 is a personal web platform focused on:

- Portfolio presentation
- Full stack experimentation
- Client portal concepts
- Personal dashboard systems
- Backend and API practice
- UI/UX exploration
- Modern deployment workflows

This repository acts as both a production portfolio and an active learning environment for building scalable applications using modern web technologies.

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / Services
- Supabase
- Next.js API Routes
- Nodemailer

### Deployment
- Vercel
- Hostinger SMTP

---

## Development

Install dependencies:

```bash
npm install
```

Start the local app:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Environment Variables

Example `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=yourpassword
SMTP_FROM=no-reply@domain.com

CONTACT_TO=hello@domain.com
CONTACT_CC=your@email.com
```

---

## Current Features

- Responsive portfolio homepage
- Project showcase layout
- Notes and process sections
- Contact form API
- Dark mode support
- Smooth UI transitions
- Client-area concept UI
- Personal dashboard planning structure

---

## Content Structure

The current portfolio content is currently static and managed inside:

```bash
src/app/page.tsx
```

Portfolio items currently follow this structure:

```ts
{
  slug: 'project-slug',
  title: 'Project title',
  date: '2026-04-18',
  description: 'Short summary for the listing view.',
  thumbnail: 'https://example.com/project-thumbnail.jpg',
  role: 'Design and frontend',
  stack: ['Next.js', 'TypeScript'],
  details: ['Longer detail for the project page.'],
}
```

Sidebar copy and intro labels live in:

```bash
src/components/Intro.tsx
```

---

## Vision

Most portfolios only display projects.

This project is designed to slowly evolve into a real working ecosystem that combines portfolio presentation with actual product systems and internal tools.

Planned direction includes:

- Authentication system
- Secure client portal
- Project and task management
- Notes and documentation system
- Admin dashboard
- Finance tracking
- Role-based access
- CMS-like content management
- Database-driven portfolio entries
- File and media handling
- Accessibility-focused frontend improvements

---

## Development Philosophy

This project focuses on:

- Clean structure over unnecessary complexity
- UI that feels intentional
- Maintainable systems
- Accessibility awareness
- Performance-conscious development
- Realistic product architecture
- Learning through actual implementation

---

## Status

This project is actively evolving.

Some sections currently use placeholder content while backend systems and architecture continue to expand over time.

---

## Author

Roman King Garcia  
Web Development Manager  
Philippines

Portfolio: https://rkingg.com

---

## License

This project is intended for personal learning, experimentation, and portfolio purposes.