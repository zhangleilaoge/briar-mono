import { PlanetData } from './types';

// Distances and sizes are not to scale for visual clarity
export const PLANETS: PlanetData[] = [
	{
		name: 'Mercury',
		color: '#A5A5A5',
		size: 0.4,
		distance: 6,
		speed: 1.5,
		description: 'The smallest planet in our solar system and closest to the Sun.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991248482k_mercury.jpg'
	},
	{
		name: 'Venus',
		color: '#E3BB76',
		size: 0.9,
		distance: 9,
		speed: 1.2,
		description: 'Second planet from the Sun, named after the Roman goddess of love and beauty.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991248582k_venus_surface.jpg'
	},
	{
		name: 'Earth',
		color: '#2233FF',
		size: 1,
		distance: 13,
		speed: 1,
		description: 'Our home planet, the third planet from the Sun.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991247592k_earth_daymap.jpg'
	},
	{
		name: 'Mars',
		color: '#E27B58',
		size: 0.6,
		distance: 17,
		speed: 0.8,
		description:
			'The fourth planet from the Sun, a dusty, cold, desert world with a very thin atmosphere.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991248402k_mars.jpg'
	},
	{
		name: 'Jupiter',
		color: '#D8CA9D',
		size: 2.5,
		distance: 24,
		speed: 0.4,
		description: 'The largest planet in the solar system, a gas giant with a Great Red Spot.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991247762k_jupiter.jpg'
	},
	{
		name: 'Saturn',
		color: '#F4D03F',
		size: 2.2,
		distance: 32,
		speed: 0.3,
		hasRings: true,
		description: 'Adorned with a dazzling system of icy rings, Saturn is unique among the planets.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991247302k_saturn.jpg',
		ringMapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991247052k_saturn_ring_alpha.png'
	},
	{
		name: 'Uranus',
		color: '#93B8D9',
		size: 1.6,
		distance: 40,
		speed: 0.2,
		description: 'The seventh planet from the Sun, rotating on its side.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991247092k_uranus.jpg'
	},
	{
		name: 'Neptune',
		color: '#4b70dd',
		size: 1.5,
		distance: 48,
		speed: 0.1,
		description: 'The eighth and most distant major planet orbiting our Sun.',
		mapUrl:
			'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/runtime-images/17676991247372k_neptune.jpg'
	}
];
