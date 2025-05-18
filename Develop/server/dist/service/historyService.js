import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const filePath = path.resolve(__dirname, '../db/searchHistory.json');
// Complete the HistoryService class
class HistoryService {
    // Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            return [];
        }
    }
    // Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
    }
    // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read();
    }
    // Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.read();
        const exists = cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase());
        if (exists)
            return;
        const newCity = {
            name: cityName,
            id: uuidv4()
        };
        cities.push(newCity);
        await this.write(cities);
    }
    // * BONUS: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        let cities = await this.read();
        cities = cities.filter((city) => city.id !== id);
        await this.write(cities);
        return cities;
    }
}
export default new HistoryService();
