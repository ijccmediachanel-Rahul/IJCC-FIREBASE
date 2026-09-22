"use client";

import { Calendar as CalendarIcon, Clock, MapPin, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";
import placeholders from "@/app/lib/placeholder-images.json";
import { client } from "@/sanity/lib/client";
import { EVENTS_QUERY, EVENTS_PAGE_QUERY } from "@/sanity/lib/queries";

const defaultEventsData = [
  {
    id: 13,
    date: "2026-10-01",
    imageUrl: "https://i.ibb.co/1tJC90hN/Whats-App-Image-2026-04-16-at-16-31-577777.jpg",
    hint: "japan business tour 2026 industrial healthcare consumer sectors",
    isVertical: true,
    href: "/contact"
  },
  {
    id: 12,
    date: "2026-09-28",
    imageUrl: "https://i.ibb.co/6c8pjrhZ/Whats-App-Image-2026-04-16-at-16-31-5777.jpg",
    hint: "japan business tour 2026 food pharma cosmetics healthcare",
    isVertical: true,
    href: "/contact"
  },
  {
    id: 11,
    date: "2026-09-05",
    imageUrl: "https://i.ibb.co/v40Ns8q4/Whats-App-Image-2026-04-16-at-16-31-577.jpg",
    hint: "japan business tour 2026 advanced manufacturing energy electronics",
    isVertical: true,
    href: "/contact"
  },
  {
    id: 10,
    date: "2026-06-29",
    imageUrl: "https://i.ibb.co/VWzYLGnC/Whats-App-Image-2026-04-16-at-16-31-58.jpg",
    hint: "manufacturing engineering japan business tour 2026",
    isVertical: true,
    href: "/contact"
  },
  {
    id: 9,
    date: "2026-06-21",
    imageUrl: "/images/events/agri-food-delegation.jpg",
    hint: "agri food processing delegation japan",
    isVertical: true,
    href: "/contact"
  },
  {
    id: 1,
    date: "2026-05-17",
    imageUrl: "https://i.postimg.cc/GhjCyy47/9thmarch-flayer.jpg",
    hint: "tokyo business delegation flyer",
    isVertical: true,
    href: "/contact"
  },
  {
    id: 8,
    date: "2026-04-01",
    imageUrl: placeholders.japanImmersivePoster.url,
    hint: placeholders.japanImmersivePoster.hint,
    isVertical: true,
    href: "/events/japan-immersive-program"
  },
  {
    id: 2,
    date: "2026-01-16",
    imageUrl: "https://i.ibb.co/WpWSq89m/Screenshot-2-12-2025-125555.jpg",
    hint: "business delegation",
    isVertical: false,
    href: "/contact"
  },
  {
    id: 3,
    date: "2025-10-11",
    imageUrl: "https://i.postimg.cc/3xCPnydB/Matsuri-Bigposter.png",
    hint: "japan festival",
    isVertical: true,
    href: "https://www.instagram.com/p/DOnlVZPEfJ6/?igsh=MWI3enhqYXpramd3aw==",
  },
  {
    id: 4,
    date: "2025-11-07",
    imageUrl: "https://i.postimg.cc/VvZSTtBC/7-NOV-EVENT.jpg",
    hint: "business seminar",
    isVertical: true,
    href: "https://www.instagram.com/p/DOc9zoOkUkh/?igsh=OGpzMDRhbXA2anBt",
  },
  {
    id: 5,
    date: "2025-12-13",
    imageUrl: "https://i.postimg.cc/CL3BP6v9/konnichiwa-japan.png",
    hint: "cultural event",
    isVertical: true,
    href: "https://www.instagram.com/p/DOc7xSuEfHe/?utm_source=ig_web_copy_link",
  },
  {
    id: 6,
    date: "2026-01-20",
    imageUrl: "https://picsum.photos/seed/tech-summit/800/400",
    hint: "tech conference",
    isVertical: false,
  },
];

export default function EventsPage() {
  const [isClient, setIsClient] = useState(false);
  const [cmsEvents, setCmsEvents] = useState<any[]>([]);
  const [cmsPage, setCmsPage] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    async function fetchEvents() {
      try {
        const [eventsData, pageData] = await Promise.all([
          client.fetch(EVENTS_QUERY),
          client.fetch(EVENTS_PAGE_QUERY)
        ]);
        if (eventsData && eventsData.length > 0) {
          setCmsEvents(eventsData);
        }
        if (pageData) setCmsPage(pageData);
      } catch (err) {
        console.error("Failed to fetch sanity events", err);
      }
    }
    fetchEvents();
  }, []);

  const defaultEvents = defaultEventsData.map(event => ({
    ...event,
    title: t(`event_${event.id}_title`),
    displayDate: t(`event_${event.id}_displayDate`),
    time: t(`event_${event.id}_time`),
    location: t(`event_${event.id}_location`),
    description: t(`event_${event.id}_description`),
  }));

  // Events come from the CMS when available, otherwise built-in defaults.
  const events = (cmsEvents.length > 0
    ? cmsEvents.map((event: any) => ({
        id: event._id,
        date: event.date ? event.date.slice(0, 10) : "2026-01-01",
        imageUrl: event.imageUrl,
        isVertical: !!event.isVertical,
        href: event.registrationLink || undefined,
        title: event.title || "TBA",
        displayDate: event.date
          ? new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
          : "TBA",
        time: event.time || "TBA",
        location: event.location || "TBA",
        description: event.description || "",
      }))
    : defaultEvents);

  const eventDates = events.map(event => new Date(event.date + 'T00:00:00'));

  const modifiers = {
    event: eventDates,
  };

