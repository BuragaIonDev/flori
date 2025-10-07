export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Fresh Flowers,
            <span className="block bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Delivered Daily
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Hand-crafted arrangements for every occasion. Same-day delivery available.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#featured"
              className="px-8 py-4 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Shop Featured
            </a>
            <a
              href="#catalog"
              className="px-8 py-4 bg-white text-rose-500 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-rose-500"
            >
              View All Flowers
            </a>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
    </div>
  );
}
