const axios = require('axios');

async function fetchWeather(lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weathercode&current_weather=true`;
    const { data } = await axios.get(url);
    return {
      source: 'open-meteo',
      current: data.current_weather || null,
      hourlySample: data.hourly ? {
        temperature_2m: data.hourly.temperature_2m?.slice(0, 24),
        precipitation_probability: data.hourly.precipitation_probability?.slice(0, 24)
      } : null
    };
  } catch (err) {
    return { error: 'Failed to fetch weather', details: err.message };
  }
}

function getSeasonalAdvice(lat, lng) {
  const month = new Date().getMonth() + 1; // 1..12
  let season = 'Moderate';
  if ([12,1,2].includes(month)) season = 'Winter';
  if ([3,4,5].includes(month)) season = 'Spring';
  if ([6,7,8].includes(month)) season = 'Monsoon/Summer';
  if ([9,10,11].includes(month)) season = 'Autumn';
  const best = ['Oct','Nov','Dec','Jan'].includes(new Date().toLocaleString('en-US',{month:'short'})) ? 'Good time to visit' : 'Okay time to visit';
  return { season, recommendation: best };
}

function getUpcomingEventsSample(place) {
  // Placeholder static examples; in production integrate a real events API
  return {
    place,
    upcoming: [
      { name: 'Local Cultural Festival', date: '2025-10-05', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800' },
      { name: 'Beach Music Night', date: '2025-10-12', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800' }
    ]
  };
}

function getDevelopmentSummary(status) {
  const notes = {
    Developed: 'Well-connected area with solid infrastructure and amenities.',
    Developing: 'Growing neighborhood with ongoing projects and improving facilities.',
    Underdeveloped: 'Basic services available; expect limited infrastructure.'
  };
  return { status, note: notes[status] || 'Info unavailable' };
}

module.exports = { fetchWeather, getSeasonalAdvice, getUpcomingEventsSample, getDevelopmentSummary };


