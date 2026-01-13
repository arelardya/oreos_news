export default function QuoteSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <blockquote className="text-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-dashed border-primary/30 dark:border-pink-300/30 shadow-lg">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-primary dark:text-pink-300 italic leading-relaxed px-2">
            "if it's meant to be, it will be."
          </p>
          <footer className="mt-4 sm:mt-6 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
            - Ghalyndra
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
