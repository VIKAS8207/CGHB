const Home = () => {
  return (
    <section className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black tracking-tighter uppercase">
          Dashboard <span className="text-cghb-yellow text-xl">Overview</span>
        </h1>
        <p className="text-muted text-sm mt-1">Welcome to the CGHB Digital Infrastructure Command Center.</p>
      </header>

      {/* Featured Section */}
      <div className="glass-panel p-10 rounded-cghb-card border-l-4 border-l-cghb-yellow relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">New Housing Schemes Live</h2>
          <p className="text-muted max-w-md">Browse the latest residential developments across Chhattisgarh and start your application today.</p>
          <button className="mt-6 px-6 py-3 bg-cghb-yellow text-black font-black rounded-full hover:scale-105 transition-transform">
            View All Schemes
          </button>
        </div>
        
        {/* Subtle Background Glow for that Cyber feel */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cghb-yellow/10 blur-[100px] rounded-full" />
      </div>

      {/* Quick Stats / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Projects" value="124" />
        <StatCard label="Live Schemes" value="12" />
        <StatCard label="Applications" value="1.2k" />
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="glass-panel p-6 rounded-2xl group hover:border-cghb-yellow/30 transition-colors">
    <p className="text-xs font-black text-muted uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black group-hover:text-cghb-yellow transition-colors">{value}</p>
  </div>
);

export default Home;