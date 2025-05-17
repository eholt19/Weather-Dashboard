import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body as { city: string };

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  // TODO: save city to search history
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    return res.json(weatherData);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch weather data'});
  }

});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedHistory = await HistoryService.removeCity(id);
    res.json(updatedHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
