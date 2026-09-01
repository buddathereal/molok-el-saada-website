import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const MAPS_URL = "https://www.google.com/maps/place/30%C2%B000'30.0%22N+31%C2%B012'48.0%22E/@30.0083256,31.210751,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.0083256!4d31.2133259?hl=ar";
const EMBED_SRC = "https://maps.google.com/maps?width=600&height=400&hl=ar&q=30%C2%B000%2730.0%22N%2031%C2%B012%2748.0%22E&t=h&z=15&ie=UTF8&iwloc=B&output=embed";

export function OfficeMap() {
  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 md:p-8 bg-[#0c0c0c] border border-[#c5a059]/30 rounded-[2.5rem] card-shadow text-right dir-rtl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white font-header">المخازن والمكتب للمعاينة</h3>
            <p className="text-xs text-[#c5a059] font-bold">موقع ملوك السعادة التفاعلي</p>
          </div>
        </div>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#a8843e] text-black font-black text-xs px-5 py-2.5 rounded-full transition-all shadow-lg hover:scale-105"
        >
          <span>تطبيق Google Maps</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Embedded Map Container */}
      <div className="w-full h-[350px] md:h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#141414]">
        <iframe
          title="Google Maps Location"
          src={EMBED_SRC}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

