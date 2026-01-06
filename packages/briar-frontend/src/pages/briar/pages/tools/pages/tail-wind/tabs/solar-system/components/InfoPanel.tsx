import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { getPlanetDetails } from '../services/geminiService';
import { LoadingState, PlanetData } from '../types';

interface InfoPanelProps {
	planet: PlanetData | null;
	onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
	const [aiContent, setAiContent] = useState<string>('');
	const [loadingState, setLoadingState] = useState<LoadingState>('idle');

	useEffect(() => {
		if (planet) {
			setLoadingState('loading');
			setAiContent('');

			const fetchData = async () => {
				const text = await getPlanetDetails(planet.name);
				setAiContent(text);
				setLoadingState('success');
			};

			fetchData();
		}
	}, [planet]);

	if (!planet) return null;

	return (
		<div className="absolute top-4 right-4 w-80 max-w-[90vw] bg-black/80 backdrop-blur-md text-white rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
			{/* Header */}
			<div className="p-5 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-gray-900 to-black">
				<div>
					<h2 className="text-2xl font-bold tracking-wider">{planet.name.toUpperCase()}</h2>
					<p className="text-xs text-gray-400 mt-1">Solar System Object</p>
				</div>
				<button
					onClick={onClose}
					className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{/* Scrollable Content */}
			<div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
				{/* Basic Stats */}
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="bg-white/5 p-3 rounded-lg">
						<span className="block text-gray-500 text-xs">Distance (AU approx)</span>
						<span className="font-mono text-cyan-400">{planet.distance}</span>
					</div>
					<div className="bg-white/5 p-3 rounded-lg">
						<span className="block text-gray-500 text-xs">Relative Size</span>
						<span className="font-mono text-cyan-400">{planet.size}x</span>
					</div>
				</div>

				{/* Static Description */}
				<div className="bg-white/5 p-4 rounded-lg">
					<p className="text-gray-300 text-sm leading-relaxed">{planet.description}</p>
				</div>

				{/* Gemini AI Content */}
				<div className="pt-2 border-t border-white/10">
					<div className="flex items-center gap-2 mb-3">
						<div
							className={`w-2 h-2 rounded-full ${loadingState === 'loading' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}
						></div>
						<h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
							Gemini Analysis
						</h3>
					</div>

					{loadingState === 'loading' ? (
						<div className="space-y-2 animate-pulse">
							<div className="h-3 bg-white/10 rounded w-3/4"></div>
							<div className="h-3 bg-white/10 rounded w-full"></div>
							<div className="h-3 bg-white/10 rounded w-5/6"></div>
						</div>
					) : (
						<div className="text-sm text-gray-200 prose prose-invert prose-sm max-w-none">
							<ReactMarkdown>{aiContent}</ReactMarkdown>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
