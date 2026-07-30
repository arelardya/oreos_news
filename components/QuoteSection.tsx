import Reveal from './Reveal';

export default function QuoteSection() {
  return (
    <section className="bg-blush-light py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <Reveal className="text-center md:text-left order-2 md:order-1">
          <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-4">
            Our story
          </p>
          <p className="font-serif text-3xl md:text-5xl text-ink italic leading-snug mb-5">
            "if it's meant to be, it will be."
          </p>
          <p className="text-gray-600 text-sm tracking-wide">— Ghalyndra</p>
        </Reveal>

        <Reveal delay={150} className="relative h-64 md:h-80 order-1 md:order-2">
          <div className="absolute left-[8%] top-4 -rotate-6 bg-white p-2 pb-7 shadow-lg w-36 sm:w-40 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src="/assets/1.webp" alt="" className="w-full h-28 sm:h-32 object-cover" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 rotate-2 bg-white p-2 pb-7 shadow-lg w-36 sm:w-40 z-10 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src="/assets/2.webp" alt="" className="w-full h-28 sm:h-32 object-cover" />
          </div>
          <div className="absolute right-[8%] top-8 rotate-6 bg-white p-2 pb-7 shadow-lg w-36 sm:w-40 hover:rotate-0 hover:scale-105 transition-transform duration-300">
            <img src="/assets/3.webp" alt="" className="w-full h-28 sm:h-32 object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
