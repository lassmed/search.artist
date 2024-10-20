
import { BASE_URL } from '../utils/constants';
import axios from 'axios';

export class ArtistRepository {

    private static instance: ArtistRepository;
    static getInstance() {
        if (!ArtistRepository.instance) {
            ArtistRepository.instance = new ArtistRepository();
        }
        return ArtistRepository.instance;
    }

    findArtistByName = async (artist: string, limit: string = "20", page: string = "1") => {
        try {
            const apiResponse = await axios.get(BASE_URL, {
                params: {
                    method: 'artist.search',
                    artist,
                    limit,
                    page,
                    api_key: process.env.API_KEY,
                    format: 'json',
                },
            });
            return apiResponse.data;
        } catch (err: any) {
            throw new Error('Error retrieving artist by name from the api : ' + err.message);
        }
    }

}
