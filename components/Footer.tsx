"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-700 bg-black">
      <div className="px-6 py-8">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-xs uppercase tracking-widest font-mono">
          {/* Column 1 */}
          <div>
            <h4 className="text-cyan mb-4">{"// Navigation"}</h4>
            <ul className="space-y-2">
              {["About", "Work", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    &#8212; {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-cyan mb-4">{"// Connect"}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  &#8212; GitHub
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  &#8212; LinkedIn
                </span>
              </li>
              <li>
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  &#8212; Email
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-cyan mb-4">{"// Status"}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-cyan">&#9679;</span> All systems
                operational
              </li>
              <li>Build: v0.1.0</li>
              <li>Framework: Next.js 15</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-mono uppercase tracking-widest">
          <span>
            &copy; {year} Kinnear Systems. All rights reserved.
          </span>
          <span className="mt-2 sm:mt-0">
            Designed &amp; built with precision
          </span>
        </div>
      </div>
    </footer>
  );
}
