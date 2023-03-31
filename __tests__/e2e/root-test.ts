import app from "@/app";
import * as supertest from "supertest";

const request = supertest(app);

const ENDPOINT = '/';

describe('test root path', () => {
  it('should be OK', async () => {
    await request.get(ENDPOINT)
      .expect(200);
  });
});