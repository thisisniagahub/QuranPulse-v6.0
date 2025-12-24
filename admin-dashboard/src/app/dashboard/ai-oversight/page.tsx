export default function AIOversightPage() {
    return (
        <div className="p-8 space-y-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Oversight (RLHF)</h2>
                    <p className="text-slate-400">Review Hallucinations, Flags, and User Feedback for `Ustaz AI` training.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium">12 Flagged Chats</span>
                    <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">5 Low Ratings</span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Flagged Conversations Queue */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-200">Flagged for Review</h3>
                    {[
                        { id: 'chat_1', trigger: 'Keyword "Fatwa"', snippet: 'User asked about unauthorized fatwa regarding bitcoin...', severity: 'high' },
                        { id: 'chat_2', trigger: 'Negative Sentiment', snippet: 'AI answer was deemed "confusing" by user.', severity: 'medium' },
                        { id: 'chat_3', trigger: 'Hallucination Check', snippet: 'Verse reference 2:256 did not match quoting.', severity: 'low' },
                    ].map((item) => (
                        <div key={item.id} className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-xs text-slate-500">{item.id}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.severity === 'high' ? 'bg-red-500 text-white' :
                                        item.severity === 'medium' ? 'bg-amber-500 text-black' :
                                            'bg-blue-500 text-white'
                                    }`}>{item.severity}</span>
                            </div>
                            <div className="text-sm font-medium text-slate-200 mb-1">{item.trigger}</div>
                            <div className="text-xs text-slate-400 line-clamp-2">"{item.snippet}"</div>
                            <div className="mt-3 flex gap-2">
                                <button className="flex-1 py-1 text-xs bg-emerald-900/50 text-emerald-400 rounded border border-emerald-900 hover:bg-emerald-900 transition-colors">Approve (Safe)</button>
                                <button className="flex-1 py-1 text-xs bg-indigo-900/50 text-indigo-400 rounded border border-indigo-900 hover:bg-indigo-900 transition-colors">Correct & Train (RLHF)</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Prompt Engineering Playground */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col h-[600px]">
                    <h3 className="text-lg font-medium text-slate-200 mb-4">Prompt Monitoring (Live)</h3>

                    <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 mb-4 font-mono text-xs text-slate-300 overflow-y-auto">
                        <div className="text-slate-500">// System Prompt</div>
                        <div className="mb-4 text-emerald-400">You are Ustaz AI. You must adhere to JAKIM guidelines...</div>

                        <div className="text-slate-500">// User Input</div>
                        <div className="mb-4 text-white">Apakah hukum melabur dalam ASB?</div>

                        <div className="text-slate-500">// AI Output (Gemini-1.5-Flash)</div>
                        <div className="text-slate-300">
                            Berdasarkan keputusan Muzakarah Jawatankuasa Fatwa Majlis Kebangsaan...
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500">// Source Citations</div>
                        <div className="text-blue-400 underline cursor-pointer">e-smaf.islam.gov.my?id=342</div>
                    </div>

                    <div className="flex gap-2">
                        <input className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white" placeholder="Test a query against safety filters..." />
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium">Run Test</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
