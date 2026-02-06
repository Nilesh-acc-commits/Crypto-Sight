import React from 'react';

const Navbar = ({ currentView, onNavigate, onLogout, user }) => {
    const navItems = [
        { name: 'Dashboard', id: 'dashboard' },
        { name: 'Wealth Calc', id: 'calculator' },
        { name: 'Compare', id: 'compare' },
    ];

    return (
        <nav className="sticky top-6 z-50 px-6 max-w-4xl mx-auto mb-10">
            <div className="bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20 relative z-50">
                <div className="flex items-center gap-2 font-bold text-white mr-4 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
                    <img src="/logo.png" alt="Crypto Sight Logo" className="w-8 h-8 object-contain" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] transition-all font-display tracking-wide" style={{ paddingLeft: '5px', paddingRight: '5px' }}>Crypto Sight</span>
                </div>

                <div className="flex items-center gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative
                                ${currentView === item.id
                                    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(0,229,255,0.1)] border border-white/5'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <span className="hidden sm:inline relative z-10">{item.name}</span>
                        </button>
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-2"></div>

                    {/* Profile Button */}
                    <button
                        onClick={() => onNavigate('profile')}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border
                            ${currentView === 'profile' ? 'bg-white/10 border-cyan-500/50' : 'border-transparent hover:bg-white/5'}
                         `}
                    >
                        {user?.picture ? (
                            <img src={user.picture} alt="Profile" className="w-6 h-6 rounded-full shadow-sm" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <span className="text-sm font-medium text-slate-300 hidden sm:block max-w-[80px] truncate">{user?.name}</span>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 text-slate-400 hover:text-red-400 hover:bg-white/5"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
