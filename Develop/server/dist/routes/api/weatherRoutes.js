import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    // TODO: GET weather data from city name
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }
    // TODO: save city to search history
    try {
        const weatherData = await WeatherService.getWeatherForCity(city);
        await HistoryService.addCity(city);
        return res.json(weatherData);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const history = await HistoryService.getCities();
        res.json(history);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read search history' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedHistory = await HistoryService.removeCity(id);
        res.json(updatedHistory);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete city from history' });
    }
});
export default router;
