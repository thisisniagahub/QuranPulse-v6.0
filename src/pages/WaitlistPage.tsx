import React, { useState } from 'react';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-raudhah-teal/20 bg-slate-900/80 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-raudhah-teal">QuranPulse</p>
        <h1 className="mt-3 text-3xl font-black">Waitlist</h1>
        <p className="mt-3 text-sm text-slate-300">
          Daftar emel anda untuk dapat akses awal feature baru QuranPulse.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            Terima kasih. Emel anda telah direkodkan.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="anda@email.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm outline-none transition-colors focus:border-raudhah-teal"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-raudhah-teal px-4 py-3 text-sm font-black text-black transition-colors hover:bg-raudhah-teal"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistPage;
