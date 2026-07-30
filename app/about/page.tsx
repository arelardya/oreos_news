import Logo from '@/components/Logo';
import Reveal from '@/components/Reveal';

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <div
        className="h-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #F3D9D0 0px, #F3D9D0 22px, #E8AFA3 22px, #E8AFA3 44px)',
        }}
      />

      <div className="container mx-auto max-w-4xl px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-primary-dark/70 mb-2">
            A little note
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary">
            About Masyandra
          </h1>
        </div>

        <Reveal className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-10 items-center">
          <div className="space-y-4 text-center md:text-right">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Hi love 😊, this page will be a memorial and a fun thing to do while we have this long distance relationship!
            </p>
          </div>

          <Logo size="lg" className="mx-auto" />

          <div className="space-y-4 text-center md:text-left">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              This will be updated every day, so be sure to check this page out 😁
            </p>
            <p className="font-serif italic text-lg md:text-xl text-primary">
              Love you always Masyanda. See you around~ 💕✨
            </p>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-16 max-w-xl mx-auto bg-white border border-dashed border-primary/30 rounded-lg p-6">
          <p className="text-center text-gray-600 font-serif italic text-lg">
            "Every day is a new memory, every article is a piece of us" 🌸
          </p>
        </Reveal>
      </div>
    </div>
  );
}
