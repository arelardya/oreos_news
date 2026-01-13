export default function AboutPage() {
  return (
    <div className="py-12 px-4 bg-gradient-to-b from-primary via-accent to-pink-50 dark:from-primary-dark dark:via-pink-300 dark:to-pink-100 min-h-screen pt-32">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-pink-300 mb-8">
            About Oreo's News
          </h1>
          
          <div className="space-y-8">
            <section>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Hi love 😊, this page will be a memorial and a fun thing to do while we have this long distance relationship! 
              </p>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                This will be updated every day, so be sure to check this page out 😁
              </p>
              <p className="text-lg md:text-xl text-primary dark:text-pink-300 font-medium leading-relaxed">
                Love you always Masyanda. See you around~ 💕✨
              </p>
            </section>

            <section className="bg-pink-50 dark:bg-gray-700 rounded-2xl p-6 mt-8">
              <p className="text-center text-gray-700 dark:text-gray-300 italic">
                "Every day is a new memory, every article is a piece of us" 🌸
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
