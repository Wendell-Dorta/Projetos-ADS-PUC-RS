import axios from 'axios';
import { tvMazeService } from '@/services/tvMazeService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('tvMazeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchShows', () => {
    it('deve retornar sugestões formatadas corretamente', async () => {
      const mockResponse = {
        data: [
          {
            show: {
              id: 123,
              name: 'Test Show',
              premiered: '2020-05-10',
              genres: ['Drama', 'Comedy'],
              network: { name: 'HBO' },
              image: { medium: 'http://image-url' }
            }
          }
        ]
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await tvMazeService.searchShows('Test');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows', {
        params: { q: 'Test' }
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 123,
        name: 'Test Show',
        premiered: '2020-05-10',
        genres: ['Drama', 'Comedy'],
        producer: 'HBO',
        image: 'http://image-url'
      });
    });

    it('deve retornar array vazio se a query for muito curta', async () => {
      const result = await tvMazeService.searchShows('a');
      expect(result).toEqual([]);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  describe('getShowDetails', () => {
    it('deve buscar e formatar detalhes completos da série', async () => {
      const showMock = { data: { id: 123, name: 'Test Show', premiered: '2020-05-10', genres: ['Drama', 'Action'], network: { name: 'Netflix' } } };
      const seasonsMock = { data: [ { id: 1 }, { id: 2 } ] };
      const crewMock = { data: [ { type: 'Creator', person: { name: 'John Doe' } } ] };

      mockedAxios.get
        .mockResolvedValueOnce(showMock)
        .mockResolvedValueOnce(seasonsMock)
        .mockResolvedValueOnce(crewMock);

      const result = await tvMazeService.getShowDetails(123, 'Test Show');

      expect(result).toEqual({
        title: 'Test Show',
        seasons: 2,
        releaseDate: '2020-05-10',
        category: 'Drama',
        producer: 'Netflix',
        director: 'John Doe'
      });
    });

    it('deve cair no fallback se a requisição falhar', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      const result = await tvMazeService.getShowDetails(999, 'Fallback Show');

      expect(result).toEqual({
        title: 'Fallback Show',
        seasons: 1,
        releaseDate: "",
        category: "Drama",
        producer: "Independente",
        director: "Desconhecido"
      });
    });
  });
});
