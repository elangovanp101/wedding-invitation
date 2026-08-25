export type MusicSection = 'english' | 'tamil';

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toUtcCompact(iso: string) {
  const d = new Date(iso);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

type CalendarEvent = { title: string; start: string; end: string; venue: string; details?: string };

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toUtcCompact(event.start)}/${toUtcCompact(event.end)}`,
    location: event.venue,
    details: event.details ?? '',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

// Works for Apple Calendar, Outlook, and any client that opens .ics files.
export function icsDataUrl(event: CalendarEvent) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elangovan and Selvaveena//Wedding//EN',
    'BEGIN:VEVENT',
    `UID:${event.title.replace(/\s+/g, '-')}-${event.start}@elanveena.einweit.com`,
    `DTSTAMP:${toUtcCompact(new Date().toISOString())}`,
    `DTSTART:${toUtcCompact(event.start)}`,
    `DTEND:${toUtcCompact(event.end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}`,
    `DESCRIPTION:${(event.details ?? '').replace(/,/g, '\\,')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}

export const weddingData = {
  couple: {
    english: {
      name: "Elangovan ♥ Selvaveena",
      story: "Elan and Veena are delighted to invite you to be part of their wedding celebrations in Bangalore — a journey that brings together faith, family, love, and Tamil tradition."
    },
    tamil: {
      name: "இளங்கோவன் ♥ செல்வவீணா",
      story: "இளங்கோவன் மற்றும் செல்வவீணா உங்களை பெங்களூரில் நடைபெறும் திருமண விழாவில் கலந்து கொள்ள அழைக்கின்றனர் — இது நம்பிக்கை, குடும்பம், காதல் மற்றும் தமிழ் பாரம்பரியத்தை ஒன்றிணைக்கும் பயணம்."
    }
  },
  dates: [
    "11 November 2026",
    "12 November 2026",
    "13 November 2026"
  ],
  events: [
    {
      key: "church",
      title: "Church Wedding",
      date: "11 November 2026",
      time: "3:30 PM",
      venue: "St. Patrick's Church, MG Road, Bangalore",
      details: "",
      start: "2026-11-11T15:30:00+05:30",
      end: "2026-11-11T17:00:00+05:30",
    },
    {
      key: "reception",
      title: "Reception",
      date: "12 November 2026",
      time: "6:30 PM onwards",
      venue: "Palace Ground, Palace Sheesh Mahal, Bangalore",
      details: "",
      start: "2026-11-12T18:30:00+05:30",
      end: "2026-11-12T22:00:00+05:30",
    },
    {
      key: "traditional",
      title: "Traditional Wedding",
      date: "13 November 2026",
      time: "8:00 AM",
      venue: "Palace Ground, Palace Sheesh Mahal, Bangalore",
      details: "",
      start: "2026-11-13T08:00:00+05:30",
      end: "2026-11-13T10:30:00+05:30",
    }
  ],
  venues: {
    church: {
      name: "St. Patrick's Church",
      address: "MG Road, Bangalore",
      viewMapUrl: mapsSearchUrl("St. Patrick's Church, MG Road, Bangalore"),
      directionsUrl: mapsDirectionsUrl("St. Patrick's Church, MG Road, Bangalore"),
    },
    reception: {
      name: "Palace Ground, Sheesh Mahal",
      address: "Bangalore",
      viewMapUrl: mapsSearchUrl("Palace Ground, Sheesh Mahal, Bangalore"),
      directionsUrl: mapsDirectionsUrl("Palace Ground, Sheesh Mahal, Bangalore"),
    },
    traditional: {
      name: "Palace Ground, Sheesh Mahal",
      address: "Bangalore",
      viewMapUrl: mapsSearchUrl("Palace Ground, Sheesh Mahal, Bangalore"),
      directionsUrl: mapsDirectionsUrl("Palace Ground, Sheesh Mahal, Bangalore"),
    }
  },
  // PLACEHOLDER: english track reuses the Tamil song for now — swap in an English-appropriate track later.
  musicTracks: {
    english: "/audio/tamil_song.mp3",
    tamil: "/audio/tamil_song2.mp3",
  } as Record<MusicSection, string>,
  // PLACEHOLDER: swap src with real photography. `size` drives the editorial masonry layout.
  gallery: [
    { src: "/images/elanveena.jpeg", alt: "Wedding detail", size: "wide" },
    { src: "/images/elanveena.jpeg", alt: "Couple portrait", size: "tall" },
    { src: "/images/elanveena.jpeg", alt: "Celebration moment", size: "square" },
    { src: "/images/elanveena.jpeg", alt: "Venue detail", size: "square" },
    { src: "/images/elanveena.jpeg", alt: "Couple candid", size: "tall" },
    { src: "/images/elanveena.jpeg", alt: "Wedding detail", size: "wide" },
  ] as { src: string; alt: string; size: 'wide' | 'tall' | 'square' }[],
  // PLACEHOLDER: sample guest wishes shown until a real backend/API is connected.
  wishes: [
    { name: "Priya & Karthik", message: "Wishing you a lifetime of love, laughter and togetherness!", reaction: "♥" },
    { name: "Aunty Meera", message: "So happy for you both — can't wait to celebrate in Bangalore!", reaction: "🌸" },
    { name: "Arun", message: "May your journey together be as beautiful as your story so far.", reaction: "🪔" },
  ],
};