const modifiersStyles = {
  event: {
    backgroundColor: 'hsl(var(--sakura-pink))',
    color: 'hsl(var(--primary))',
  },
};


  return (
    <div className="container py-12">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tighter sm:text-5xl">{cmsPage?.title || t('events_page_title')}</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
          {cmsPage?.description || t('events_page_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {events.map((event, index) => (
            <Card key={index} className={cn("flex flex-col overflow-hidden md:flex-row shadow-md hover:shadow-lg transition-shadow")}>
              {event.imageUrl && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className={cn(
                        "relative flex-shrink-0 cursor-pointer w-full",
                        event.isVertical ? "md:w-1/3 aspect-[2/3] md:aspect-auto" : "md:w-1/2 aspect-video md:aspect-auto"
                    )}>
                      <Image 
                          src={event.imageUrl} 
                          alt={event.title} 
                          layout="fill" 
                          objectFit={(event.isVertical ? "contain" : "cover")}
                         
                          className={cn("transition-transform duration-300 hover:scale-105", event.isVertical && "bg-secondary p-2")}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0">
                    <div className={cn("relative", event.isVertical ? "aspect-[2/3] h-[80vh] mx-auto" : "aspect-video")}>
                        <Image src={event.imageUrl} alt={event.title} fill className="object-contain" />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className="flex flex-col justify-between p-6 flex-1">
                <Link href={event.href || "#"} target={event.href?.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" className={cn("flex flex-col justify-between h-full group", !event.href && "pointer-events-none")}>
                    <div>
                    <CardHeader className="p-0">
                        <CardTitle className="font-headline text-xl group-hover:underline">{event.title}</CardTitle>
                        <CardDescription className="pt-2 line-clamp-3">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4 text-sm p-0 pt-4">
                        <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{event.displayDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{event.time}</span>
                        </div>
                        <div className="flex items-center col-span-2 gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{event.location}</span>
                        </div>
                    </CardContent>
                    </div>
                    {event.href && (
                      <div className="mt-6">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-5 py-2 text-sm font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          {event.href.includes('/events/') ? 'Explore Program' : 'Learn More'} 
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    )}
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{cmsPage?.calendarTitle || t('events_calendar_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <Calendar
                  mode="single"
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  className="rounded-md border p-0"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              ) : (
                <div className="rounded-md border p-0 h-[300px] w-[320px] animate-pulse bg-muted" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
