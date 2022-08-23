import { AdmissionPeriodModel } from '../../../models/AdmissionPeriod'
const request = require("supertest")
const baseURL = "http://localhost:3000"


describe("GET /applications/period", () => {
    beforeAll(async () => {
        await AdmissionPeriodModel.findOneAndUpdate(
            {}, 
            {startDate: "2022-01-01", endDate: "2023-01-01"}, {
                new: true,
                upsert: true,
            })
    })
    it("should return 200", async () => {
      const response = await request(baseURL).get("/applications/period/");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(null);
    });
    it("should return todos", async () => {
      const response = await request(baseURL).get("/todos");
      expect(response.body.data.length >= 1).toBe(true);
    });
  });