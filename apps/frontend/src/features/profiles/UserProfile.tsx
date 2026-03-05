import { Link } from 'react-router-dom';

export const UserProfile = ({ profileData }: { profileData: any }) => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">← Home</Link>
                </header>

                <div className="bg-white rounded-3xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-100 pb-10 mb-10 text-center md:text-left">
                        <div className="w-28 h-28 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full overflow-hidden shadow-sm border border-gray-200/60 flex-shrink-0">
                            {profileData?.avatarUrl ? (
                                <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300 font-serif italic">
                                    {profileData?.username?.[0]?.toUpperCase() || 'W'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-serif text-gray-900 mb-3">{profileData?.username || 'Writer'}</h1>
                            <p className="text-gray-500 max-w-xl font-light leading-relaxed mb-6">{profileData?.bio || 'A thoughtful observer of the digital age.'}</p>

                            <div className="flex gap-8 justify-center md:justify-start">
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-2xl font-serif text-gray-900">{profileData?.postsCount || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-1">Essays</span>
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-2xl font-serif text-gray-900">{profileData?.followersCount || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-1">Readers</span>
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-2xl font-serif text-blue-600">{profileData?.streak || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mt-1">Day Streak</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Selected Works - Takes 2 cols */}
                        <div className="lg:col-span-2">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Selected Works</h2>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <time className="text-[11px] text-gray-400 font-medium mb-1 block">Oct {i + 10}, 2026</time>
                                        <h3 className="font-serif text-xl text-gray-900 group-hover:text-blue-600 transition-colors">On the Principles of Calm Technology</h3>
                                        <p className="text-gray-500 text-sm mt-2 font-light line-clamp-2">Exploring how intentional constraints and subtractive design can restore our fragmented attention...</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Consistency Graph - Takes 1 col */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Consistency</h2>
                            <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                                {Array.from({ length: 60 }).map((_, id) => {
                                    const intensity = Math.random();
                                    const bgMap = intensity > 0.8 ? 'bg-blue-600' : intensity > 0.5 ? 'bg-blue-400' : intensity > 0.2 ? 'bg-blue-200' : 'bg-gray-100';
                                    return (
                                        <div
                                            key={id}
                                            className={`w-3.5 h-3.5 rounded-[3px] ${bgMap} transition-all hover:scale-125 cursor-crosshair`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
