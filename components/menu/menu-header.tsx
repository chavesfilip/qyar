import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import type { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
}

export function MenuHeader({ restaurant }: Props) {
  return (
    <header className="bg-white border-b border-border/30 shadow-sm">
      {/* Cover band */}
      <div className="h-2 bg-primary w-full" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Logo */}
          {restaurant.logo_url ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center">
              <span className="font-display text-3xl font-bold text-primary">
                {restaurant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Name & description */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="text-muted-foreground mt-1.5 text-sm max-w-sm leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>

          {/* Contact info */}
          {(restaurant.address || restaurant.phone) && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {restaurant.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a
                    href={`https://wa.me/${restaurant.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
