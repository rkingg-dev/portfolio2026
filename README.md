# rkingg__ Portfolio

Personal portfolio for selected work, process notes, and client links.

## Development

Install dependencies:

```bash
npm install
```

Start the local app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Content

The current portfolio content is static data in `src/app/page.tsx`.

Use this shape for new portfolio items:

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

The sidebar copy and menu labels live in `src/components/Intro.tsx`.
