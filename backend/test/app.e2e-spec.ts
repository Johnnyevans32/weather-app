import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WeatherProviderType } from '../src/weather/enums/weather-provider.enum';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          switch (key) {
            case 'WEATHER_PROVIDER':
              return WeatherProviderType.MOCK;
            default:
              return null;
          }
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configService = moduleFixture.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Weather Endpoints', () => {
    it('/weather/popular (GET)', () => {
      return request(app.getHttpServer())
        .get('/weather/popular')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('main');
          expect(res.body[0].main).toHaveProperty('temp');
          expect(res.body[0].main).toHaveProperty('humidity');
          expect(res.body[0]).toHaveProperty('weather');
          expect(res.body[0]).toHaveProperty('wind');
        });
    });

    it('/weather/search (GET)', () => {
      return request(app.getHttpServer())
        .get('/weather/search?country=uk')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('main');
          expect(res.body.main).toHaveProperty('temp');
          expect(res.body.main).toHaveProperty('humidity');
          expect(res.body).toHaveProperty('weather');
          expect(res.body).toHaveProperty('wind');
        });
    });

    it('/weather/:city (GET)', () => {
      return request(app.getHttpServer())
        .get('/weather/london')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('city');
          expect(res.body).toHaveProperty('weather');
          expect(res.body.weather).toHaveProperty('yesterday');
          expect(res.body.weather).toHaveProperty('today');
          expect(res.body.weather).toHaveProperty('tomorrow');
          expect(res.body.weather.yesterday).toHaveProperty('main');
          expect(res.body.weather.today).toHaveProperty('main');
          expect(res.body.weather.tomorrow).toHaveProperty('main');
        });
    });
  });

  describe('AI Endpoints', () => {
    it('/ai/chat (POST)', () => {
      return request(app.getHttpServer())
        .post('/ai/chat')
        .send({ question: 'What\'s the weather like in London?' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('link');
          expect(res.body.link).toBe('/weather/London');
        });
    });

    it('/ai/chat (POST) - Invalid Question', () => {
      return request(app.getHttpServer())
        .post('/ai/chat')
        .send({ question: 'What\'s the weather like?' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('couldn\'t determine');
        });
    });
  });

  describe('Rate Limiting', () => {
    it('should limit requests after threshold', async () => {
      const requests = Array(101).fill(null).map(() =>
        request(app.getHttpServer())
          .get('/weather/popular')
          .expect((res) => {
            if (res.status === 429) {
              expect(res.body).toHaveProperty('message');
              expect(res.body.message).toContain('Too Many Requests');
            }
          }),
      );

      await Promise.all(requests);
    });
  });
});
