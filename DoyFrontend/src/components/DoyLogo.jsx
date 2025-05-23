export default function DoyLogo({size=4}) {
  return (
        <div className="flex justify-center py-10">
          <div className={`w-${size*10} h-${size*10} flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-xl p-2 transform hover:scale-105 transition-transform duration-300`}>
            <img src="/image1.png" alt="DOY Logo" className={`w-${size*9} h-${size*9} rounded-full object-cover`} />
          </div>
        </div>)};